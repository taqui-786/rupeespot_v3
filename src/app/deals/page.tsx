import FramerWrapper from "@/components/Animations/FramerWrapper";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Meteors from "@/components/Animations/Meteor";
import { Metadata } from "next";
import DealsListings from "@/components/Listings/DealPageListing";

type Props = {};

export const metadata: Metadata = {
  title: "Unbeatable Deals and Exclusive Offers - Rupeespot",
  description: "Unlock discounts of up to 90% off with our curated deals from leading retailers such as Amazon, Flipkart, Myntra, and more. Shop smart and save big with Rupeespot's exclusive discounts!",
  
  openGraph:{
    images: [
      {
        url: `${process.env.NEXTAUTH_URL}/api/og?title=DEALS_PAGE`,

        alt: "Rupeespot.com",
      },
    ],
  }
};
const DealsPage: React.FC<Props> = ({}) => {
  return (
    <MaxWidthWrapper className="flex flex-col relative">
      <FramerWrapper>
       
  <div className="w-full flex  relative items-center justify-center overflow-hidden py-20 bg-transparent min-h-[320px]  dark:bg-slate-900">
        <Meteors number={25}/>
        <h1 className="text-6xl font-semibold text-card-foreground uppercase ">
          All Deals
        </h1>
      </div>
        <DealsListings/>
      </FramerWrapper>
    </MaxWidthWrapper>
  );
};
export default DealsPage;
