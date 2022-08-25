import { CourseCard, CourseList } from "@components/ui/course"
import { MarketplaceLayout } from "@components/ui/layout"
import { getAllNfts } from "@content/pepes/fetcher"
import { useOwnedNfts, useWalletInfo } from "@components/hooks/web3"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/Providers"
import { Button, Loader } from "@components/ui/common"
import { withToast } from "@utils/toast"



export default function Marketplace({nfts}) {
  const { web3, contract, requireInstall } = useWeb3()
  const [selectedNfts, setSelectedNfts] = useState(null)
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo()
  const { ownedNfts } = useOwnedNfts(nfts, account.data)

  const [isNewPurchase, setIsNewPurchase] = useState(true)
  const [busyNftId, setBusyNftId] = useState(null)

  const purchaseNft = async (order, nfts) => {

    const hexNftId = web3.utils.utf8ToHex(nfts.id)
    
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexNftId },
      { type: "address", value: account.data }
    )

    const value = web3.utils.toWei(String(order.price))

    // emailHash + nftHash
    setBusyNftId(nfts.id)
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email)
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      )
      withToast(_purchaseNft({hexNftId, proof, value}, nfts))
    } else {
      withToast(_repurchaseNft({nftHah: orderHash, value}, nfts))
    }
  }

  const _purchaseNft = async ({hexNftId, proof, value}, nfts) => {
    try {
      const result = await contract.methods.purchaseNft(
        hexNftId,
        proof
      ).send({from: account.data, value})
      // slanje podataka ispod
      console.log(result)
      
      ownedNfts.mutate([
        ...ownedNfts.data, {
          ...nfts,
          proof,
          state: "purchased",
          owner: account.data,
          price: value
        }
      ])
      return result
    } catch(error) {
      throw new Error(error.message)
    } finally {
      setBusyNftId(null)
    }
  }


  const _repurchaseNft = async ({nftHah, value}, nfts) => {
    try {
      const result = await contract.methods.repurchaseNft(
        nftHah
      ).send({from: account.data, value})

      const index = ownedNfts.data.findIndex(c => c.id === nfts.id)

      if (index >= 0) {
        ownedNfts.data[index].state = "purchased"
        ownedNfts.mutate(ownedNfts.data)
      } else {
        ownedNfts.mutate()

      }
      return result
    } catch(error) {
      throw new Error(error.message)
    } finally {
      setBusyNftId(null)
    }
  }

  const cleanupModal = () => {
    setSelectedNfts(null)
    setIsNewPurchase(true)
  }


    return (
      <>
        <MarketHeader/>
        <CourseList 
          nfts = {nfts}
        >
          {
            nfts => {
              const owned = ownedNfts.lookup[nfts.id]
              return (
                <CourseCard
                  key={nfts.id} 
                  nfts={nfts}
                  state={owned?.state}
                  disabled={!hasConnectedWallet} 
                  Butt={() => {
                    
                    if(requireInstall) {
                      return (
                          <button 
                            disabled={true}
                            className="px-5 py-2 border rounded-md text-base font-medium text-yellow-500 bg-yellow-100 hover:bg-yellow-200"
                            >
                              Install Metamask
                          </button>
                      )
                    }

                    if(isConnecting) {
                      return (
                        <button 
                          disabled={true}
                          className="px-5 py-2 border rounded-md text-base font-medium text-green-500 bg-green-100 hover:bg-green-200"
                          >
                          <div className="flex">
                          <Loader
                            size="sm"
                          />
                          <div className="ml-2"> Loading...</div>
                          </div>
                        </button>
                      )
                    }

                    if (!ownedNfts.hasInitialResponse) {
                      return (
                        <button 
                          disabled={true}
                          className="px-5 py-2 border rounded-md text-base font-medium text-green-500 bg-green-100 hover:bg-green-200"
                        >
                          { hasConnectedWallet ? 
                            <div className="flex">
                            <Loader
                              size="sm"
                            />
                            <div className="ml-2"> Loading...</div>
                            </div> :
                            "Connect" 
                          }
                        </button>
                      )
                    }

                    const isBusy = busyNftId === nfts.id
                    // const isBusy = true
                    if (owned) {
                      return (
                        <>
                          <div className="flex">
                            <button 
                              disabled={true}
                              className="px-5 py-2 mr-2 border rounded-md text-base font-medium text-gray-500 bg-gray-100 hover:bg-gray-200"
                              >
                                Owned
                            </button>
                            { owned.state === "deactivated" &&
                              <button 
                                className="px-5 py-2 border rounded-md text-base font-medium text-green-500 bg-green-100 hover:bg-green-200"
                                disabled={isBusy}
                                onClick={() => {
                                  setIsNewPurchase(false)
                                  setSelectedNfts(nfts)
                                }}
                              >
                                { isBusy ?
                                  <div className="flex">
                                    <Loader
                                      size="sm"
                                    />
                                    <div className="ml-2"> In Progress</div>
                                  </div> :
                                  <div>
                                    Fund to Activate
                                  </div>
                                }
                            </button>
                            }
                          </div>
                        </>
                      )
                    }

                    return (
                        <button 
                          onClick={() => setSelectedNfts(nfts)}
                          disabled={!hasConnectedWallet || isBusy}
                          className="px-5 py-2 border rounded-md text-base font-medium text-green-500 bg-green-100 hover:bg-green-200"
                          >
                            { isBusy ?
                              <div className="flex">
                                <Loader
                                  size="sm"
                                />
                                <div className="ml-2"> In Progress</div>
                              </div> :
                              <div>
                                Purchase
                              </div>
                            }
                        </button>
                    )
                  }
                }
              />)}
        }
      </CourseList>
      { selectedNfts &&
        <OrderModal 
          nfts={selectedNfts}
          isNewPurchase={isNewPurchase}
          onSubmit={(formData, nfts) => {
            purchaseNft(formData, nfts)
            cleanupModal()
          }}
          onClose={cleanupModal}
        />
      }
    </>
  )
}

export function getStaticProps() {
  const {data} = getAllNfts()
  return {
    props: {
      nfts: data
    }
  }
}

Marketplace.Layout = MarketplaceLayout