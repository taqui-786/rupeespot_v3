
import { TagIcon } from "../Animations/Icons";
import { Button } from "../ui/button";

function Coupans({text}:{text:string}) {
  return (
    <div className="w-full grid place-content-center ">
      <div className="w-fit mb-3 p-2 md:p-4 flex flex-row gap-1.5 md:gap-3 items-center justify-between bg-gray-50 dark:bg-card border border-dashed border-slate-700">
        <TagIcon />
        <div className="flex flex-col">
          <h2 className="text-gray-500 text-base md:text-lg font-semibold">
            {text}
          </h2>
          {/* <span className="text-sm uppercase text-gray-700 font-bold bg-white">DSKFLDJ</span> */}
        </div>
        <Button size={"sm"}>COPY</Button>
      </div>
    </div>
  );
}

export default Coupans;
