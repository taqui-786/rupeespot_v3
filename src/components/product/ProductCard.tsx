"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { History, Star, Store } from "lucide-react";

import { format } from "timeago.js";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Badge } from "../ui/badge";
import Image from "next/image";

interface ProductCardProp {
  item: any;
}
const varients = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};
const images = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};
const ProductCard: React.FC<ProductCardProp> = ({ item }) => {
  const router = useRouter();
  // FUNCTION TO ADD (...) SYMBOL IF THE TEXT IS GREATER THAN 8 WORD
  const addEllipsis = (text: string) => {
    const formattedText = text.replace(/\/|\s{2,}|\n/g, " ").trim();

    if (formattedText.length > 30) {
      return formattedText.substring(0, 43) + "...";
    }

    return formattedText;
  };

  return (
    <motion.div
      variants={varients}
      initial="hidden"
      animate="show"
      className=" w-[90%] md:w-fit"
    >
      <Link
        href={`/product/${item.id}`}
        prefetch={false}
        onMouseEnter={() => router.prefetch(`/product/${item.id}`)}
      >
        <VersionTwo
          productData={{
            imageUrl: item.image,
            title: item.name,
            brand: item.brand,
            rating: item.rating,
            currentPrice: item.deal_price,
            originalPrice: item.mrp,
            platform: item.store,
            timeAgo: format(item.last_updated as Date),
            discount: item.discount,
          }}
        />
        {/* <Card className="group  w-full h-[364px] cursor-pointer  md:w-[240px] flex flex-col justify-around overflow-hidden hover:border-primary hover:bg-gray-50 dark:hover:bg-[#1f2937] shadow-md ">
          <CardHeader className="grid place-content-center p-2 py-4 group-hover:scale-105 ">
            <div className=" block relative min-h-36">
              <motion.img
                src={item.image || ""}
                alt="products"
                className=" w-auto max-w-36 max-h-36 mix-blend-multiply dark:mix-blend-normal "
                loading="lazy"
                variants={images}
              />
            </div>
          </CardHeader>
          <CardContent className="px-1 md:px-3 pb-2 ">
            <div>
              <span
                className={cn(
                  "w-full text-start text-[10px] text-gray-500 font-bold",
                  { "opacity-0": !item?.brand }
                )}
              >
                {item?.brand ? item?.brand : "Brand"}
              </span>
              <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 min-h-[40px]">
                {addEllipsis(item.name)}
              </p>
            </div>
          </CardContent>
          <CardFooter className=" px-1 md:px-3 gap-2 flex flex-col ">
       
            <div className="flex items-center justify-start w-full my-1">
              <Star
                className={cn(
                  { "fill-gray-500 text-gray-500": item.rating < 1 },
                  { "text-red-400 fill-red-400": item.rating! >= 1 },
                  { "text-orange-400 fill-orange-400": item.rating! >= 3 },
                  { "text-green-400 fill-green-400": item.rating! >= 3.9 },
                  " w-5 h-5 mr-1.5 sm:mr-1 "
                )}
              />
              <span className="font-medium mr-2 sm:mr-1">
                {item?.rating === null ? 0.0 : item?.rating}
              </span>
              <span className="text-sm text-gray-500">{`(${
                item?.rating_count === null ? 0 : formatPriceNumber(item?.rating_count)
              } ratings)`}</span>
            </div>
        
            <div className="flex items-center justify-evenly sm:justify-start w-full ">
              <span className="text-lg font-bold mr-2">{`₹${formatPriceNumber(
                item?.deal_price
              )}`}</span>
              {item?.mrp !== null && (
                <span className="text-sm text-gray-500 line-through mr-2">{`₹${
                  formatPriceNumber(item?.mrp) || ""
                }`}</span>
              )}
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                {item?.discount}% off
              </Badge>
            </div>

            <div className="w-full flex items-center justify-between ">
              <div>
                <ShowStoreName store={item?.store} />
              </div>
              <span className=" text-[8px] sm:text-xs flex items-center flex-row gap-1">
                <History className="size-3 sm:size-4" />
                {format(item.last_updated as Date)}
              </span>
            </div>
          </CardFooter>
        </Card> */}
      </Link>
    </motion.div>
  );
};
export default ProductCard;

const VersionTwo = ({ productData }: { productData: any }) => {
  return (
    <Card className="w-full group min-h-[370px] cursor-pointer  md:w-[240px] grid grid-rows-[auto,1fr] hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-square relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-t-lg" />
        <Image
          src={productData.imageUrl}
          alt={productData.title}
          width={240}
          height={240}
          priority={false}
          unoptimized={true}
          className="relative object-contain w-full h-full max-h-[300px] sm:max-h-[240px] p-2 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
          {productData.discount}% OFF
        </Badge>
      </div>
      <div className="p-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {productData.brand}
            </span>
            <div className="flex items-center">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs ml-1">{productData?.rating || 0.0}</span>
            </div>
          </div>
          <h3 className="text-sm mt-1 line-clamp-2">{productData.title}</h3>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold">
              ₹{productData.currentPrice}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              ₹{productData.originalPrice}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <Store className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs ml-1 uppercase">
                {productData.platform}
              </span>
            </div>
            {/* <ShowStoreName store={productData.platform} /> */}
            <span className="text-xs text-muted-foreground">
              {productData.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
