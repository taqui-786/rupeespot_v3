
import DotPattern from "@/components/Animations/DotPattern";
import FramerWrapper from "@/components/Animations/FramerWrapper";
import HomeDealsListing from "@/components/Listings/HomeDealsListing";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import TextRotator from "@/components/TextRotator";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import Link from "next/link";
export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="overflow-x-hidden overflow-y-hidden relative ">
        <FramerWrapper y={-100}  >
          {/* <AdSense adSlot="1234567890"/> */}
       
          <DotPattern
         width={30}
         height={30}
         cx={1}
         cy={1}
         cr={1}
         className={cn(
          "[mask-image:linear-gradient(top_to_bottom,white,transparent,transparent)] pt-2 -z-10",
        )}
      />
          <div className="px-2 sm:px-0 py-20 mx-auto text-center flex flex-col items-center max-w-[52rem] z-50 overflow-y-hidden ">
            <h1 className="text-3xl font-bold tracking-tight text-card-foreground sm:text-5xl">
              Your Ultimate Destination for Affordable Deals Products of
              <span className="text-primary ml-2 inline-flex  flex-col h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))] sm:h-[calc(theme(fontSize.5xl)*theme(lineHeight.tight))] overflow-hidden">
                <TextRotator />
             
              </span>
            </h1>
            <p className="mt-6 text-xs sm:text-base max-w-prose text-gray-700 dark:text-white">
              Welcome to RupeeSpot: Explore a World of Savings with Our
              Collection of popular E-commerce stores Deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/deals" className={buttonVariants()}>
                Browse Latest Deals
              </Link>
              <Link
                href="#latest"
                className={buttonVariants({ variant: "ghost" })}
              >
                Today&#39;s Top Deals &rarr;
              </Link>
            </div>
          </div>
        </FramerWrapper>
      </MaxWidthWrapper>
      <section id="latest">
        <MaxWidthWrapper className="py-10">
          <FramerWrapper y={100}>
          <Card className="bg-none border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex gap-2 relative max-w-52 ">
                <span className="text-2xl">Todays Top Deals</span>{" "}
                <span className="flex absolute top-0 end-0 -mt-2 -me-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-600"></span>
                  <span className="relative inline-flex text-xs bg-red-500 text-white rounded-full py-0.5 px-1.5">
                    99+
                  </span>
                </span>
              </CardTitle>
              <CardDescription>
                Checkout Top deals from various e-commerce platforms.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <HomeDealsListing />
            </CardContent>
          </Card>
          </FramerWrapper>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
