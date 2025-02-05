"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Monitor,
  Book,
  Utensils,
  Shirt,
  Baby,
  X,
  Tv,
  Lightbulb,
  Heart,
  Dumbbell,
  Factory,
  Box,
  Car,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryHeaderDealsPageProps {
  setCategory: (category: string) => void;
  isFiltering: () => void;
  myCategory: string | null;
}

const categories = [
  { name: "Mobiles", value: "mobile", icon: Smartphone, color: "bg-[#FF6B6B]",  },
  { name: "Computers", value: "computer", icon: Monitor, color: "bg-[#4ECDC4]" },
  { name: "Electronics", value: "Electronic", icon: Tv, color: "bg-[#45B7D1]" },
  { name: "Appliances", value: "Appliance", icon: Lightbulb, color: "bg-[#FFA07A]" },
  { name: "Books", value: "book", icon: Book, color: "bg-[#98D8C8]" },
  { name: "Home & Kitchen", value: "home & kitchen", icon: Utensils, color: "bg-[#F7B801]" },
  { name: "Fashion", value: "fashion", icon: Shirt, color: "bg-[#7FDBDA]" },
  { name: "Baby", value: "baby", icon: Baby, color: "bg-[#FF9FF3]" },
  { name: "Automotive", value: "automotive", icon: Car, color: "bg-[#54A0FF]" },
  { name: "Beauty", value: "beauty", icon: Sparkles, color: "bg-[#5F27CD]" },
  { name: "Personal Care", value: "personal care", icon: Heart, color: "bg-[#FF6B6B]" },
  { name: "Sports", value: "sport", icon: Dumbbell, color: "bg-[#10AC84]" },
  { name: "Industrial", value: "industrial", icon: Factory, color: "bg-[#636E72]" },
  { name: "Other", value: "other", icon: Box, color: "bg-[#A5B1C2]" }
];

export default function CategoryHeaderDealsPage({
  setCategory,
  isFiltering,
  myCategory,
}: CategoryHeaderDealsPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
        setShowGradient(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const handleClick = (val: string) => {
    if (val === myCategory) {
      setCategory("all");
    } else {
      setCategory(val);
    }
  };

  return (
    <div className="flex-grow  shadow-sm">
      <div className="container mx-auto px-1  py-0 ">
        <div className="flex items-center space-x-4">
        
          <div className="relative flex-1">
              <div ref={scrollRef} className="flex space-x-4">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={myCategory === category.value ? "default" : "ghost"}
                    className={cn(
                      "flex flex-col items-center p-2 h-fit transition-all duration-300 ease-in-out",
                      myCategory === category.value
                        ? "bg-primary text-primary-foreground transform scale-105"
                        : "hover:bg-background"
                    )}
                    onClick={() => handleClick(category.value)}
                  >
                    <div className={cn(
                      "w-10 h-auto aspect-square flex items-center justify-center rounded-full mb-1",
                      myCategory === category.value ? 'bg-transparent':category.color  
                    )}>
                      {myCategory === category.value ? <X className="h-5 w-5 text-white" /> : React.createElement(category.icon, {
                        className: cn(
                          "h-5 w-5 ",
                          myCategory === category.value ? "text-white" : `text-white`
                        ),
                      })}
                    </div>
                    <span className="flex items-center text-xs">
                      {category.name}
                    
                    </span>
                  </Button>
                ))}
              </div>
           
            {showGradient && (
              <>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}