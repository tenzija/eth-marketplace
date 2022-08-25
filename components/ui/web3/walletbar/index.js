import { useWalletInfo } from "@components/hooks/web3"
import { useWeb3 } from "@components/Providers"


export default function WalletBar() {
  const {requireInstall} = useWeb3()
  const { account, network } = useWalletInfo()

  return (
    <section className="text-white bg-green-500 rounded-lg p-3 break-words">
      <div className="p-9">
        <h1 className="text-2xl">Hello, <span className="font-bold">{account.data}</span></h1>
        <h2 className="subtitle mb-5 text-xl">I hope you are having a great day!</h2>
        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-500 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10">
                Learn how to purchase
              </a>
            </div>
          </div>
          <div>
            { network.hasInitialResponse && !network.isSupported &&
              <div className="bg-red-100 text-red-500 p-4 rounded-lg text-center text-lg">
                <div>Connected to the wrong <span className="font-bold">Network</span></div>
                <div>
                  Connect to: <span className="font-bold">{` `}
                  {network.target}</span>
                </div>
              </div>
            }
            { requireInstall &&
              <div className="bg-yellow-100 text-yellow-500 p-4 rounded-lg">
                Cannot connect to the <span className="font-bold">Network</span>. Please, install <span className="font-bold">Metamask</span>.
              </div>
            }
            { network.data &&
              <div>
                <span className="text-xl">Currently on </span>
                <span className="text-4xl font-bold">{network.data}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
