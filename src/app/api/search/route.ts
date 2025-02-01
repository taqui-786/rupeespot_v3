import { sql } from "drizzle-orm";

import * as db from "@/lib/db/db_connect";
import { extractProductId } from "@/lib/CustomServerFunctions";
import { getServerSession } from "next-auth";
import { authOpitions } from "@/lib/authentication/AuthOptions";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    var data = searchParams.get("value");

    if (data) {
      if (data.includes("https")) {
        const trimmedUrl: any = await extractProductId(data);
        const storeName = `rs_${trimmedUrl[1]}`;
        const querry = sql.raw(
          `SELECT id,item_id,image,brand,category,title,mrp,last_updated FROM ${storeName}.products WHERE id = '${trimmedUrl[0]}'`
        );
        const [product] = await db.deals_db.execute(querry);
        
        return Response.json(
          { message: product, store: trimmedUrl[1] },
          { status: 201 }
        );
      }

      const [product]: any = await db.deals_db.execute(
        sql`SELECT *, MATCH(name)AGAINST(${data}) as score
        FROM deals WHERE MATCH(name)AGAINST(${data}) > 0
        ORDER BY score DESC LIMIT 5 `
      );

      if (product.length > 0) {
        const [isKeywordExist]: any = await db.user_db.execute(
          sql`SELECT keyword FROM search WHERE keyword = ${data}`
        );
        if (isKeywordExist.length === 0) {
          const authUserData = await getServerSession(authOpitions);
          // @ts-ignore
          const userId = authUserData?.user ? authUserData.user?.id : "";
          await db.user_db.execute(
            sql`INSERT INTO search (userid, keyword) VALUES (${userId}, ${data})`
          );
        }
        return Response.json({ message: product }, { status: 200 });
      } else {
        return Response.json({ message: "not found" }, { status: 404 });
      }
    } else {
      return new Response("Empty credentials", { status: 301 });
    }
  } catch (error:any) {
    console.log(error);
    
    return new Response(error, { status: 500 });
  }
}
