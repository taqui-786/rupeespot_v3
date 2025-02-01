import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
import React from "react";
import ProductCard from "./ProductCard";
type Props = {
  name?: any;
  listingFor: string;
 }
 const RecommendProduct:React.FC<Props> = async ({ name, listingFor }) => {


  const [data]: any = listingFor === 'recommend' ? await deals_db.execute(sql`SELECT * FROM deals WHERE category = ${name.category} AND id NOT LIKE ${name.id} LIMIT 5`) :await deals_db.execute(sql`SELECT * 
        FROM deals 
        ORDER BY last_updated DESC
        LIMIT 5`)


  return (
    <>
      {data.length ? (
        <div className="w-full md:px-3 py-5 mt-10">
          <h1 className="w-full text-xl sm:text-3xl font-bold text-start px-3 md:px-0">
            {listingFor === "recommend" ? "Similar Products" : "Latest Deals"}
          </h1>
          <div className="w-full  flex flex-row flex-wrap items-center justify-center gap-1  py-8 ">
            {data &&
              data.map((itm: any, indx: number) => {
                if (itm?.id === name?.name?.id) return;
                return <ProductCard item={itm} key={indx} />;
              })}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default RecommendProduct;
