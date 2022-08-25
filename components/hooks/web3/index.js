import { useHooks, useWeb3 } from "@components/Providers/web3"
import { useRouter } from "next/router"
import { useEffect } from "react"

const _isEmpty = data => {
    return (
        data == null || 
        data == "" || 
        (Array.isArray(data) && data.length === 0) ||
        (data.constructor === Object && Object.keys(data).length === 0)
    )
}

const enhanceHook = swrRes => {
    const { data, error } = swrRes
    const hasInitialResponse = !!(data || error)
    const isEmpty = hasInitialResponse && _isEmpty(data)

    return {
        ...swrRes,
        isEmpty,
        hasInitialResponse
    }
}

export const useNetwork = () => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useNetwork)())
    return {
        network: swrRes
    }
}

export const useAccount = () => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useAccount)())
    return {
        account: swrRes
    }
}

export const useAdmin = ({redirectTo}) => {
    const { account } = useAccount()
    const router = useRouter()
    const { requireInstall } = useWeb3()

    useEffect(() => {
        if ((
        requireInstall ||
        account.hasInitialResponse && !account.isAdmin) ||
        account.isEmpty
        ) {
            router.push(redirectTo)
        }
    }, [account])

    return { account }
}

export const useOwnedNfts = (...args) => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useOwnedNfts)(...args))

    return {
        ownedNfts: swrRes
    }
}

export const useOwnedNft = (...args) => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useOwnedNft)(...args))

    return {
        ownedNft: swrRes
    }
}

export const useManagedNfts = (...args) => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useManagedNfts)(...args))
  
    return {
      managedNfts: swrRes
    }
  }

export const useWalletInfo = () => {
    const { account } = useAccount()
    const { network } = useNetwork()

    const isConnecting = 
     !account.hasInitialResponse &&
     !network.hasInitialResponse

    return {
        account,
        network,
        isConnecting,
        hasConnectedWallet: !!(account.data && network.isSupported)
    }
}
