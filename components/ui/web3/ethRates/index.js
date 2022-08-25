import { useEthPrice, NFT_PRICE } from "@components/hooks/useEthPrice"
import { Loader } from "@components/ui/common"
import Image from "next/image"


export default function EthRates() {
  const { eth } = useEthPrice()

  return (
    <div className="flex flex-col xs:flex-row text-center justify-evenly  my-3">
      <div className="p-6 px-20 border drop-shadow rounded-md bg-green-500 text-white">
        <div className="flex items-center justify-center">
          { eth.data ?
            <>
            <div className="mr-1 flex">
                <Image
                  layout="fixed"
                  height="35"
                  width="23"
                  src="/small-eth.webp"
                />
              </div>
              <span className="text-xl font-bold">
                = {eth.data}$
              </span>
            </> :
            <div className="w-full flex justify-center">
              <Loader size="md"/>
            </div>
          }
        </div>
        <p className="text-lg text-green-100">Current ETH Price</p>
      </div>
      <div className="justify-right">
        <div className="p-6 px-16 border drop-shadow rounded-md bg-green-500 text-white">
          <div className="flex items-center justify-center">
            { eth.data ?
              <>
                <span className="text-xl font-bold">
                  {eth.perItem}
                </span>
                <div className="mr-1 ml-1 flex">
                  <Image
                    layout="fixed"
                    height="35"
                    width="23"
                    src="/small-eth.webp"
                  />
                </div>
                <span className="text-xl font-bold">
                = {NFT_PRICE}$
                </span>
              </> :
              <div className="w-full flex justify-center">
                <Loader size="md"/>
              </div>
            }
          </div>
          <p className="text-lg text-green-100">NFT Floor Price</p>
        </div>
      </div>
    </div>
  )
}
