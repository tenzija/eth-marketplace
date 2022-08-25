import { useAccount, useOwnedNft } from "@components/hooks/web3";
import { Message, Modal } from "@components/ui/common";
import {
  CourseHero,
  Curriculum,
  Keypoints
} from "@components/ui/course";
import { BaseLayout, MarketplaceLayout } from "@components/ui/layout";
import { getAllNfts } from "@content/pepes/fetcher";
import { useState } from "react";
import { useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/Providers";

export default function Course({nfts}) {

  const { account } = useAccount()
  const [selectedNfts, setSelectedNfts] = useState(null)
  const { ownedNft } = useOwnedNft(nfts, account.data)
  const { canPurchaseNFT } = useWalletInfo()
  const nftState = ownedNft.data?.state

  const isLocked = 
    nftState === "deactivated" || 
    nftState === "purchased"

    const purchaseNft = async order => {
      const hexNftId = web3.utils.utf8ToHex(selectedNfts.id)
      
      const orderHash = web3.utils.soliditySha3(
        { type: "bytes16", value: hexNftId },
        { type: "address", value: account.data }
      )
  
      const emailHash = web3.utils.sha3(order.email)
  
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      )
  
      const value = web3.utils.toWei(String(order.price))
  
      // emailHash + nftHash
      try {
        const result = await contract.methods.purchaseNft(
          hexNftId,
          proof
        ).send({from: account.data, value})
        console.log(result)
        console.log(order)
      } catch {
        console.log("Purchase NFT: Operation has failed.")
      }
    }


  return (
    <>
      <div className="py-4">
        <CourseHero
          hasOwner={!!ownedNft.data}
          title={nfts.title}
          description={nfts.description}
          image={nfts.coverImage}
        />
      </div>
        <Keypoints 
          points={nfts.wsl}
        />
        <div className="max-w-5xl mx-auto">
          { isLocked ?
            <div className="max-w-5xl mx-auto">
              <Message
                className="text-green-500 bg-green-100">
                Nft is purchased, feel free to try the gameplay!
                <i className="block font-normal">If you have any questions please contact UpDownStudios</i>
              </Message>
            </div> :
            !isLocked &&
            <Message type="danger"
              className="text-red-500">
              You dont own this NFT
            </Message>
          }
        </div>
        <Curriculum 
          locked={isLocked}
        />
        <Modal />
    </>
  )
}

export function getStaticPaths() {
  const { data } = getAllNfts()

  
  return {
    paths: data.map(n => ({
      params: {
        slug: n.slug
      }
    })),
    fallback: false
  }
}

export function getStaticProps({params}) {
  const {data} = getAllNfts()
  const nfts = data.filter(n => n.slug === params.slug)[0]
  
  return {
    props: {
      nfts
    }
  }
}

Course.Layout = MarketplaceLayout
