"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  
  LogOut,
 
} from "lucide-react";
import { signOut } from "next-auth/react";
import { buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";
import { BagIcon, HelpIcon, MenuIcon, SettingIcon } from "../Animations/Icons";

type Props = { user: any };

const ProfileMenu: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const handleSignout = () => {
    if (typeof window !== undefined) {
      window.localStorage.removeItem("rupeespotUserData");
      signOut();
    }
  };
  const handleClick = (to: string) => {
    router.push(to);
  };
  return (
    <DropdownMenu >
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          " p-2"
        )}
      >
       
         <MenuIcon/>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex flex-col w-full">
            <span>{`${user?.firstname || user?.name} ${
              user?.lastname !== undefined ? user.lastname : ""
            }`}</span>
            <span className="text-xs">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleClick('/mytracking')}>
           <BagIcon/>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick('/settings')}>
            <SettingIcon/>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleClick('/help')} >
          <HelpIcon/>
        </DropdownMenuItem>
        {/* @ts-ignore */}
        <DropdownMenuItem onClick={handleSignout} className="flex items-center">
          <LogOut className="mr-1 h-4 w-4" />
          Log-out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileMenu;
