

import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
    slug?:string
};

const Breadcrumbs:React.FC<Props> = ({slug}) => {
return(
<div className='w-full flex items-center pt-2 pl-4  lg:pl-2 relative md:absolute top-0 left-0' >
<ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
  <li className="inline-flex items-center">
    <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-primary  dark:focus:text-blue-500" >
      Home
    </Link>
    <ChevronRight className=" h-4 w-4 flex-shrink-0 mx-2 overflow-visible  text-gray-400 dark:text-neutral-600 " />
  </li>
  {
    slug === 'deals' ?
    <li className="inline-flex items-center">
    <Link href="/deals" className="flex items-center text-sm text-gray-500 hover:text-primary  dark:focus:text-blue-500" >
      Product
    </Link>
  </li> :
  <li className="inline-flex items-center">
    <span className="flex items-center text-sm capitalize text-gray-500 hover:text-primary  dark:focus:text-blue-500" >
      {slug}
    </span>
  </li>
  }
 
</ol> </div>
)
};
export default Breadcrumbs;