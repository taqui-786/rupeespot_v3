import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timestamp = searchParams.get("timestamp");
  

    const [fetchDeals]: any = await deals_db.execute(
      sql`SELECT COUNT(*) AS count_latest FROM deals WHERE last_updated > ${timestamp}`
    );
    
    if (fetchDeals.length === 0) {
      return Response.json("No latest Deals to fetch", { status: 201 });
    }
    return Response.json({ message: fetchDeals }, { status: 200 });
  } catch (error) {
    console.log(error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
