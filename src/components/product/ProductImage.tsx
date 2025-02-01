"use client";
import { convertToFullImageUrl } from "@/lib/CustomServerFunctions";
import { cn } from "@/lib/utils";
import noImageFound from '../../../public/NoImageFound.png'
import { useEffect, useState } from "react";

type Props = {
  url: string;
  className?: string;
  store?: string;
};
const ProductImage: React.FC<Props> = ({ url, store, className }) => {
  const [imgUrl, setImgUrl] = useState("");
  useEffect(() => {
    const generateImgUrl = async () => {
      if (url.startsWith("http")) {
        setImgUrl(url);
      } else {
        const result = await convertToFullImageUrl(url, store!);
        setImgUrl(result!);
      }
    };
    generateImgUrl();
  }, [url]);

  return (
    <img
      src={imgUrl || noImageFound as any}
      alt="image"
      loading="lazy"
      className={cn("h-auto w-auto", className)}
    />
  );
};
export default ProductImage;
