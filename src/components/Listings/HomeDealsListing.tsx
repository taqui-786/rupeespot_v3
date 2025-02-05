"use client";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import ProductCardLoader from "../loaders/ProductCardLoader";
import { useHomeDeals } from "@/lib/authentication/AuthApis";
// import ExampleCard from "../Product/TestingCard";

type Props = {};

const HomeDealsListing: React.FC<Props> = ({}) => {
  const { data: deals, isLoading: isLoadingDeals, error } = useHomeDeals();
  console.log(deals);

  if (error) return <div>Error fetching deals</div>;

  return (
    <div className="w-full  flex flex-row flex-wrap items-center justify-center gap-1 sm:gap-4 mb-4">
      {isLoadingDeals ? (
        <div className="w-full h-auto md:h-80 flex flex-wrap items-center justify-center gap-4  ">
          {Array.from({ length: 5 }).map((_, index) => (
            <ProductCardLoader key={`loader-${index}`} />
          ))}
        </div>
      ) : (
        deals &&
        deals.map((itm: any, indx: number) => {
          return <ProductCard key={indx} item={itm} />;
          // return <ExampleCard key={indx} data={itm} />;
        })
      )}
      {!isLoadingDeals && (
        <div className="w-full grid place-content-center">
          <Link
            href={"/deals"}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "animate-bounce text-primary"
            )}
          >
            Chekout More Deals &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};
export default HomeDealsListing;
