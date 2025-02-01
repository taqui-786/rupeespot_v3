import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Toaster } from "sonner";
import Provider from "@/components/Provider";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rupeespot.com"),
  title: {
    default: "The Ultimate Price Tracker - RupeeSpot",
    template: `Rupeespot | %s`,
  },
  description:
    "Rupeespot.com is your go-to destination for tracking price history across millions of products. Our advanced Price Tracker allows you to monitor prices from top Indian retailers like Amazon, Flipkart, Myntra, Ajio, Croma, and more—all for free!",
  verification: {
    google: "google-site-verification=123456789",
  },
  openGraph: {
    images: [
      {
        url: `${process.env.NEXTAUTH_URL}/api/og`,

        alt: "Rupeespot.com",
      },
    ],
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // initCronJob()
  return (
    <html lang="en" suppressHydrationWarning={true} className="scroll-smooth">
      <body className={cn("relative h-full antialiased", roboto.className)}>
        <Provider>
          <main className="relative flex flex-col min-h-dvh">
            <Navbar />
            <div className=" relative flex-grow flex-1 ">{children}</div>
            <Footer />
          </main>
        </Provider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
