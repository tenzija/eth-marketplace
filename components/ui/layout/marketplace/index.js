import { Web3Provider } from "@components/Providers"
import { NavbarMarketplace, Footer } from "@components/ui/common"

export default function MarketplaceLayout({children}) {
    return (
        <Web3Provider>
            <div className=" max-w-7xl mx-auto px-4">
                <NavbarMarketplace />
                <div className="fit">
                    {children}
                </div>
            </div>
            <Footer />
        </Web3Provider>
    )
}