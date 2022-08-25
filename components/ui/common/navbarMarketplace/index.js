
import { useWeb3 } from "@components/Providers"
import { useAccount } from "@components/hooks/web3"
import Button from "../button"
import { useRouter } from "next/router"
import ActiveLink from "../link"
import Loader from "../loader"




export default function Navbar() {
  const { connect, isLoading, requireInstall } = useWeb3()
  const { account } = useAccount()
  const {pathname} = useRouter()


  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8 mb-2">
        <nav className="relative" aria-label="Global">
          <div className="flex flex-row justify-between items-center">
              <div>
                <div className="text-base font-semibold text-gray-900 mr-8 inline-block">
                  <blockquote>
                    <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-500 relative inline-block">
                      <span className="relative text-white font-semibold">pepeFT</span>
                    </span>
                      <span className="font-light"> Marketplace</span>
                  </blockquote>
                </div>
                <ActiveLink href="/">
                  <a  
                    className="font-medium mr-8 hover:text-gray-900">
                      Home
                  </a>
                </ActiveLink>
                <ActiveLink href="/marketplace">
                  <a  
                    className="font-medium mr-8 hover:text-gray-900">
                      Marketplace
                  </a>
                </ActiveLink>
                <ActiveLink href="/rest/news">
                  <a  
                    className="font-medium mr-8  hover:text-gray-900">
                      News
                  </a>
                </ActiveLink>
              </div>
            <div className="text-center justify-between inline-block">
              <ActiveLink href="/rest/blog">
                <a  
                  className="font-medium mr-6 flex-row hover:text-gray-900">
                    Blog
                </a>
              </ActiveLink>
              { isLoading ?
                <button
                  className="px-8 py-3 border rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-600"
                  disabled={true}>
                    <div className="space-x-3 flex flex-row">
                      <Loader size="sm"/>
                    <span className="font-semibold">Loading ...</span>
                    </div>
                </button> :
                account.data ?
                <Button disabled
                className="hover:bg-green-500
                bg-green-500
                text-white">
                  Hi there { account.isAdmin && "Admin" }
                </Button> :
                requireInstall ?
                <Button
                  onClick={() => window.open("https://metamask.io/", "_blank")}>
                  Install Metamask
                </Button> :
                <Button
                  onClick={connect}>
                    <span className="font-semibold">Connect Wallet</span>
                </Button> 
              }
              
            </div>
          </div>
        </nav>
      </div>
      { account.data &&
        !pathname.includes("/marketplace") &&
        <div className="flex justify-end pt-1 sm:px-6 lg:px-8"
        disabled>
          <button disabled>
            <div className="text-white bg-green-500 rounded-md p-2 font-semibold">
              {account.data}
            </div>
          </button>
        </div>
      }
    </section>
  )
}


//{ isLoading ?
//<button
//className="px-8 py-3 border rounded-md text-base font-medium text-white bg-green-400 hover:bg-green-500">
  //<div class="space-x-3 flex">
    //<div class="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full text-green-300" role="status">.
    //</div>
  
  //<strong>Loading...</strong>
  //</div>
//</button> : 
//isWeb3Loaded ?