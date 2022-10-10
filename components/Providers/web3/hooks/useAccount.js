import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
    "0xc9faf738756691565ddd4f0419bd09c5b24788d75e19af8a7a4999d6c249478c" : true
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
