import Image from "next/image"

const STATE_COLORS = {
  Purchased: "indigo",
  Activated: "green",
  Deactivated: "red"
}

export default function OwnedCourseCard({children, nft}) {

  const stateColor = STATE_COLORS[nft.state]

  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg mb-3">
      <div className="flex">
        <div className="flex-1">
          <div className="h-full next-image-wrapper">
            <Image
              className="object-cover"
              src={nft.coverImage}
              width="21"
              height="34"
              layout="responsive"
            />
          </div>
        </div>
        <div className="flex-4">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              <span className="mr-2">{nft.title}</span>
              {/* <span className={`text-xs text-${stateColor}-700 bg-${stateColor}-200 rounded-lg p-2`}>
                {nft.state}
              </span> */}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {nft.price} ETH
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-9 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  <span className="font-semibold">NFT</span>_<span className="font-light">ID</span>
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {nft.ownedNftId}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-9 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Proof
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {nft.proof}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:px-6">
                {children}
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}


