import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET (req:Request){
    try {
        const { searchParams } = new URL(req.url);
        const param = searchParams.get("items");
        const param2 = searchParams.get("page");
        const param3 = searchParams.get("match");
        
        const limit = parseInt(param!);
        const page = parseInt(param2!);
    
          const offset = (page - 1) * limit;
          const [fetchDeals]:any = await deals_db.execute(sql`SELECT *, MATCH(name)AGAINST(${param3}) as score
          FROM deals WHERE MATCH(name)AGAINST(${param3}) > 0
          ORDER BY score DESC
          LIMIT ${limit} OFFSET ${offset}`)
      
          return Response.json({ message: fetchDeals }, { status: 200 });
    } catch (error) {
        console.log(error);

        return new Response("Internal Server Error", { status: 500 });    }
}