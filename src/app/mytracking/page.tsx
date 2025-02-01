"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import { MyTrackingProducts, removeFromTrackingList } from "@/lib/actions/authActions";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Bell, BellOff, Clock, Info, Trash2 } from "lucide-react";
import keywordImg from "../../../public/Keyword.png";
import Image from "next/image";
import emptyCartImg from "../../../public/emptyCartImg.png";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
type Props = {};
const MyTrackingPage: React.FC<Props> = ({}) => {
  const [products, setProducts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoad, setBtnLoad] = useState(false);
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    const fetchMyTrackings = async () => {
      try {
        const getMyProducts: any = await MyTrackingProducts();
        setProducts(getMyProducts);
      } catch (error) {
        console.log(error);
        toast.error("Internal Server Error!");
      } finally {
        setLoading(false);
      }
    };
    fetchMyTrackings();
  }, [deleted]);
  //to remove from list
  const handleOnClick = async (id: string) => {
    try {
      setBtnLoad(true);
      const result = await removeFromTrackingList(id);
      setDeleted(true);
      if (result === "deletedProduct") {
        setProducts((prevProducts) => prevProducts.filter((product) => product.productId !== id));
        toast.success("Removed from My Tracking List");
      }
    } catch (error) {
      toast.error("Internal server error!");
    } finally {
      setBtnLoad(true);
    }
  };
  return (
    <MaxWidthWrapper>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>My Trackings</CardTitle>
          <CardDescription>
            Your list of products that you added to tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {products?.length ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You will be notified when the price is best for you,{" "}
                <Link href={"/"} className="underline mx-0.5">
                  Click Here
                </Link>{" "}
                to change notfication settings
              </AlertDescription>
            </Alert>
          ): ''}
          {loading ? (
            <>
              <div className="h-44 w-full bg-gray-200 rounded-md dark:bg-gray-700 animate-pulse"></div>
              <div className="h-44 w-full bg-gray-200 rounded-md dark:bg-gray-700 animate-pulse"></div>
              <div className="h-44 w-full bg-gray-200 rounded-md dark:bg-gray-700 animate-pulse"></div>
            </>
          ) : products?.length ? (
            products.map((itm, indx) => {
              return (
                <Card
                  key={indx}
                  className="overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 relative group w-full flex items-center justify-center lg:w-[200px] h-[200px]">
                        {itm?.productImg ? (
                          <img
                            src={itm?.productImg}
                            alt="emage"
                            className={`rounded-lg transition-opacity duration-300 bg-cover h-full `}
                          />
                        ) : (
                          <Image
                            src={keywordImg}
                            alt={"sdlkaljk"}
                            layout="fill"
                            objectFit="cover"
                            className={`rounded-lg transition-opacity duration-300 `}
                          />
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-1">
                            {itm.store}
                          </Badge>
                          <div className="flex items-start justify-between mb-2">
                            <h2 className="text-2xl font-semibold text-gray-900 line-clamp-2">
                              {" "}
                              {itm?.productName || `${itm?.track_value}`}
                            </h2>
                            {
                              itm?.productImg ?
                              <Badge className="flex w-fit items-center gap-1 bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
                              <Bell className="h-4 w-4" />
                              Notify
                            </Badge> :
                             <Badge variant={'destructive'} className="flex w-fit items-center gap-1 ">
                             <BellOff className="h-4 w-4" />
                             Notify
                           </Badge>
                        }
                          </div>
                          {itm?.custom_price !== null ?<span className="ml-1 text-sm text-gray-500">Your Custom Tracking Price Set at {`₹ ${itm?.custom_price}`} </span>: ''}
                          <p className="text-3xl font-bold text-indigo-600 mb-4">{`₹ ${itm?.productPrice}`} </p>

                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Clock className="mr-1 h-4 w-4" />
                            Added {format(itm.createdAt as Date)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Link
                            href={`${itm.productUrl}`}
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "flex-1"
                            )}
                          >
                            View Details
                          </Link>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleOnClick(itm?.productId)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center">
              <Image
                src={emptyCartImg}
                alt="emptyCart"
                className="w-auto max-h-60"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};
export default MyTrackingPage;
