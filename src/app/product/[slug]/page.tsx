
import ProductPage from "@/components/product/ProductPage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};
// export async function generateStaticParams() {
//   const [products]: any = await deals_db.execute(sql`SELECT id FROM deals`);
  
//   return products.map((product: any) => ({
//     slug: product.id.toString()
//   }));
// }
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const slug = await params.slug;
  const [product]: any = await deals_db.execute(
    sql`SELECT brand, name, image FROM deals WHERE id = ${slug}`
  );

  if (!product[0]) {
    return {
      title: "Not Found !",
      description: "The page do not exist or invalid url. ",
    };
  }
  return {

    title: ` ${product[0]?.brand || slug[0]} ${product[0]?.name}  Price History and Exclusive Deals - Rupeespot`,
    description: `Explore ${product[0]?.brand || slug[0]} ${product[0]?.name || product[0]?.title} price history, discover deals, and make informed buying decisions.`,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph:{
      images:[
        {
          url:`${process.env.NEXTAUTH_URL}/api/og?title=${product[0]?.name}&src=${product[0]?.image}&brand=${product[0]?.brand}`,
          alt:"Deals Product"
        }
      ]
    }
  };
}
const page: React.FC<Props> = async props => {
  const params = await props.params;
  const slug = await params.slug;
  const [product]: any = await deals_db.execute(
    sql`SELECT * FROM deals WHERE id = ${slug}`
  );
  if(!product[0]){
    return notFound()
  }
  return (
    <MaxWidthWrapper>
      <ProductPage data={product[0]} id={slug}/>
    </MaxWidthWrapper>
  );
};
export default page;
