"use client";
import React, { useEffect, useState } from "react";
import maybe from "../../../public/emoji/thinkingEmoji.gif";
import whooGif from "../../../public/emoji/whooGif.gif";
import nope from "../../../public/emoji/cantSayEmoji.gif";
import inded from "../../../public/emoji/indedGifEmoji.gif";
import Image from "next/image";
import { Info, MoveRight } from "lucide-react";
import { useData } from "@/lib/Context";
import { cn } from "@/lib/utils";
function BuySuggestionEmoji() {
  const { suggestion } = useData();
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setThinking(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const renderSeggestionEmoji = () => {
    switch (suggestion) {
      case "Exactly":
        return (
          <Image
            src={whooGif}
            alt="loading"
            height={70}
            width={70}
            id="whoogifemoji"
            loading="eager"
            priority
            unoptimized={true}
            className="rounded-md "
          />
        );
      case "Indeed":
        return (
          <Image
            src={inded}
            alt="loading"
            height={70}
            width={70}
            id="whoogifemoji"
            loading="eager"
            priority
            className="rounded-md "
          />
        );
      case "Maybe":
        return (
          <Image
            src={maybe}
            alt="loading"
            height={70}
            width={70}
            id="whoogifemoji"
            loading="eager"
            priority
            className="rounded-md "
          />
        );
      default: // Nope
        return (
          <Image
            src={nope}
            alt="loading"
            height={70}
            width={70}
            id="whoogifemoji"
            loading="eager"
            priority
            className="rounded-md "
          />
        );
    }
  };
  const renderSuggestionBadge = () => {
    if (suggestion === "Exactly") {
      return "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500";
    } else if (suggestion === "Indeed") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500";
    } else if (suggestion === "Maybe") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500";
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500";
    }
    
  };
  const renderSuggestionDescription = () =>{
    if (suggestion === "Exactly") {
      return "Best time to buy. Prices are the lowest!";
    } else if (suggestion === "Indeed") {
      return "Good time to buy. Prices are favorable.";
    } else if (suggestion === "Maybe") {
      return "Think about it. There are some risks.";
    } else {
      return "Not a good time. Prices are high.";
    }
  }
  return (
    <div className="w-full flex   items-center justify-start">
      <div className="p-2 w-full md:w-fit   rounded-md bg-gray-50 dark:bg-card min-w-20">
        <span className="text-base w-full text-center text-gray-500 font-semibold ">
          Is this a good time to buy this product?
        </span>
        <div className="flex flex-row h-full items-center justify-around mt-4">
          {thinking ? (
            <span className="thinkingLoader"></span>
          ) : (
            renderSeggestionEmoji()
          )}
          <MoveRight className="h-5 w-5" />
          {thinking ? (
            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
              Thinking...
            </span>
          ) : (

            <span className={cn(`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium uppercase`, suggestion === 'Indeed'&&'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500' || suggestion === 'Exactly' && 'bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500' || suggestion === 'Maybe' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500' || 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500')}>
              {suggestion}
            </span>
          )}
        
        </div>
        {
          thinking ? "" :
        <span className="text-xs text-gray-500 mt-2 flex w-full text-center items-center justify-center"><Info className="h-3.5 w-3.5 mr-1" />{renderSuggestionDescription()}</span>
        }
      </div>
    </div>
  );
}

export default BuySuggestionEmoji;
