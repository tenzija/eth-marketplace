import Link from "next/link";
import Button from "../button";




export default function Hero() {

  return (
    <section className="lg:2/6 text-left my-28">
      <div className="text-8xl font-semibold text-gray-900 ">
        <blockquote>
          <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-500 relative inline-block pb-7">
            <span className="relative text-white font-semibold">pepeFT</span>
          </span>
            <span className="font-thin"> Marketplace</span>
        </blockquote>
      </div>
      <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam luctus neque id neque elementum ornare. Cras scelerisque sed nibh quis pretium.</div>
      <div className="mt-5 sm:mt-8 flex lg:justify-start">
        <div className="rounded-md shadow">
          <Link href="/marketplace">
            <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 md:py-4 md:text-lg md:px-10">
                Get started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
