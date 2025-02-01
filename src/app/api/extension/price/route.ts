import { deals_db, user_db } from "@/lib/db/db_connect";

import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const store = searchParams.get("store");
    const id = searchParams.get("id");
    const TheStore = store;
    // console.log("Payload is -> ", store , id);
    
    const [getStore]: any = await user_db.execute(
      sql`SELECT db_name FROM stores WHERE name  = ${TheStore} `
    );

    const priceQuerry = sql.raw(
      `SELECT * FROM ${getStore[0].db_name}.prices WHERE id='${id}'`
    );
    const [prices]: any = await deals_db.execute(sql`${priceQuerry}`);

    return Response.json({ message: prices }, { status: 200 });
  } catch (error) {
    console.log(error);

    return new Response("Internal server error", { status: 500 });
  }
}
