import FramerWrapper from "../Animations/FramerWrapper";
import Breadcrumbs from "../product/BreadCrumbs";
import Coupans from "../product/Coupans";
import DealsComponent from "../product/DealsComponent";
import ProductImage from "../product/ProductImage";
import ProductPriceChart from "../product/ProductPriceChart";
import RecommendProduct from "../product/RecommendProduct";
import StoreProductComponent from "../product/StoreProductComponent";
import Link from "next/link";

type Props = {
  data: any;
  id: string;
  store?: string;
};

const ProductPage: React.FC<Props> = ({ data, id, store }) => {
  function getProductHref(): string {
    if (data && data?.store) {
      return data?.url;
    } else {
      if (store === "amazon") {
        return `https://amazon.in/dp/${data?.id}`;
      } else if (store === "flipkart") {
        return `https://www.flipkart.com/${data?.slug}`;
      } else if (store === "ajio") {
        return `https://www.ajio.com/${data?.slug}`;
      } else {
        return "/";
      }
    }
  }
  const imageHref = getProductHref();

  return (
    <>
      <div className="py-4 gap-4  mx-auto text-center flex flex-col md:flex-row ">
        <FramerWrapper
          y={0}
          x={-300}
          className={"flex flex-col items-center justify-center relative gap-3"}
        >
          <Breadcrumbs slug={"deals"} />

          <div className=" min-w-[350px] grid place-content-center ">
            <Link href={imageHref} target="_blank">
              {data?.deal_price ? (
                <img
                  src={data?.image || ""}
                  alt="image"
                  loading="lazy"
                  className="h-auto w-auto max-h-[350px] max-w-[350px]"
                />
              ) : (
                <ProductImage
                  url={data?.image}
                  store={store}
                  className={"max-h-[350px] max-w-[350px]"}
                />
              )}
            </Link>
          </div>
        </FramerWrapper>
        <FramerWrapper y={0} x={300}>
          <div className=" min-h-[444px] h-auto flex flex-grow flex-col p-3 pl-5 gap-4">
            {data && data?.store ? (
              <DealsComponent product={data} />
            ) : (
              <StoreProductComponent product={data} store={store as string} />
            )}
          </div>
        </FramerWrapper>
      </div>

      <FramerWrapper>
        {data && data?.remark ? <Coupans text={data?.remark} /> : ""}

        <ProductPriceChart
          data={data}
          id={id}
          store={store}
          type={data && data?.store ? "deals" : "store"}
        />
        {data ? <RecommendProduct  name={data} listingFor="recommend" /> : ""}
        <RecommendProduct name={data} listingFor="latest" />
      </FramerWrapper>
    </>
  );
};
export default ProductPage;
