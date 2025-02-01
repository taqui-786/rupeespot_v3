"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ProductCard from "../product/ProductCard";
import Meteors from "../Animations/Meteor";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import CategoryHeaderDealsPage from "../product/CategoryHeaderDealsPage";
import SmoothScrollToTopButton from "../ScrollToTopBtn";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import FilterForm from "../forms/Filter";
import { getCheckboxOpitions } from "@/lib/CustomServerFunctions";
import { FilterIcon } from "../Animations/Icons";
interface Product {
  sn: number;
  store: string;
  id: string;
  brand: string;
  name: string;
  mrp: number;
  last_price: number;
  deal_price: number;
  avg_price: number | null;
  discount: number;
  rating: string;
  rating_count: number;
  image: string;
  url: string;
  category: string;
  subcategory: string;
  supcategory: string;
  vertical: string;
  last_updated: string;
}
type BrandPageProps = {
  brand: string;
};

interface FilterState {
  brands: string[];
  sortBy: string[];
  discounts: string[];
  rating: string[];
}
async function getData(
  brand: string,
  filtering: FilterState,
  category: string | null
) {
  const queryParams = new URLSearchParams({
    val: brand,
    sortBy: filtering.sortBy.join(","),
    brand: filtering.brands.join(","),
    discount: filtering.discounts.join(","),
    rating: filtering.rating.join(","),
    vertical: category || "all",
  });

  const fetching = await fetch(`/api/brand?${queryParams}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_APP_API_KEY as string,
    },
  });

  if (!fetching.ok) {
    throw new Error("Failed to fetch brand deals");
  }

  return fetching.json();
}

function BrandPage({ brand }: BrandPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filtering, setFiltering] = useState<FilterState>({
    brands: ["all"],
    sortBy: ["all"],
    discounts: ["0"],
    rating: ["all"],
  });
  const [category, setCategory] = useState<string | null>("all");
  const [store, setStore] = useState<any[]>([]);

  const getOptions = useCallback(async () => {
    try {
      const brandValues = await getCheckboxOpitions();
      if (brandValues) {
        const filteredStore = brandValues.store.filter(
          (item: any) => item.id !== "" && item.label !== ""
        );
        setStore(filteredStore);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }, []);

  const findBrandsProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getData(brand, filtering, category);
      setProducts(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Internal server Error!");
    } finally {
      setLoading(false);
    }
  }, [brand, filtering, category]);

  useEffect(() => {
    findBrandsProduct();
    getOptions();
  }, [findBrandsProduct, getOptions]);

  useEffect(() => {
    if (isFiltering) {
      findBrandsProduct();
      setIsFiltering(false);
    }
  }, [isFiltering, findBrandsProduct]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="w-full flex relative items-center justify-center overflow-hidden py-20 bg-transparent dark:bg-slate-900">
        <Meteors number={25} />
        <h1 className="text-6xl font-semibold text-card-foreground uppercase">
          {decodeURIComponent(brand)}
        </h1>
      </div>
      <SmoothScrollToTopButton />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[280px] sm:w-[300px] py-3 overflow-x-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-slate-600">Filter</SheetTitle>
          </SheetHeader>
          <FilterForm
            myState={setFiltering}
            defaultValue={filtering}
            isFiltering={setIsFiltering}
            storeOpitions={store}
          />
        </SheetContent>
      </Sheet>

      <div className="w-full flex items-center justify-center sticky top-0 bg-white/30 backdrop-blur-md border border-white/40 z-50 px-2 sm:px-0">
        <ScrollArea className="w-full">
          <div className="flex whitespace-nowrap w-full items-center justify-center">
            <Button
              className="relative flex gap-2 items-center hover:bg-background z-10"
              variant="ghost"
              onClick={() => setOpen(!open)}
            >
              <FilterIcon />
            </Button>
            <CategoryHeaderDealsPage
              isFiltering={setIsFiltering}
              setCategory={setCategory}
              myCategory={category}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {loading ? (
        <div className="w-full flex flex-col gap-4 py-20 animate-pulse">
          <div className="w-full h-12 block bg-gray-200 rounded-md dark:bg-neutral-700"></div>
          <div className="w-full h-40 block bg-gray-200 rounded-md dark:bg-neutral-700"></div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2 pl-3 sm:pl-0">
          <div className="w-full relative flex flex-row items-center justify-center pb-4 flex-wrap gap-1 sm:gap-4">
            {products &&
              products.map((val: Product, i: number) => (
                <ProductCard key={i} item={val} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandPage;
