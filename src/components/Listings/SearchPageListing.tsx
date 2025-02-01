
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AddToTrackingBtn } from "@/components/Product/ProductTrackingBtn";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { CustomStarSvgIcon, ShowStoreName } from "@/components/CustomIcon";
import { History, Loader2, Search } from "lucide-react";
import { format } from "timeago.js";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FramerWrapper from "../Animations/FramerWrapper";
import ProductImage from "../product/ProductImage";

function SearchPageListing() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword: any = searchParams.get("q");

  const [page, setPage] = useState(1);
  const [found, setFound] = useState(false);
  const { ref, inView } = useInView();
  const [items, setItems] = useState<Array<any>>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isStore, setIsStore] = useState<string>("");

  // Handle Search form Function
  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    try {
      event?.preventDefault();
      setLoading(true);
      setPage(1);
      const { data } = await axios.get(`/api/search?value=${search}`,{
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_APP_API_KEY as string
      }
      });
      router.push(`/search?q=${search}`);
      if (data.message.length > 0) {
        setItems(data.message);
        setIsStore(data?.store || "");
      } else {
        toast.error("Sorry, No Product Found");
        setItems([]);
      }
    } catch (error) {
      setItems([]);
      toast.error("Sorry, No Product Found");
      router.push(`/search`);
    } finally {
      setLoading(false);
    }
  };
  // Handle Search form Function on Page Refresh
  const onKeywordSearch = async (searchKeyword: any) => {
    try {
      setLoading(true);
      setPage(1);
      const { data } = await axios.get(`/api/search?value=${searchKeyword}`,{
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_APP_API_KEY as string
      }
      });
      
      if (data.message.length > 0) {
        setItems(data.message);
        setIsStore(data?.store || "");
      } else {
        toast.error("Sorry, No Product Found");
      }
    } catch (error) {
      setItems([]);
      toast.error("Sorry, No Product Found");
    } finally {
      setLoading(false);
    }
  };
  const loadMorePosts = async () => {
    try {
      const nextPage = page + 1;
      const { data } = await axios(
        `/api/search/searchall?items=5&page=${nextPage}&match=${search}`,{
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_APP_API_KEY as string
        }
        }
      );
      if (data.message.length) {
        setItems((products: any) => [...products, ...data.message]);
        setIsStore(data?.store || "");

        setPage(nextPage);
      } else {
        toast.info("No more products to load");
        setFound(true);
      }
    } catch (error) {
      toast.error("Failed to load more post !");
    }
  };
  useEffect(() => {
    if (inView && !found) {
      loadMorePosts();
    }
  }, [inView]);
  useEffect(() => {
    if (keyword && keyword.length > 0) {
      setSearch(keyword);
      onKeywordSearch(keyword);
    }
  }, []);
  
  return (
    <>
      <FramerWrapper y={-20}>
        <Card className=" mt-4 border-none shadow-none ">
          <CardHeader className="p-0 mb-4 md:p-6 md:mb-0">
            <CardTitle>Search Deals</CardTitle>
            <CardDescription>
              Enter a keyword to search products.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="w-full ">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <form
                className="flex flex-row items-center gap-4 relative"
                onSubmit={onSubmit}
              >
                <Input
                  id="link"
                  type="text"
                  name="search"
                  value={search}
                  className="md:py-6 pl-10  md:text-base "
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter kewwords or paste the link..."
                  required
                />
                <Search className="h-5 w-5 text-muted-foreground absolute left-0 m-3" />
                <Button
                  disabled={loading}
                  className="md:py-5 absolute right-0 h-full text-base"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5  animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </FramerWrapper>
      <FramerWrapper>
        <Card className="border-none shadow-none ">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              All the Result will be shown here :
            </CardDescription>
            {items.length ? (
              <AddToTrackingBtn
                payload={{
                  id: `${search}-id-123`,
                  name: "",
                  price: 0,
                  image: "",
                  url: `/search?q=${search}`,
                  track_value: search,
                  track_by: "keyword",
                }}
              />
            ) : (
              ""
            )}
          </CardHeader>

          <CardContent className="flex flex-col gap-4 ">
            {items.length ? (
              <>
                {items.map((itm: any, indx: number) => {
                  return (
                    <Link
                      href={
                        itm?.deal_price
                          ? `/product/${itm.id}`
                          : `/${isStore}/${itm?.id}`
                      }
                      className="w-full shadow-md flex-col md:flex-row flex border items-center border-slate-400 rounded-md hover:border-primary p-4 hover:bg-gray-200 "
                      key={indx}
                    >
                      <div className=" block relative min-h-36">
                        {itm?.deal_price ? (
                          <img
                            src={itm?.image || ""}
                            alt="products"
                            className=" w-auto max-w-36  mix-blend-multiply dark:mix-blend-normal"
                            loading="lazy"
                          />
                        ) : (
                          <ProductImage
                            url={itm?.image}
                            store={isStore}
                            className={"w-auto max-w-32 max-h-36"}
                          />
                        )}
                      </div>
                      <div className="h-full flex flex-col gap-2 pl-2">
                        <h1 className="text-md sm:text-lg font-bold ">
                          {itm?.name || itm?.title}
                        </h1>
                        {itm?.deal_price ? (
                          <div className=" flex">
                            <div
                              className={cn(
                                { "text-gray-500": itm?.rating < 1 },
                                { "text-red-400": itm?.rating! >= 1 },
                                { "text-orange-400": itm?.rating! >= 3 },
                                { "text-green-400": itm?.rating! >= 3.9 },
                                "  p-1 text-sm gap-1 items-center text-center flex justify-center"
                              )}
                            >
                              <CustomStarSvgIcon />
                              <span>
                                {itm?.rating === null ? 0.0 : itm?.rating}
                              </span>
                            </div>
                            <span className=" text-xs  p-2">{`(${
                              itm?.rating_count === null ? 0 : itm?.rating_count
                            } ratings)`}</span>
                          </div>
                        ) : (
                        
                            
                       
                          <span className="inline-flex items-center w-fit gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-50 text-gray-500 dark:bg-white/[.05] dark:text-white">
                            {itm?.brand || itm?.category }
                          </span>
                        )}
                        <div className=" flex flex-row gap-3">
                          {itm?.deal_price ? (
                            <>
                              <span className="font-bold text-base text-card-foreground">{`₹${itm?.deal_price ? itm?.deal_price : '00'}`}</span>
                              <span
                                className={`text-gray-500 "text-sm line-through"`}
                              >{`₹${itm?.mrp}`}</span>

                              <span className="text-green-600 text-sm">{`${itm?.discount ? itm?.discount : '0'}% off`}</span>
                            </>
                          ) : (
                            <span className="font-bold text-lg text-card-foreground ml-2">{`₹${itm?.mrp ? itm?.mrp : '00'}`}</span>
                          )}
                        </div>
                        <div className="flex flex-row gap-4">
                          <div className="text-medium text-base w-fit">
                            <ShowStoreName store={itm?.store || isStore} />
                          </div>
                          <span className="text-xs flex items-center flex-row gap-1">
                            <History className="h-4 w-4" />
                            {format(itm?.last_updated as Date)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {!found && items.length > 4 && (
                  <div
                    className="w-full h-40 p-5  flex items-start justify-center"
                    ref={ref}
                  >
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div className="h-full w-full p-5 grid place-content-center">
                <img
                  src="/searchBgImg.png"
                  alt="bgImg"
                  className="h-auto w-auto max-w-md "
                />
              </div>
            )}
          </CardContent>
        </Card>
      </FramerWrapper>
    </>
  );
}

export default SearchPageListing;
