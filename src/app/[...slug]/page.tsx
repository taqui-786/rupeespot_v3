import ProductPage from "@/components/product/ProductPage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import { deals_db, user_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const [getStore]: any = await user_db.execute(
    sql`SELECT db_name FROM stores WHERE name  = ${params.slug[0]} `
  );
  const querry =
    params.slug[0] === "deals"
      ? sql.raw(
          `SELECT  name , brand FROM deals WHERE id = '${params.slug[1]}' `
        )
      : sql.raw(
          `SELECT category,title FROM ${getStore[0]?.db_name}.products WHERE id = '${params.slug[1]}' `
        );
  const [product]: any = await deals_db.execute(sql`${querry}`);

  if (!product[0]) {
    return {
      title: "Not Found !",
      description: "The page do not exist or invalid url. ",
    };
  }
  return {
    title:
      product[0]?.brand ||
      params.slug[0] + " " +
      product[0]?.title || '' + "Price History and Exclusive Deals - Rupeespot",
    description: `Explore ${product[0]?.brand || params.slug[0]} ${
      product[0]?.name || product[0]?.title
    } price history, discover deals, and make informed buying decisions.`,
    alternates: {
      canonical: `/${params.slug[0]}/${params.slug[1]}`,
    },
    openGraph: {
      images: [
        {
          url: `${process.env.NEXTAUTH_URL}/api/og?title=${
            product[0]?.name || product[0]?.title
          }&src=${product[0]?.image}&brand=${
            product[0]?.brand || params.slug[0]
          }`,

          alt: "Custom Product",
        },
      ],
    },
  };
}
const page = async (props: Props) => {
  const params = await props.params;
  const [getStore]: any = await user_db.execute(
    sql`SELECT db_name FROM stores WHERE name  = ${params.slug[0]} `
  );
  const querry =
    params.slug[0] === "deals"
      ? sql.raw(`SELECT * FROM deals WHERE id = '${params.slug[1]}' `)
      : sql.raw(
          `SELECT * FROM ${getStore[0]?.db_name}.products WHERE id = '${params.slug[1]}' `
        );
  const [product]: any = await deals_db.execute(sql`${querry}`);
  if (!product[0]) {
    return notFound();
  }
  return (
    <MaxWidthWrapper>
      <ProductPage
        data={product[0]}
        id={params.slug[1]}
        store={params.slug[0]}
      />
    </MaxWidthWrapper>
  );
};
export default page;
