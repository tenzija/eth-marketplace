
import { Hero } from "@components/ui/common"
import { CourseList, CourseCard } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllNfts } from "@content/pepes/fetcher"
import Blockies from 'react-blockies-image'

export default function Home({nfts}) {
  return (
      <>
        <Hero />
        {/* <Blockies
          seed={""}
          scale={40}
        /> */}
        <CourseList 
          nfts = {nfts}
        >
          {
            nfts => <CourseCard 
            key={nfts.id} 
            nfts={nfts}/>
          }
        </CourseList>
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

Home.Layout = BaseLayout