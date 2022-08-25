

export const NFT_STATES = {
    0: "purchased",
    1: "activated",
    2: "deactivated",
}

export const normalizeOwnedNft = web3 => (nft, OwnedNft) => {
    return {
        ...nft,
        ownedNftId: OwnedNft.id,
        proof: OwnedNft.proof,
        owner: OwnedNft.owner,
        price: web3.utils.fromWei(OwnedNft.price),
        state: NFT_STATES[OwnedNft.state]
    }
}