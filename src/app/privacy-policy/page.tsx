import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Metadata } from "next";


export const metadata:Metadata = {
  title:"Privacy Policy",
  robots:{
    follow:true,
    index:false
  }
}
export default function page() {
  return (
    <MaxWidthWrapper>
      <div className="h-full flex flex-col gap-4">
        <div className="w-full grid place-content-center py-20 bg-gray-100 dark:bg-slate-900">
          <h1 className="text-3xl font-bold ">Privacy Policy</h1>
        </div>
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-lg font-bold">Heading</h1>
          <p className="text-base font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore,
            eligendi, voluptate vero accusamus blanditiis nam quae eos ipsam
            doloribus recusandae quaerat consequatur aliquid iste repellendus
            maiores dolor corrupti cum architecto, sequi quisquam reprehenderit
            quod aperiam. Pariatur dicta voluptatibus consequatur, architecto
            laboriosam, eos ea cumque dolore enim dolores, at perferendis amet.
          </p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-lg font-bold">Heading</h1>
          <p className="text-base font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore,
            eligendi, voluptate vero accusamus blanditiis nam quae eos ipsam
            doloribus recusandae quaerat consequatur aliquid iste repellendus
            maiores dolor corrupti cum architecto, sequi quisquam reprehenderit
            quod aperiam. Pariatur dicta voluptatibus consequatur, architecto
            laboriosam, eos ea cumque dolore enim dolores, at perferendis amet.
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
