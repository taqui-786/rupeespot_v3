"use client";

import { usePathname } from "next/navigation";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";
import logo from '../../public/MyLogo.png'
import Logo from "@/app/Logo";
const Footer = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname.startsWith("/auth") ? null : (
          <MaxWidthWrapper>
        <footer className="bg-card flex-grow-0">
            <div className="border-t border-gray-200">
              <div>
                <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div
                      aria-hidden="true"
                      className="absolute bg-zinc-50 dark:bg-card inset-0 bg-gradient-to-br bg-opacity-90"
                    />
                  </div>

                  <div className="text-center relative mx-auto max-w-sm">
                    <h3 className="font-semibold text-primary flex flex-row justify-center items-center gap-1"><Image src={logo} alt="logo" className="max-h-10 w-auto "/> <Logo fontSize="text-xl"/></h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This is a free tool to check price history charts for
                      millions of products. With our advanced Price Tracker you
                      can track price for popular Indian stores such as Amazon
                      and Flipkart.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-10 md:flex md:items-center md:px-2.5 md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} All Rights Reserved
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center md:mt-0">
                <div className="flex space-x-8">
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-gray-600"
                  >
                    Terms
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-muted-foreground hover:text-gray-600"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/cookie-policy"
                    className="text-sm text-muted-foreground hover:text-gray-600"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
        </footer>
          </MaxWidthWrapper>
      )}
    </>
  );
};

export default Footer;