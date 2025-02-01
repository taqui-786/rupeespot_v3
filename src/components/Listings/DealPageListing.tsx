"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { Info, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ProductCardLoader from "../loaders/ProductCardLoader";
import ProductCard from "../product/ProductCard";
import { Button } from "../ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { getCheckboxOpitions } from "@/lib/CustomServerFunctions";
import { FilterIcon } from "../Animations/Icons";
import CategoryHeaderDealsPage from "../product/CategoryHeaderDealsPage";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import SmoothScrollToTopButton from "../ScrollToTopBtn";
import FilterForm from "../forms/Filter";

interface Deal {
  id: string;
  last_updated: string;
  // Add other properties as needed
}

interface FilterState {
  brands: string[];
  sortBy: string[];
  discounts: string[];
  rating: string[];
}

const DealsListings: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [isLatestPost, setIsLatestPost] = useState(0);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();
  const [isFiltering, setIsFiltering] = useState(false);
  const [filtering, setFiltering] = useState<FilterState>({
    brands: ["all"],
    sortBy: ["all"],
    discounts: ["0"],
    rating: ["all"],
  });
  const [category, setCategory] = useState<string | null>("all");
  const [store, setStore] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const fetchLatest = useCallback(async () => {
    if (filtering.brands[0] !== "all" || filtering.discounts[0] !== "0") return;

    try {
      const timestamp = deals[0]?.last_updated;
      const { data } = await axios.get(
        `/api/deals/latestpost?timestamp=${encodeURIComponent(timestamp)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_APP_API_KEY,
          },
        }
      );
      setIsLatestPost(data.message[0].count_latest || 0);
    } catch (error) {
      toast.error("Internal server error!");
    }
  }, [deals, filtering]);

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

  const fetchDeals = useCallback(
    async (isFiltered: boolean) => {
      try {
        const nextPage = page + 1;
        console.log(filtering);

        const endpoint = isFiltered
          ? `/api/deals?items=25&page=${page}&sortBy=${filtering.sortBy}&brand=${filtering.brands}&discount=${filtering.discounts}&rating=${filtering.rating}&vertical=${category}`
          : `/api/deals?items=25&page=${page}`;

        const { data } = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_APP_API_KEY,
          },
        });
        if (data.message.length) {
          setDeals((prevDeals) => [...prevDeals, ...data.message]);
          setPage(nextPage);
        } else {
          setFound(true);
          toast.info("No more posts to load!");
        }
      } catch (error) {
        toast.error("Failed to fetch deals!");
      } finally {
        setLoading(false);
      }
    },
    [page, filtering, category]
  );

  useEffect(() => {
    fetchDeals(false);
    getOptions();
  }, []);

  useEffect(() => {
    if (deals.length === 0) return;

    const intervalId = setInterval(fetchLatest, 60000);
    return () => clearInterval(intervalId);
  }, [deals, fetchLatest]);

  useEffect(() => {
    if (inView && !loading && !found) {
      const isFiltered =
        filtering.brands[0] !== "all" ||
        filtering.discounts[0] !== "0" ||
        filtering.rating[0] !== "all" ||
        category !== null;
      fetchDeals(isFiltered);
    }
  }, [inView, loading, found, filtering, fetchDeals, category]);

  const handleFilter = useCallback(async () => {
    setOpen(false);
    setFound(false);
    setLoading(true);
    setPage(1);
    setDeals([]);

    try {
      const { data } = await axios.get(
        `/api/deals?items=25&page=1&sortBy=${filtering.sortBy}&brand=${filtering.brands}&discount=${filtering.discounts}&rating=${filtering.rating}&vertical=${category}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_APP_API_KEY,
          },
        }
      );

      if (data.message.length) {
        setDeals(data.message);

        toast.success("See the filtered products");
      } else {
        toast.info("Sorry, no products found!");
      }
    } catch (error) {
      toast.error("Failed to filter products!");
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  }, [filtering, category]);

  useEffect(() => {
    if (isFiltering) {
      handleFilter();
    }
  }, [isFiltering, handleFilter]);
  const loadLatestPost = async () => {
    try {
      const { data } = await axios.get(`/api/deals?items=25&page=1`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_APP_API_KEY,
        },
      });
      if (data.message.length) {
        setIsLatestPost(0);
        setCategory("all");
        setDeals(data.message);
      } else {
        setFound(true);
        toast.info("No more posts to load!");
      }
    } catch (error) {
      toast.error("Failed to fetch deals!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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

      {isLatestPost !== 0 && (
        <div className="w-full h-16 bg-transparent sticky top-14 z-50 grid place-content-center">
          <Button onClick={loadLatestPost}>
            <RefreshCw className="mr-1 h-4 w-4" /> {isLatestPost} more deals
            found
          </Button>
        </div>
      )}
      <div className="w-full flex items-center justify-center sticky top-0 bg-white/30 backdrop-blur-md border border-white/40 z-50 px-2 sm:px-0">
        <ScrollArea className="w-full">
          <div className="flex whitespace-nowrap w-full items-center justify-center">
            <Button
              className="relative flex gap-2 items-center  hover:bg-background z-10 "
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

      <div className="w-full relative flex flex-row mt-4 items-center justify-center pb-4 flex-wrap gap-2 sm:gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ProductCardLoader key={`loader-${index}`} />
          ))
        ) : deals.length > 0 ? (
          deals.map((item, index) => (
            <ProductCard key={`deal-${item.id}-${index}`} item={item} />
          ))
        ) : (
          <div className="my-10 p-5 rounded-sm text-lg font-semibold flex bg-gray-100 ">
            {" "}
            <Info className="h-6 w-6 mr-2 text-primary" /> Sorry No Products
            found{" "}
          </div>
        )}
      </div>

      {!found && !loading && deals.length >= 24 && (
        <div
          className="w-full h-40 p-5 flex items-start justify-center"
          ref={ref}
        >
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      )}
    </>
  );
};

export default DealsListings;
