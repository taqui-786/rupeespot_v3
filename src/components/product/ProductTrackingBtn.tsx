"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  addTomyTrackingList,
  checkProductinMyList,
  removeFromTrackingList,
} from "@/lib/actions/authActions";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Player } from "@lordicon/react";
import { CheckIcon, Loader2 } from "lucide-react";
import { useData } from "@/lib/Context";
import STAR from "../../../public/icons/Star_custom_icon.json";
type RemoveFromTrackingProps = {
  productId: string;
  btnSize?: any;
};
export const RemoveFromTracking: React.FC<RemoveFromTrackingProps> = ({
  productId,
  btnSize = "default",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      await removeFromTrackingList(productId);
    } catch (error) {
      toast.error("Internal server error!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={"destructive"}
      isLoading={isLoading}
      size={btnSize}
      onClick={handleOnClick}
    >
      Remove From Tracking
    </Button>
  );
};


type AddToTrackingBtnProps = {
  payload: any;
};
export const AddToTrackingBtn: React.FC<AddToTrackingBtnProps> = ({payload}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [alreadyAdded, setAlreadyAdded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mounting, setMounting] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [trackingOption, setTrackingOption] = useState("custom");
  const playerRef = useRef<Player>(null);

  const [suggestedPrices, setSuggestedPrices] = useState<Array<any>>([])
const {threeLowestPrice} = useData()
  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  // Check if product is already in the tracking list
  useEffect(() => {
    async function checkIfAdded() {
      if (!session?.user || !payload?.id) return;
      try {
        const result = await checkProductinMyList(payload.id);
        setAlreadyAdded(result as boolean);
      } catch (error) {
        toast.error("Internal Server Error!");
      } finally {
        setMounting(true);
        setIsLoading(false);
      }
    }
    checkIfAdded();
  }, [payload.id, session?.user]);

  // Handle product addition to tracking list
  const handleAddProductFunc = async () => {
    setIsLoading(true);
    try {
      if (!session?.user) {
        router.push(`/auth/signin?callbackUrl=${payload?.url}`);
        toast.error("Sign-in to add product to Tracking list.");
        return;
      }
     
  
      const result = await addTomyTrackingList({product:payload,isCustomPrice: trackingOption === "custom",customPrice:alertPrice});
      console.log(trackingOption,result);
      
      if (result === "ProductAdded") {
        setIsAdded(true);
        toast.success("Added to My Tracking list");
        setTimeout(() => {
          setOpen(false)
          setAlreadyAdded(true)
        }, 1000)
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle product removal from tracking list
  const handleRemoveFromList = async () => {
    setIsLoading(true);
    try {
      const result = await removeFromTrackingList(payload.id);
      if (result === "deletedProduct") {
        setAlreadyAdded(false);
        setIsAdded(false)
        toast.error("Removed from My Tracking List");
      }
    } catch (error) {
      toast.error("Internal server error!");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      {mounting ? (
        alreadyAdded ? (
          <Button
            variant="destructive"
            isLoading={isLoading}
            onClick={handleRemoveFromList}
          >
            Remove From Tracking
          </Button>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
               
                onMouseEnter={() => playerRef.current?.playFromBeginning()}
                >
                  <i className="mr-1.5">
                    <Player ref={playerRef} icon={STAR} size={26} />
                  </i>
                  Add To Tracking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {isAdded && <CheckIcon className="w-6 h-6 text-green-500" />}
                  {isAdded
                    ? "Added to My Tracking List!"
                    : "Add to tracking list"}
                </DialogTitle>
              </DialogHeader>
              {isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : isAdded ? (
                <p className="text-sm text-muted-foreground">
                  {trackingOption === "lowest"
                    ? "You will be alerted when the price reaches its lowest point."
                    : `You will be alerted when the price falls below ₹${alertPrice}`}
                </p>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="flex flex-row items-center gap-2">
                    <Label
                      htmlFor="current-price"
                      className=" text-right whitespace-nowrap"
                    >
                      Current price is:
                    </Label>
                    <span id="current-price" className="font-semibold">
                      ₹{payload.price}
                      <span className="text-sm ml-1 text-muted-foreground">
                        ({payload.discount}% discount)
                      </span>
                    </span>
                  </div>
                  <RadioGroup
                    value={trackingOption}
                    onValueChange={setTrackingOption}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="custom"
                        id="custom"
                       
                      />
                      <Label htmlFor="custom">Custom price tracking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="lowest"
                        id="lowest"
                      
                      />
                      <Label htmlFor="lowest">Track the lowest price</Label>
                    </div>
                  </RadioGroup>
                  {trackingOption === "custom" && (
                    <>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Label
                          htmlFor="alert-price"
                          className="text-right whitespace-nowrap"
                        >
                          Alert when price is less than:
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="alert-price"
                            type="number"
                            value={alertPrice as number}
                            onChange={(e:any) => setAlertPrice(e.target.value)}
                            className="w-24"
                            placeholder="₹"
                          />
                          <Button onClick={handleAddProductFunc} disabled={alertPrice === null}>
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Track"
                            )}
                          </Button>
                        </div>
                        </div>
                  <Label className="text-sm text-muted-foreground">SUGGESTED LOWER PRICES</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {threeLowestPrice.map((price) => (
                      <Button
                        key={price}
                        variant="outline"
                        onClick={() => setAlertPrice(price.toString())}
                      >
                        ₹{price}
                      </Button>
                    ))}
                  </div>
                      </div>
                    </>
                  )}
                  {trackingOption === "lowest" && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        You will be notified when the price is at its lowest.
                      </p>
                      <Button
                        onClick={handleAddProductFunc}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Start Tracking Lowest Price
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )
      ) : (
        <span className="p-4 w-28 animate-pulse bg-gray-200 rounded-md dark:bg-gray-700"></span>
      )}
    </>
  );
};