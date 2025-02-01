import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
export const dynamic = "force-dynamic";
function generateQuery(stores:any) {
    const storeQueries = stores.map((store:any) => {
      return `(SELECT * FROM deals WHERE store = '${store.name}' ORDER BY last_updated DESC LIMIT 5)`;
    }).join(' UNION ALL ').replace(/\'/g, "'");
  
    return sql.raw(`SELECT * FROM (${storeQueries}) AS combined_deals ORDER BY last_updated DESC`);
  }

export async function GET() {
    try {
        const [stores] = await deals_db.execute(sql`SELECT * FROM rupeespot.stores`)
        const CreateQuerry = generateQuery(stores); 
        
        const [fetchDeals]: any = await deals_db.execute(sql`${CreateQuerry}`);
        
        
        return  Response.json({message: fetchDeals},{ status: 200 })
    } catch (error) {
        console.log(error);
        
        return new  Response("Internal server error" , {status: 500})
    }
}