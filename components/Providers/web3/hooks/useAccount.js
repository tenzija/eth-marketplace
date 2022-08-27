import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
    "0x5249E8B1b7A32C2eF46a0f6729a72E35AECBC9aC" : true
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
