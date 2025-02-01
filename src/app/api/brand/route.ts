import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("val") as string;
    const sortBy = searchParams.get("sortBy")?.split(",")[0] || "all";
    const storeBrands = searchParams.get("brand")?.split(",") || ["all"];
    const discounts = searchParams.get("discount")?.split(",") || ["0"];
    const ratings = searchParams.get("rating")?.split(",") || ["all"];
    const vertical = searchParams.get("vertical") || "all";

    let conditions = [`brand = '${brand}'`];
    let orderBy = "last_updated DESC";

    // Store brands filter
    if (storeBrands[0] !== "all") {
      const brandList = storeBrands.map((b) => `'${b.trim()}'`).join(",");
      conditions.push(`store IN (${brandList})`);
    }

    // Discount filter
    if (discounts[0] !== "0") {
      const discountConditions = discounts
        .map((d) => `discount > ${d}`)
        .join(" OR ");
      conditions.push(`(${discountConditions})`);
    }

    // Rating filter
    if (ratings[0] !== "all") {
      const ratingConditions = ratings
        .map((r) => {
          if (r === "0.0" || r === "5.0") {
            return `rating = ${r}`;
          } else {
            return `rating > ${r}`;
          }
        })
        .join(" OR ");
      conditions.push(`(${ratingConditions})`);
    }

    // Category (vertical) filter
    if (vertical !== "all") {
      conditions.push(
        `LOWER(category) LIKE CONCAT('%', LOWER('${vertical}'), '%')`
      );
    }

    // Sorting
    if (sortBy !== "all") {
      orderBy = sortBy === "highTolow" ? "deal_price DESC" : "deal_price ASC";
    }

    const whereClause = conditions.join(" AND ");
    const query = sql.raw(`
      SELECT * FROM deals 
      WHERE ${whereClause}
      ORDER BY ${orderBy}
    `);

    const [products] = await deals_db.execute(query);

    return Response.json({ message: products }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
