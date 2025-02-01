import { deals_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 1000;

const generateSitemapLink = (url: string) =>
  `<sitemap><loc>${url}</loc></sitemap>`;
  
export async function GET() {
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
  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${result.map((itm) => {
        return generateSitemapLink(`https://rupeespot.com/deals/sitemap.xml/${itm.id}`)
       })}
    </sitemapindex>`;

  return new Response(sitemapIndexXML, {
    headers: { 'Content-Type': 'text/xml' },
  });
}