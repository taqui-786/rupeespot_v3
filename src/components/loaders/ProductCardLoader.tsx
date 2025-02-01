type Props = {};

const ProductCardLoader: React.FC<Props> = ({}) => {
 
  return (
    <div className="relative w-[300px]   md:w-[250px] p-2 flex-grow bg-white rounded-lg overflow-hidden shadow hover:shadow-md ">
      <div className="animate-pulse flex flex-col">
        <div className="rounded w-full h-52 bg-gray-200"></div>
        <div className="flex flex-col mt-5">
          <div className="w-full h-5 bg-gray-200 rounded"></div>
          <div className="mt-2 w-10/12 h-3 bg-gray-200 rounded"></div>
          <div className="mt-2 w-8/12 h-3 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center mt-5">
          <div>
            <div className="rounded-full bg-gray-200 w-10 h-10"></div>
          </div>
          <div className="flex justify-between w-full ml-3">
            <div className="w-5/12 h-3 bg-gray-200 rounded"></div>
            <div className="w-2/12 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCardLoader;