import { user_db } from "@/lib/db/db_connect";
import { sql } from "drizzle-orm";


export async function GET() {
    try {
        const [users] = await user_db.execute(sql`SELECT * FROM user `)
        return Response.json({message:users},{status:200})
    } catch (error) {
        return new Response("Internal Server Error ", { status: 500 });
    }
}