"use client";
import { History, Info } from "lucide-react";
import { CustomStarSvgIcon } from "../CustomIcon";
import Link from "next/link";
import { AddToTrackingBtn } from "./ProductTrackingBtn";
import { cn } from "@/lib/utils";
import { format } from "timeago.js";
import BuySuggestionEmoji from "./BuySuggestionEmoji";
import { addAffiliateTag, formatPriceNumber } from "@/lib/CustomFunctions";
import BoxReveal from "../Animations/BoxReveal";
import { CartIcon } from "../Animations/Icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Props = {
  product: any;
};

const DealsComponent: React.FC<Props> = ({ product }) => {
  return (
    <>
      <div className="w-full text-start flex flex-col gap-3">
        {product?.brand ? (
          <Link
            href={`/brand/${product?.brand && product?.brand.toLowerCase()}`}
            className="inline-flex items-center gap-x-1.5 py-1.5 px-3 w-fit rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white"
          >
            {product?.brand || ""}
          </Link>
        ) : (
          ""
        )}
        <BoxReveal duration={0.5}>
          <p className="text-2xl font-bold flex">{product?.name}</p>
        </BoxReveal>
        <BoxReveal duration={0.5}>
          <div className="w-full flex gap-2 items-center flex-row justify-center ">
            <span className="  p-1 ">
              <div
                className={cn(
                  { "text-gray-500": product?.rating < 1 },
                  { "text-red-400": product?.rating! >= 1 },
                  { "text-orange-400": product?.rating! >= 3 },
                  { "text-green-400": product?.rating! >= 3.9 },
                  "  px-1 text-sm gap-1 items-center text-center flex justify-center"
                )}
              >
                <CustomStarSvgIcon h={"20"} w={"20"} />
                <span className="text-lg">
                  {product?.rating === null ? 0.0 : product?.rating}
                </span>
              </div>
            </span>
            <span className=" text-base font-medium px-2">{`(${
              product?.rating_count === null
                ? 0
                : formatPriceNumber(product?.rating_count)
            } customers ratings)`}</span>
          </div>
        </BoxReveal>
      </div>
      <BoxReveal duration={0.5}>
        <div className="w-full flex flex-row gap-3 ">
          <span className="font-bold text-2xl text-card-foreground">{`₹${formatPriceNumber(
            product?.deal_price || ""
          )}`}</span>
          {product?.mrp && (
            <span className="text-gray-500 text-lg line-through ">{`₹${formatPriceNumber(
              product?.reg_price
            )}`}</span>
          )}
          <span className="text-green-600 text-lg">{`${
            product?.discount || 0
          }% off`}</span>
          <div className="p-1 ">
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-5 w-5 cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                <div className="bg-primary text-primary-foreground p-2 text-center font-semibold">
                  Discount Information
                </div>
                <div className="p-4 bg-background">
                  <p className="text-center mb-2">
                    <span className="text-2xl font-bold text-primary">
                      {product?.discount || 0}% OFF
                    </span>
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    from its Regular Price
                  </p>
                  <p className="text-center mt-2">
                    <span className="text-lg font-semibold">
                      ₹{product.reg_price}
                    </span>
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </BoxReveal>
      <BoxReveal duration={0.5}>
        <span className="text-sm font-medium flex items-center flex-row gap-1">
          <History className="h-4 w-4" />
          {`Price updated ` + format(product?.last_updated || 0)}
        </span>
      </BoxReveal>
      <BoxReveal duration={0.5}>
        <BuySuggestionEmoji />
      </BoxReveal>

      <BoxReveal duration={0.5}>
        <div className="flex flex-row w-full   gap-4">
          <CartIcon
            href={addAffiliateTag(product?.url)}
            store={product?.store}
          />
          <AddToTrackingBtn
            payload={{
              id: product?.id,
              name: product?.name,
              price: product?.deal_price,
              image: product?.image,
              url: `/product/${product?.id}`,
              track_value: product?.name,
              track_by: "deals_page",
              store: product?.store,
              discount: product?.discount,
            }}
          />
        </div>
      </BoxReveal>
    </>
  );
};
export default DealsComponent;
