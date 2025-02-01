import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
import { MetadataRoute } from "next";

export async function generateSitemaps() {
  const [products]: any = await deals_db.execute(
    sql`SELECT  COUNT(*) AS count_latest FROM deals `
  );
  const result = [];

  let pages = 0
  for (let index = 0; index < products[0].count_latest; index = index + 50000) {
      const obj = { id: pages };
      result.push(obj);
      pages++
  }

  return result;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap

  const start = id * 50000;
  const end = start + 50000;
  const [products]: any = await deals_db.execute(
    sql`SELECT id,sn, last_updated FROM deals WHERE sn BETWEEN ${start} AND ${end}`
  );

  return products.map((product: any) => ({
    url: `https://rupeespot.com/product/${product?.id}`,
    lastModified: product.last_updated,
  }));
}
