
import { AnimateKeyframes } from "react-simple-animate"
import Image from "next/image"
import Link from "next/link"


export default function Card({nfts, Butt, disabled, state}) {
  return (
    <div
        className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
    >
        <div 
        className="flex h-full"
        >
            <div className="flex-1 h-full">
                <Image 
                    className={`object-cover ${disabled && "filter grayscale"}`}
                    src={nfts.coverImage} 
                    layout="responsive"
                    width="200"
                    height="240"
                    alt={nfts.title} 
                />
            </div>
            <div 
                className="p-8 pb-4 flex-2"
            >
                <div
                    className="flex items-center"
                >
                    <div 
                    className="uppercase mr-2 tracking-wide text-sm text-green-500 font-semibold">
                        {nfts.type}
                    </div>
                    <div>
                        { state === "purchased" &&
                             <AnimateKeyframes
                             play
                             duration={3}
                             keyframes={["opacity: 0.2", "opacity: 0.9"]}
                             iterationCount="infinite"
                           >
                             <div className="text-xs text-black bg-yellow-200 p-1 px-3 rounded-full">
                               Pending
                             </div>
                           </AnimateKeyframes>
                        }
                        { state === "activated" &&
                            <div 
                                className="
                                    text-xs
                                    text-black
                                    bg-green-200
                                    p-1
                                    px-3
                                    rounded-full
                                "
                            // type="success"
                            // size="sm"  
                            >
                                Activated
                            </div>
                        }
                        { state === "deactivated" &&
                            <div 
                                className="
                                    text-xs
                                    text-black
                                    bg-red-200
                                    p-1
                                    px-3
                                    rounded-full
                                "
                            // type="danger"
                            // size="sm"
                            >
                                Deactivated
                            </div>
                        }
                    </div>
                </div>
                <Link href={`/nfts/${nfts.slug}`}>
                <a 
                    href="#" 
                    className="h-5 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black hover:underline">
                    {nfts.title}
                </a>
                </Link>
                <p 
                className="mt-2 text-gray-500 text-sm sm:text-lg">
                    {nfts.description.substring(0,99)}...
                </p>
                    { Butt &&
                        <div
                            className="mt-4"
                        >
                            <Butt/>
                        </div>
                    }
            </div>
        </div>
    </div>
)}