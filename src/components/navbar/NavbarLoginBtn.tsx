"use client";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ProfileMenu from "./ProfileMenu";
import { useEffect } from "react";

type Props = {};
const NavbarLoginBtn: React.FC<Props> = ({}) => {
  const pathname = usePathname();
  const { data: session }: any = useSession();
  useEffect(() => {
    if (session?.user) {
      if (typeof window !== undefined) {
        const userData = {
          email: session?.user?.email,
          expiresAt: session?.expires,
        };
        window.localStorage.setItem(
          "rupeespotUserData",
          JSON.stringify(userData)
        );
      }
    }
  });

  return (
    <>
      {session !== undefined ? (
        session?.user ? (
          <ProfileMenu user={session?.user} />
        ) : pathname.startsWith("/auth/signin") ? (
          <Link href="/auth/signup" className={cn(buttonVariants())}>
            Sign-up
          </Link>
        ) : (
          <Link
            href={`/auth/signin?callbackUrl=${pathname}`}
            className={cn(buttonVariants())}
          >
            Sign-in
          </Link>
        )
      ) : (
        <span className="p-4 w-20 animate-pulse bg-gray-200 rounded-md dark:bg-gray-700"></span>
      )}
    </>
  );
};
export default NavbarLoginBtn;
