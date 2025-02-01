"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { useTheme } from "next-themes";
import TAG from "../../../public/icons/system-solid-146-label.json";
import CART from "../../../public/icons/system-regular-6-shopping.json";
import MENU from "../../../public/icons/icons8-menu.json";
import GRAPH from "../../../public/icons/Graph_custom_icon.json";
import FILTER from "../../../public/icons/Filter_custom_icon.json";
import BAG from "../../../public/icons/Shopping bag_custom_icon.json";
import SETTING from "../../../public/icons/Settings_custom_icon.json";
import HELP from "../../../public/icons/FAQ_custom_icon.json";
import SEARCH from "../../../public/icons/Search_custom_icon.json";

// Dynamically import the Player component with SSR disabled
const Player = dynamic(
  () => import("@lordicon/react").then((mod) => mod.Player),
  { ssr: false }
);

export const TagIcon = () => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <div
      className=""
      onMouseEnter={() => playerRef.current?.playFromBeginning()} onTouchStart={() => playerRef.current?.playFromBeginning()}
    >
      <Player
        ref={playerRef}
        icon={TAG}
        size={40}
        onComplete={() => playerRef.current?.playFromBeginning()}
      />
    </div>
  );
};
export const CartIcon = ({ href, store }: { href: string; store: string }) => {
  const playerRef = useRef<Player>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && playerRef.current) {
      playerRef.current.playFromBeginning();
    }
  }, [mounted, href, store]);

  return (
    <Link
      href={`${href}`}
      target="_blank"
      onMouseEnter={() => playerRef.current?.playFromBeginning()} 
      onTouchStart={() => playerRef.current?.playFromBeginning()}
      className={cn(buttonVariants({ size: "sm" }), "w-fit uppercase")}
    >
      <i className="mr-2">
        <Player ref={playerRef} icon={CART} size={28} />
      </i>{" "}
      Buy on {store}
    </Link>
  );
};

export const MenuIcon = () => {
  const playerRef = useRef<Player>(null);
  const {  resolvedTheme } = useTheme()

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <div onMouseEnter={() => playerRef.current?.playFromBeginning()} onTouchStart={() => playerRef.current?.playFromBeginning()}>
      <div className="menuIconsCustomStyles">
        <Player ref={playerRef} icon={MENU} size={28} colorize={resolvedTheme === 'dark' ? '#ffffff' : '#333'}  />
      </div>
    </div>
  );
};
export const GraphIcon = () => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <div
      className="mr-2"
      onMouseEnter={() => playerRef.current?.playFromBeginning()}
    >
      <Player ref={playerRef} icon={GRAPH} size={32} />
    </div>
  );
};
export const FilterIcon = () => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <div
      className="flex flex-col gap-1 items-center justify-center"
      onMouseEnter={() => playerRef.current?.playFromBeginning()} onTouchStart={() => playerRef.current?.playFromBeginning()}
    >
      <div className="w-10 h-auto aspect-square bg-gray-200 flex items-center justify-center rounded-full border animate-pulse border-black">

      <Player ref={playerRef} icon={FILTER} size={30} />
      </div>
       <span className="text-xs">FILTER</span>
    </div>
  );
};
export const BagIcon = () => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <div
      className="flex gap-1 items-center justify-center cursor-pointer"
      onMouseEnter={() => playerRef.current?.playFromBeginning()} onTouchStart={() => playerRef.current?.playFromBeginning()}
    >
      <Player ref={playerRef} icon={BAG} size={24} /> <span>My Trackings</span>
    </div>
  );
};
export const SettingIcon = () => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <div
      className="flex gap-1 items-center justify-center cursor-pointer"
      onMouseEnter={() => playerRef.current?.playFromBeginning()} onTouchStart={() => playerRef.current?.playFromBeginning()}
    >
      <Player ref={playerRef} icon={SETTING} size={24} /> <span>Settings</span>
    </div>
  );
};
export const HelpIcon = () => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <div
      className="flex gap-1 items-center justify-center cursor-pointer"
      onMouseEnter={() => playerRef.current?.playFromBeginning()} onTouchStart={() => playerRef.current?.playFromBeginning()}
    >
      <Player ref={playerRef} icon={HELP} size={24} /> <span>Help</span>
    </div>
  );
};
export const SearchIcon = () => {
  const playerRef = useRef<Player>(null);
  const {  resolvedTheme } = useTheme()
  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);
  return (
    <Link
      href={"/search"}
      onTouchStart={() => playerRef.current?.playFromBeginning()}
      onMouseEnter={() => playerRef.current?.playFromBeginning()}
      className="relative w-[fit] h-fit flex px-3 py-2 items-center text-sm text-gray-500 cursor-pointer  md:bg-gray-100 bg-transparent  border-transparent rounded-md dark:bg-background "
    >
      <div className={resolvedTheme === 'dark' ? '': "searchIcon" }>
        <Player ref={playerRef} icon={SEARCH} size={24} colorize={resolvedTheme === 'dark' ? '#ffffff' :"#6b7280"} />
      </div>
      <p className=" hidden md:block text-center px-2 ">Search products...</p>
    </Link>
  );
};
