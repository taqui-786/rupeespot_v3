import { ImageResponse } from "@vercel/og";
import type { ServerRuntime } from "next";
export const runtime: ServerRuntime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hasTitle = searchParams.has("title");
    const hasSrc = searchParams.has("src");
    const hasBrand = searchParams.has('brand')
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 50)
      : "The Ultimate Price Tracker - RupeeSpot";
    const src = hasSrc ? searchParams.get("src")?.slice(0, 1000) : "https://rupeespot.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FMyLogo.4b983de3.png&w=128&q=75";
    const brand = hasBrand ? searchParams.get("brand")?.slice(0, 100) : "Rupeespot.com"
    const logo = await fetch(new URL("../../../../public/MyLogo.png", import.meta.url)).then((res) => res.arrayBuffer())
    return new ImageResponse(
      (
        <div tw="flex flex-col w-full h-full items-center justify-center bg-white ">
            <div tw="flex flex-row w-full h-fit items-center justify-center">

          <div tw="h-full w-[400px] flex items-center justify-center">
            <img src={`${src}`} height={400} width={350} />
          </div>
          <div tw="flex-grow-1 flex flex-col gap-2 items-center justify-center">

            <h1 tw="text-2xl text-gray-600 font-bold">{brand}</h1>
            <h1 tw="text-3xl text-gray-900 font-bold">{title}</h1>
          </div>
            </div>
            <div tw="text-3xl text-gray-900 font-semibold  w-full flex items-center justify-center"><img src={logo as any} height={74} width={74} /> <span>Rupeespot</span></div>

        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
