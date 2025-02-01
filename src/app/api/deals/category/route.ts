import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const product = await deals_db.execute(sql`SELECT DISTINCT category, brand 
    FROM deals`);
    
    return Response.json({ message: product[0] }, { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
