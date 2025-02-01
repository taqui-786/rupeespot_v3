import { user_db } from "@/lib/db/db_connect";
import { compileActivationTemplate, sendMail } from "@/lib/mail/mailConfiguration";
import { signJwt } from "@/lib/authentication/jwt";
import {  sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { firstname,lastname, email, password } = await req.json();
    if (!firstname || !lastname || !email || !password) {
      return new Response("Enter all the credentials !", { status: 400 });
    }
  await user_db.execute(sql`INSERT INTO user(firstname, lastname, email, password) VALUES (${firstname}, ${lastname},${email},${password})`);
    const [result]:any = await user_db.execute(
      sql`SELECT * FROM user WHERE email=${email}`
    );
    
    const jwtUserId =signJwt({
      id: result[0].id as string
    })
    const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`
    
    const fullname = `${firstname} ${lastname}`
    const body = compileActivationTemplate(fullname, activationUrl)
    await sendMail({to: email, subject:"Confirm Your Email" , body})
    return new Response("User Registered!", { status: 200 });
  } catch (error) {
    console.log(error);

    return new Response("Internal Server Error ", { status: 500 });
  }
}

