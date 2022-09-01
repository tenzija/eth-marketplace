import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
    "0x4bd23e31d1586d3d3149e96ed8172ca2d486f38076f5bf95844fd35d121c929d" : true
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
