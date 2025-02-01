import { History, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { AddToTrackingBtn } from "./ProductTrackingBtn";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import BuySuggestionEmoji from "./BuySuggestionEmoji";
import { addAffiliateTag, formatPriceNumber } from "@/lib/CustomFunctions";
import { CustomStarSvgIcon } from "../CustomIcon";
import {  fetchCustomRating } from "@/lib/actions/authActions";
import { format } from "timeago.js";

interface Product {
  id: string;
  brand?: string;
  title: string;
  mrp: number;
  image: string;
  name: string;
  slug?: string;
  store?: string;
  rating?:any;
  rating_count?:number;
  price?:number;
  last_updated?:number;

}

interface CustomRatingTypes {
product:Product;
reg_price:number
}

interface Props {
  product: Product;
  store: string;
}

const StoreProductComponent: React.FC<Props> = async ({ product, store }) => {
  const customRating:CustomRatingTypes = await fetchCustomRating(store, product?.id);

  const getStoreUrl = (store: string, product: Product): string => {
    switch (store) {
      case 'amazon':
        return `https://amazon.in/dp/${product.id}`;
      case 'flipkart':
        return `https://www.flipkart.com/${product.slug}`;
      case 'ajio':
        return `https://www.ajio.com/${product.slug}`;
      default:
        return '/';
    }
  };

  const getRatingColor = (rating: number | null): string => {
    if (rating === null || rating < 1) return "text-gray-500";
    if (rating >= 3.9) return "text-green-400";
    if (rating >= 3) return "text-orange-400";
    return "text-red-400";
  };
const storeUrl = getStoreUrl(store, product)
  return (
    <>
      <div className="w-full text-start flex flex-col gap-3">
        {product.brand && (
          <p className="text-sm text-gray-400 uppercase font-semibold">
            {product.brand}
          </p>
        )}
        <p className="text-2xl font-bold">{product.title}</p>
        <div className="w-full flex gap-2 items-center flex-row justify-start ">
          <span className="p-1">
            <div className={cn(
              getRatingColor(customRating.product?.rating),
              "px-1 text-sm gap-1 items-center text-center flex justify-center"
            )}>
              <CustomStarSvgIcon h="20" w="20" />
              <span className="text-lg">
                {customRating.product?.rating ?? 0.0}
              </span>
            </div>
          </span>
          <span className="text-base font-medium px-2">
            {`(${formatPriceNumber(customRating.product?.rating_count ?? 0)} customers ratings)`}
          </span>
        </div>
      </div>
      {customRating.product?.price && (
        <div className="w-full flex flex-row gap-3">
          <span className="font-bold text-2xl text-card-foreground">
            {`₹ ${formatPriceNumber(product?.mrp || customRating.product?.price)}`}
          </span>
          <span className="text-gray-500 text-lg line-through ">{`₹${formatPriceNumber(
              customRating.reg_price
            )}`}</span>
        </div>
      )}
       <span className="text-xs flex items-center flex-row gap-1">
            <History className="h-4 w-4" />
            {`Price updated ` + format(customRating.product?.last_updated || 0)}
          </span>
      <BuySuggestionEmoji />
      <span className="text-xs flex items-center flex-row gap-1"></span>
      <div className="flex flex-row w-full gap-4">
        <Link
          href={ addAffiliateTag(storeUrl)}
          target="_blank"
          className={cn(buttonVariants({ variant: "default" }), "w-fit uppercase")}
        >
          <ShoppingCart className="h-5 w-5 mr-2" /> BUY ON {product.store || store}
        </Link>
        <AddToTrackingBtn
          payload={{
            id: product.id,
            name: product.name,
            price: product?.mrp || customRating.product?.price,
            image: product.image,
            url: `/${store}/${product.id}`,
            track_value: product.name,
            track_by: "store_page",
            store: product.store || store,
            discount: 0
          }}
        />
      </div>
    </>
  );
};

export default StoreProductComponent;