import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
    "0xa97955013edb17ab9a76401f6843801b608413639f072257307ac2d15f77131d" : true
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