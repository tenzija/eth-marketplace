import { OwnedCourseCard } from "@components/ui/course";
import { MarketplaceLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { Message } from "@components/ui/common";
import { Button } from "@components/ui/common"
import { useAccount, useOwnedNfts } from "@components/hooks/web3";
import { getAllNfts } from "@content/pepes/fetcher";
import Link from "next/link";
import { useWeb3 } from "@components/Providers";
import { useRouter } from "next/router";


export default function OwnedNFTs({nfts}) {
  const router = useRouter()
  const { requireInstall } = useWeb3()
  const { account } = useAccount()
  const { ownedNfts } = useOwnedNfts(nfts, account.data)
  
  return (
        <>
          <MarketHeader />
          <section className="grid grid-cols-1">
            { ownedNfts.isEmpty &&
              <div className="justify-center text-center">
                <Message type="danger">
                  <div className="text-center">You dont own any NFTs</div>
                  <Link href="/marketplace">
                    <a 
                      className="font-normal hover:underline"
                    >
                      <i>Purchase NFTs</i>
                    </a>
                  </Link>
                </Message>
              </div>
            }
            { account.isEmpty &&
              <div className="justify-center text-center">
                <Message type="danger">
                  <div className="text-center">Please connect to Metamask</div>
                </Message>
              </div>
            }
            { requireInstall &&
              <div className="justify-center text-center">
                <Message type="yellow">
                  <div className="text-center">Please install Metamask</div>
                </Message>
              </div>
            }
            { ownedNfts.data?.map(nft =>
              <OwnedCourseCard
                key={nft.id}
                nft={nft}
              >
                  <a 
                      href={`/nfts/${nft.slug}`}
                    >
                    <Button
                      className="px-5 py-2 border rounded-md text-base font-medium text-green-500 bg-green-100 hover:bg-green-200"
                    >
                      View NFT
                    </Button>
                  </a>
              </OwnedCourseCard> 
            )}
          </section>
        </>
  )
}

export function getStaticProps() {
  const {data} = getAllNfts()
  return {
    props: {
      nfts: data
    }
  }
}

OwnedNFTs.Layout = MarketplaceLayout