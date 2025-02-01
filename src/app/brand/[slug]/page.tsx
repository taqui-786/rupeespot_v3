import BrandPage from "@/components/brand/BrandPage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Metadata } from "next";


type Props = {
    params: Promise<{
      slug: string;
    }>;
  };
  export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    return{
      
      title: "Unbeatable Deals and Exclusive Offers - Rupeespot",
      description: "Unlock discounts of up to 90% off with our curated deals from leading retailers such as Amazon, Flipkart, Myntra, and more. Shop smart and save big with Rupeespot's exclusive discounts!",
      
      openGraph:{
        images: [
          {
            url: `${process.env.NEXTAUTH_URL}/api/og?title=${params.slug}&brand=Brand_Page`,
            
            alt: "Rupeespot.com",
          },
        ],
      }
    }
  };
  const page: React.FC<Props> = async props => {
    const params = await props.params;

    return (
      <MaxWidthWrapper>
        <BrandPage brand={params.slug}/>
      </MaxWidthWrapper>
    );
  };
  export default page;