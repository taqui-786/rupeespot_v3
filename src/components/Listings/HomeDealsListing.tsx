import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import ProductCardLoader from "../loaders/ProductCardLoader";
// import ExampleCard from "../Product/TestingCard";

type Props = {};
async function getData() {
  const fetching = await fetch(`${process.env.NEXTAUTH_URL}/api/deals/home`, {
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_APP_API_KEY as string
  }
  });

  if (!fetching.ok) {
    throw new Error("Failed to fetch home deals");
  }

  return fetching.json();
}
const HomeDealsListing: React.FC<Props> = async ({}) => {
  let loading = true;
  const fetchDeals: any = await getData()
    .then((res) => {
      loading = false;
      return res.message;
    })
    .catch(() => {
      loading = true;
    });

  return (
    <div className="w-full  flex flex-row flex-wrap items-center justify-center gap-1 sm:gap-4 mb-4">
      {loading ? (
        <div className="w-full h-auto md:h-80 flex flex-wrap items-center justify-center gap-4  ">
          <ProductCardLoader />
          <ProductCardLoader />
          <ProductCardLoader />
          <ProductCardLoader />
        </div>
      ) : (
        fetchDeals &&
        fetchDeals.map((itm: any, indx: number) => {
          return <ProductCard key={indx} item={itm} />;
          // return <ExampleCard key={indx} data={itm} />;
        })
      )}
      {!loading && (
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
