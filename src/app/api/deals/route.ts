import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const param = searchParams.get("items");
    const param2 = searchParams.get("page");
    const sortBy: any = searchParams.get("sortBy");
    const brand: any = searchParams.get("brand");
    const discount: any = searchParams.get("discount");
    const rating: any = searchParams.get("rating");
    const vertical: any = searchParams.get("vertical");

    const limit = parseInt(param!);
    const page = parseInt(param2!);

    const offset = (page - 1) * limit;
    if (sortBy || brand || discount) {
      let conditionalBrand = "";
      let conditionalSortby = "";
      let thresholdRating = "";
      let conditionalCategory = "";
      const brandArray = brand
        .split(",")
        .map((brand: any) => `'${brand.trim()}'`);
      const resultBrand = brandArray.join(",");
      const thresholdsString = discount

        .split(",")
        .map((threshold: any) => `discount > ${threshold}`)
        .join(" OR ");
      if (rating === "0.0") {
        thresholdRating = rating
          .split(",")
          .map((threshold: any) => `rating = ${threshold} AND`)
          .join(" OR ");
      } else if (rating === "5.0") {
        thresholdRating = rating
          .split(",")
          .map((threshold: any) => `rating = ${threshold} AND`)
          .join(" OR ");
      } else if (rating === "all") {
        thresholdRating = "rating != 6.0 AND";
      } else {
        thresholdRating = rating
          .split(",")
          .map((threshold: any) => `rating > ${threshold} AND`)
          .join(" OR ");
      }

      if (brand !== "all") {
        conditionalBrand = `AND store IN (${resultBrand})`;
      } else {
        conditionalBrand = "";
      }
      if(vertical !== 'all') {
        conditionalCategory = `AND LOWER(category) LIKE CONCAT('%', LOWER('${vertical}'), '%')`
      }else{
        conditionalCategory = ''
      }
      if (sortBy !== "all") {
        if (sortBy === "highTolow") {
          conditionalSortby = `ORDER BY deal_price DESC`;
        } else {
          conditionalSortby = `ORDER BY deal_price ASC`;
        }
      } else {
        conditionalSortby = `ORDER BY last_updated DESC`;
      }
      console.log(thresholdRating);

      const querry = sql.raw(`SELECT * 
        FROM deals WHERE   ${thresholdRating} ${thresholdsString}  ${conditionalBrand} ${conditionalCategory} ${conditionalSortby}
        
        LIMIT 25 OFFSET ${offset}`);
        
        

      const [fetchDeals] = await deals_db.execute(sql`${querry}`);

      return Response.json({ message: fetchDeals }, { status: 201 });
    }
    const [fetchDeals] = await deals_db.execute(sql`SELECT * 
        FROM deals 
        ORDER BY last_updated DESC
        LIMIT ${limit} OFFSET ${offset}`);

    return Response.json({ message: fetchDeals }, { status: 200 });
  } catch (error) {
    console.log(error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
