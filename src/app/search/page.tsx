"use client";
// import SearchPage from "@/components/SearchPage";
// import { Metadata } from "next";
import dynamic from 'next/dynamic'
const SearchPage = dynamic(
  () => import('@/components/SearchPage'),
  { ssr: false }
)


type Props = {};
// export const metadata: Metadata = {
//   title:'Search',
//   description:'Enter your keyword and search the specific deals products.',

//   }
const page: React.FC<Props> = () => {
  return (
    <SearchPage/>
  );
};

export default page;
