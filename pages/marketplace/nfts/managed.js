import { MarketplaceLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { ManagedCourseCard } from "@components/ui/course";
import { CourseFilter } from "@components/ui/course";
import { useAdmin, useManagedNfts } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { useState, useEffect } from "react";
import { useWeb3 } from "@components/Providers";
import { normalizeOwnedNft } from "@utils/normalize";
import { withToast } from "@utils/toast";

// before tx 78.3775827 ETH
// after tx 77.37492302 ETH
// gasFee -> 0.00265968 ETH
// after 2nd tx 78.37492302 ETH

const VerificationInput = ({onVerify}) => {

  const [ email, setEmail ] = useState("")

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({target: {value}}) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..." />
      <div
        className="ml-2"
      >
        <Button
          onClick={() => {
            onVerify(email)
          }}
        >
          Verify
        </Button>
      </div>
    </div>
  )
}


export default function ManagedNfts() {

  const [proofedOwnership, setProofedOwnership ] = useState({})
  const [searchedNft, setSearchedNft] = useState(null)
  const [filters, setFilters] = useState({state: "all"})
  const { web3, contract } = useWeb3()
  const { account } = useAdmin({redirectTo: "/marketplace"})
  const { managedNfts } = useManagedNfts(account)
  
  const verifyNft = (email, {hash, proof}) => {
    if (!email) {
      return
    }

    const emailHash = web3.utils.sha3(email)
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    )

    proofToCheck === proof ?
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: true
      }) :
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: false
      })
  }

  const changeNftState = async (nftHash, method) => {
    try {
      const result = await contract.methods[method](nftHash).send({
        from: account.data
      })
      return result
    } catch(e) {
      throw new Error(e.message)
    }
  }

  const activateNft = async nftHash => {
    withToast(changeNftState(nftHash, "activateNft"))
  }

  const deactivateNft = async nftHash => {
    withToast(changeNftState(nftHash, "deactivateNft"))
  }

  const searchNft = async hash => {
    const re = /[0-9A-Fa-f]{6}/g;

    if(hash && hash.length === 66 && re.test(hash)) {
      const nft = await contract.methods.getNftByHash(hash).call()

      if (nft.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedNft(web3)({hash}, nft)
        setSearchedNft(normalized)
        return
      }
    }

    setSearchedNft(null)
  }

  const renderCard = (nft, isSearched) => {
    return (
      <ManagedCourseCard
        key={nft.ownedNftId}
        isSearched={isSearched}
        nft={nft}
      >
        <VerificationInput
          onVerify={(email) => {
            verifyNft(email, {
              hash: nft.hash, 
              proof: nft.proof
            })
          }}
        />
        { proofedOwnership[nft.hash] &&
          <div className="mt-4">
            <Message>
              Verified!
            </Message>
          </div>
        }
        { proofedOwnership[nft.hash] == false &&
          <div className="mt-4">
            <Message type="danger">
              Wrong proof!
            </Message>
          </div>
        }
        { nft.state === "purchased" &&
          <div className="mt-2">
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 px-8 py-3 border rounded-md p-2 text-base font-medium ml-3"
              onClick={() => activateNft(nft.hash)}
              >
              Activate
            </button>
            <button 
              className="text-white bg-red-500 hover:bg-red-600 px-8 py-3 border rounded-md p-2 text-base font-medium ml-3"
              onClick={() => deactivateNft(nft.hash)}
            >
              Deactivate
            </button>
          </div>
        }
      </ManagedCourseCard>
    )
  }

  if (!account.isAdmin) {
    return null
  }

  const filterNfts = managedNfts.data
    ?.filter((nft) => {
      if (filters.state === "all") {
        return true
      }
      return nft.state === filters.state
    })
    .map(nft =>
    renderCard(nft)
  )

  return (
    <>
      <MarketHeader />
        <CourseFilter
          onFilterSelect={(value) => setFilters({state: value})}
          onSearchSubmit={searchNft}
        />
        <section className="grid grid-cols-1">
          { searchedNft &&
            <div>
              <h1 className="text-2xl font-semibold p-5">Search</h1>
              { renderCard(searchedNft, true) }
            </div>
          }
          <h1 className="text-2xl font-semibold p-5">All NFTs</h1>
          { 
            filterNfts
          }
          {
            filterNfts?.length === 0 &&
            <Message
              type="yellow"
            >
              No NFTs to display
            </Message>
          }
        </section>
    </>
  )
}

ManagedNfts.Layout = MarketplaceLayout