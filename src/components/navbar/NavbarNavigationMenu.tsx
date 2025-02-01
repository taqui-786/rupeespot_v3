"use client";
import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Loader2 } from "lucide-react";

async function getData() {
  const fetching = await fetch(`/api/deals/category`, {
    cache: "no-store",
  });

  if (!fetching.ok) {
    throw new Error("Failed to fetch home deals");
  }

  return fetching.json();
}

function NavbarNavigationMenu() {
  const [category, setCategory] = useState([]);
  const [loading , setLoading]  = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        
      const res = await getData();
      setCategory(res?.message);
      } catch (error) {
        console.log(error);
        
      }finally{
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-medium text-sm sm:text-base text-card-foreground">
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {loading ? <div className="h-24  grid place-content-center p-4 w-[400px] md:w-[500px] lg:w-[850px] max-h-[600px]">
              <span className="w-fit text-base font-semibold flex"><Loader2 className="h-5 w-5 mr-1 animate-spin text-primary"/>Loading</span>
              </div> :<ul className="grid w-[400px] gap-3 grid-cols-2 p-4 md:w-[500px] md:grid-cols-5 lg:w-[850px] max-h-[600px] overflow-y-scroll overflow-x-hidden ">
              { 
                category.map((itm: any, indx: number) => (
                  <ListItem key={indx} href={`/category/${itm?.category}`}>
                    {itm?.category}
                  </ListItem>
                ))}
            </ul>}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-medium text-sm sm:text-base text-card-foreground">
            Brands
          </NavigationMenuTrigger>
          <NavigationMenuContent>
          {loading ? <div className="h-24  grid place-content-center p-4 w-[400px] md:w-[500px] lg:w-[850px] max-h-[600px]">
              <span className="w-fit text-base font-semibold flex"><Loader2 className="h-5 w-5 mr-1 animate-spin text-primary"/>Loading</span>
              </div> :<ul className="grid w-[400px] gap-3 grid-cols-2 p-4 md:w-[500px] md:grid-cols-5 lg:w-[850px] max-h-[600px] overflow-y-scroll overflow-x-hidden ">
              { 
                category.map((itm: any, indx: number) => (
                  <ListItem key={indx} href={`/brand/${itm?.brand}`}>
                    {itm?.brand}
                  </ListItem>
                ))}
            </ul>}
            {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavbarNavigationMenu;
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, children, href, ...props }, ref) => {
  return (
    <li>
      <Link href={href as string} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {children}
        </NavigationMenuLink>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";
