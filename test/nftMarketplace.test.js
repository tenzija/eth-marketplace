
const NftMarketplace = artifacts.require("NftMarketplace")
const { catchRevert } = require("./utils/exceptions")

// Mocha - testing framework
// Chai - assertion JS library

const getBalance = async address => web3.eth.getBalance(address)
const toBN = value => web3.utils.toBN(value)

const getGas = async result => {
    const tx = await web3.eth.getTransaction(result.tx)
    const gasUsed = toBN(result.receipt.gasUsed)
    const gasPrice = toBN(tx.gasPrice)
    const gas = gasUsed.mul(gasPrice)

    return gas
}

contract("NftMarketplace", accounts => {

    const nftId 
    = 
    "0x00000000000000000000000000003130"

    const proof 
    = 
    "0x0000000000000000000000000000313000000000000000000000000000003130"

    const nftId2 
    = 
    "0x00000000000000000000000000002130"

    const proof2 
    = 
    "0x0000000000000000000000000000213000000000000000000000000000002130"

    const value 
    = 
    "900000000"

    let _contract = null
    let contractOwner = null
    let buyer = null
    let nftHash = null

    before(async () => {
        _contract = await NftMarketplace.deployed()
        contractOwner = accounts[0]
        buyer = accounts[1]
    })

    describe("Purchase the new NFT", () => {

        before( async() => {
            await _contract.purchaseNft(nftId, proof, {
                from: buyer,
                value
            })
        })

        it("should not allowe to repurchase already owned nft", async () => {
            await catchRevert(_contract.purchaseNft(nftId, proof, {
                from: buyer,
                value
            }))
        })

        it("can get the purchased nft hash by index", async() => {
            const index = 0
            nftHash = await _contract.getNftHashAtIndex(index)

            const expectedHash = web3.utils.soliditySha3(
                { type: "bytes16", value: nftId },
                { type: "address", value: buyer }
            )

            assert.equal(nftHash, expectedHash, "nft hash and expected hash are not matching")
        })

        it("should match the purchased data of the nft", async() => {
            const expectedIndex = 0
            const expectedState = 0
            const nft = await _contract.getNftByHash(nftHash)

            assert.equal(nft.id, expectedIndex, "nft index should be 0")
            assert.equal(nft.price, value, `nft price should be ${value}`)
            assert.equal(nft.proof, proof, `nft proof should be ${proof}`)
            assert.equal(nft.owner, buyer, `nft buyer should be ${buyer}`)
            assert.equal(nft.state, expectedState, `nft index should be 
            ${expectedState}`)

        })
    })

    describe("Activate purchased NFT", () => {

        it ("should not be able to activate if not owner", async () => {
            await catchRevert(_contract.activateNft(nftHash, { from: buyer }))
        })

        it("should have status 'activated'", async () => {
            await _contract.activateNft(nftHash, { from: contractOwner })
            const nft = await _contract.getNftByHash(nftHash)
            const expectedState = 1

            assert.equal(nft.state, expectedState, "nftState and expectedState should match"
            )
        })
    })

    describe("Testing transferOwnership", () => {
        let currentOwner = null
        
        before( async() => {
            currentOwner = await _contract.getContractOwner()
        })
        

        it("getContractOwner should return deployer address", async () => {
            assert.equal(
                contractOwner, 
                currentOwner, 
                "contract and current owner are not matching"
            )
        })

        it("should not transfer ownership when owner is not sending the tx", async () => {
            await catchRevert(_contract.transferOwnership(accounts[3], { from: accounts[4] }))
        })

        it("should transferOwnership to third address from 'accounts'", async () => {
            await _contract.transferOwnership(accounts[2], { from: currentOwner })
            const owner = await _contract.getContractOwner()
            assert.equal(owner, accounts[2], "owner dosent match designated owner")
        })

        it("should transferOwnership back to initial contract owner", async () => {
            await _contract.transferOwnership(contractOwner, { from: accounts[2] })
            const owner = await _contract.getContractOwner()
            assert.equal(owner, contractOwner, "owner dosent match designated owner")
        })
    })

    describe("Deactivate NFT", () => {
        let nftHash2 = null
        let currentOwner = null

        before(async () => {
            await _contract.purchaseNft(nftId2, proof2, {from: buyer, value})
            nftHash2 = await _contract.getNftHashAtIndex(1)
            currentOwner = await _contract.getContractOwner()
        })

        it("should not be able to deactivate the nft if not owner", async () => {
            await catchRevert(_contract.deactivateNft(nftHash2, { from: buyer }))
        })

        it("should have status of deactivated and price 0", async () => {
            const beforeTxBuyerBalance = await getBalance(buyer)
            const beforeTxContractBalance = await getBalance(_contract.address)
            const beforeTxOwnerBalance = await getBalance(currentOwner)

            const result = await _contract.deactivateNft(nftHash2, { from: contractOwner })

            const afterTxBuyerBalance = await getBalance(buyer)
            const afterTxContractBalance = await getBalance(_contract.address)
            const afterTxOwnerBalance = await getBalance(currentOwner)
            
            const nft = await _contract.getNftByHash(nftHash2)
            const expectedState = 2
            const expectedPrice = 0
            const gas = await getGas(result)

            assert.equal(nft.state, expectedState, "nft is not deactivated")
            assert.equal(nft.price, expectedPrice, "nft price is not 0")

            assert.equal(
                toBN(beforeTxOwnerBalance).sub(gas).toString(),
                afterTxOwnerBalance,
                "contract owner balance is not correct"
            )
            
            assert.equal(
                toBN(beforeTxBuyerBalance).add(toBN(value)).toString(),
                afterTxBuyerBalance,
                "buyer balance is not correct"
            )

            assert.equal(
                toBN(beforeTxContractBalance).sub(toBN(value)).toString(),
                afterTxContractBalance,
                "contract balance is not correct"
            )
        })

        it("should not be able to activate deactivated nft", async () => {
            await catchRevert(_contract.activateNft(nftHash2, { from: contractOwner }))        
        })
    })

    describe("Repurchase NFT", () => {
        let nftHash2 = null

        before(async () => {
            nftHash2 = await _contract.getNftHashAtIndex(1)
        })

        it("should not repurchase when the nft doesnt exist", async () => {
            const notExistingHash = "0x5ceb3f8075c3dbb5d490c8d1e6c950302ed065e1a9031750ad2c6513069e3fc3"
            await catchRevert(_contract.repurchaseNft(notExistingHash, {from: buyer}))
        })

        it("should not repurchase with no nft owner", async () => {
            const notOwnerAddress = accounts[2]
            await catchRevert(_contract.repurchaseNft(nftHash2, { from: notOwnerAddress }))
        })

        it("should not be able to repurchase with the original buyer", async () => {
            const beforeTxBuyerBalance = await getBalance(buyer)
            const beforeTxContractBalance = await getBalance(_contract.address)

            const result = await _contract.repurchaseNft(nftHash2, {from: buyer, value})

            const afterTxBuyerBalance = await getBalance(buyer)
            const afterTxContractBalance = await getBalance(_contract.address)

            const nft = await _contract.getNftByHash(nftHash2)
            const expectedState = 0
            const gas = await getGas(result)

            assert.equal(nft.state, expectedState, "the nft is not in purchased state")
            assert.equal(nft.price, value, `the nft price is not equal to ${value}`)

            assert.equal(
                toBN(beforeTxBuyerBalance).sub(toBN(value)).sub(gas).toString(),
                afterTxBuyerBalance,
                "client balance is not correct"
            )

            assert.equal(
                toBN(beforeTxContractBalance).add(toBN(value)).toString(),
                afterTxContractBalance,
                "contract balance is not correct"
            )
        })

        it("should not be able to repurchase purchased nft", async () => {
            await catchRevert(_contract.repurchaseNft(nftHash2, {from: buyer}))
          })
    })

    describe("Receive funds", () => {
        it("should have transacted funds", async () => {
            const value = "100000000000000000"
            const contractBeforeTx = await getBalance(_contract.address)

            await web3.eth.sendTransaction({
                from: buyer,
                to: _contract.address,
                value
            })

            const contractAfterTx = await getBalance(_contract.address)

            assert.equal(
                toBN(contractBeforeTx).add(toBN(value)).toString(),
                contractAfterTx,
                "value after transaction is not matching"
            )
        })
    })

    describe("Normal withdraw", () => {
        const fundsToDeposit = "100000000000000000"
        const overLimitFunds = "999900000000000000000"
        let currentOwner = null

        before(async () => {
            currentOwner = await _contract.getContractOwner()
            await web3.eth.sendTransaction({
                from: buyer,
                to: _contract.address,
                value: fundsToDeposit
            })
        })

        it("should fail when someone else than the owner is withdrawing", async() => {
            const value = "10000000000000000"
            await catchRevert(_contract.withdraw(value, {from:buyer}))
        })

        it("should fail when withdrawing over limit funs", async() => {
            await catchRevert(_contract.withdraw(overLimitFunds, {from:currentOwner}))
        })

        it("should have +0.1 ETH after withdraw", async() => {
            const ownerBalance = await getBalance(currentOwner)
            const result =  await _contract.withdraw(fundsToDeposit, {from: currentOwner})
            const newOwnerBalance = await getBalance(currentOwner)
            const gas = await getGas(result)

            assert.equal(
                toBN(ownerBalance).add(toBN(fundsToDeposit)).sub(toBN(gas)).toString(),
                newOwnerBalance,
                "the new owner balance is not correct"
            )
        })
    })
        
    describe("Emergency withdraw", () => {
        let currentOwner

        before(async() => {
            currentOwner = await _contract.getContractOwner()
        })

        after(async() => {
            await _contract.resumeContract({from: currentOwner})
        })

        it("should fail when contract is not stopped", async () => {
            await catchRevert(_contract.emergencyWithdraw({from: currentOwner}))
        })

        it("should receive funds from the contract as the contract owner", async () => {
            await _contract.stopContract({from: currentOwner})

            const contractBalance = await getBalance(_contract.address)
            const ownerBalance = await getBalance(currentOwner)

            const result = await _contract.emergencyWithdraw({from: currentOwner})
            const gas = await getGas(result)

            const newOwnerBalance = await getBalance(currentOwner)
            
            assert.equal(
                toBN(ownerBalance).add(toBN(contractBalance)).sub(gas).toString(),
                newOwnerBalance,
                "owner did not get funds from the contract"
            )
        })

        it("contract balance should be 0", async () => {
            const contractBalance = await getBalance(_contract.address)
            assert.equal(
                contractBalance,
                0,
                "contract doesnt have 0 balacne"
            )
        })
    })

    describe("Slef destruct", () => {
        let currentOwner

        before(async() => {
            currentOwner = await _contract.getContractOwner()
        })

        it("should fail when contract is not stopped", async () => {
            await catchRevert(_contract.selfDestruct({from: currentOwner}))
        })

        it("should receive funds from the contract as the contract owner", async () => {
            await _contract.stopContract({from: currentOwner})

            const contractBalance = await getBalance(_contract.address)
            const ownerBalance = await getBalance(currentOwner)

            const result = await _contract.selfDestruct({from: currentOwner})
            const gas = await getGas(result)

            const newOwnerBalance = await getBalance(currentOwner)
            
            assert.equal(
                toBN(ownerBalance).add(toBN(contractBalance)).sub(gas).toString(),
                newOwnerBalance,
                "owner did not get funds from the contract"
            )
        })

        it("contract balance should be 0", async () => {
            const contractBalance = await getBalance(_contract.address)
            assert.equal(
                contractBalance,
                0,
                "contract doesnt have 0 balacne"
            )
        })

        it("should have 0x bytecode", async () => {
            const code = await web3.eth.getCode(_contract.address)
            console.log(code)
            assert.equal(
                code,
                "0x",
                "contract isnt destroyed"
            )
        })
    })
}) 
