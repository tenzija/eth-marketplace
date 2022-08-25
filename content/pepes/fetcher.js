

import nfts from "./index.json"

export const getAllNfts = () => {
    return {
        data: nfts,
        nftMap: nfts.reduce((a, n, i) => {
            a[n.id] = n
            a[n.id].index = i
            return a
        }, {})
    }
}