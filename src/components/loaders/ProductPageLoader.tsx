
type Props = {};

const ProductPageLoader:React.FC<Props> = ({}) => {
return(
<div className='w-full p-4 animate-pulse' >
<div className="flex flex-col md:flex-row ">
  <div className="flex-shrink-0">
    <span className=" aspect-square w-full md:w-[175px] block bg-gray-200 rounded-sm dark:bg-gray-700"></span>
  </div>

  <div className="ms-4 mt-2 w-full">
    <h3 className="h-4 bg-gray-200 rounded-full dark:bg-gray-700" style={{width:'40%'}}></h3>

    <ul className="mt-5 space-y-3">
      <li className="w-full h-6 bg-gray-200 rounded-md dark:bg-gray-700"></li>
      <li className="w-full h-6 bg-gray-200 rounded-md dark:bg-gray-700"></li>
      <li className="w-full h-6 bg-gray-200 rounded-md dark:bg-gray-700"></li>
      <li className="w-full h-6 bg-gray-200 rounded-md dark:bg-gray-700"></li>
    </ul>
  </div>
</div> 
    <div className="w-full h-[250px] mt-3 bg-gray-200  dark:bg-gray-700"></div>
</div>
)
};
export default ProductPageLoader;