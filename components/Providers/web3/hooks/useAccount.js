import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
    "0xa783310665a812806422a1f56304e393435cd072fdf93691b286e235b4872be4" : true
}

export const handler = (web3, provider) => () => {

    const { data, mutate, ...rest } = useSWR(() => 
        web3 ? "web3/accounts" : null,
        async() => {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]

            if (!account) {
                throw new Error("Cannot retrive wallet info. Please refresh your browser.")
            }

            return account
        }
    )
    
    useEffect (() => {
        
        const mutator = accounts => mutate(accounts[0] ?? null)

        provider?.on("accountsChanged", mutator)

        return () => {
            provider?.removeListener("accountsChanged", mutator)
        }

    }, [provider])

    return { 
        data,
        isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
        mutate,
        ...rest
    }
}
