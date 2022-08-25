import { useAccount } from "@components/hooks/web3";
import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";

const LINKS = [{
    href: "/marketplace/nfts/buynfts",
    value: "Buy NFTs"
}, {
    href: "/marketplace/nfts/owned",
    value: "My NFTs"
}, {
    href: "/marketplace/nfts/managed",
    value: "Manage NFTs",
    requireAdmin: true
}]


export default function Header() {

    const { account } = useAccount()

    return (
        <>
            <div className="pt-">
                <WalletBar />
            </div>
            <EthRates />
            <div className="flex justify-center pb-4 px-4 sm:px-6 lg:px-8 mb-3">
                <Breadcrumbs 
                    items={LINKS}
                    isAdmin={account.isAdmin}
                />
            </div>
        </>
    )
}