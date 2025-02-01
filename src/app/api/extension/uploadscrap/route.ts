import { deals_db } from "@/lib/db/db_connect";

import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log(body);

    // Construct the values part of the SQL query

    const values = body.payload
      .map((product: any) => {
        const title = product.title.replace(/"/g, "");
        return `("${title || null}", ${product.price || 0}, ${
          product.mrp || 0
        }, '${product.href}', '${product.productId || null}', '${
          body.user_email || null
        }','${body.store}','${body?.category || product?.category}','${
          product?.rating || 0.0
        }','${product?.subcategory || null}','${
          product?.supcategory || null
        }','${product?.vertical || null}')`;
      })
      .join(", ");

    const querry = sql.raw(`
    INSERT INTO rs_extension_scraps.products (name, price, mrp, url, id, username, store, category, rating, subcategory, supcategory,vertical)
    VALUES ${values}
`);

    await deals_db.execute(querry);
    return new Response("Scrap Data Uploaded", { status: 200 });
  } catch (error) {
    console.log(error);

    return new Response("Internal server error -> " + error, { status: 500 });
  }
}
