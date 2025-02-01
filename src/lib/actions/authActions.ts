"use server";

import { sql } from "drizzle-orm";
import { deals_db, user_db } from "../db/db_connect";
import { userResponseType } from "../authentication/authTypes";
import { signJwt, verifyJwt } from "../authentication/jwt";
import { compileResetTemplate, sendMail } from "../mail/mailConfiguration";
import bcrypt from "bcryptjs";
import { authOpitions } from "../authentication/AuthOptions";
import { getServerSession } from "next-auth";

// FUNCTION TO FIND USER WITH EMAIL
export const getUserByEmail = async (email: string) => {
  try {
    const [rows]: any = await user_db.execute(
      sql`SELECT * FROM user WHERE email=${email}`
    );
    const result = rows?.[0];

    if (result) {
      const user:userResponseType = result;
      return user;
    }
    return null;
  } catch {
    return null;
  }
};
// Function To Update user as isVerified  to User after Sign-up
type ActivateUserFunction = (
  jwtUserId: string
) => Promise<"NoUserExists" | "alreadyActivated" | "Success">;
export const activateUser: ActivateUserFunction = async (jwtUserId) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;

  const [currentUser]: any = await user_db.execute(
    sql`SELECT * FROM user WHERE id=${userId}`
  );
  if (!currentUser[0]) return "NoUserExists";
  if (currentUser[0]?.isVerified === 1) return "alreadyActivated";
 
  await user_db.execute(sql`UPDATE user SET isVerified = 1 WHERE id=${userId}`);
  return "Success";
};
// function to Find user and send Forgot Password Link  Emial
export async function forgotPassword(email: string) {
  const [myUser]: any = await user_db.execute(
    sql`SELECT * FROM user WHERE email=${email}`
  );
  if (!myUser[0]) throw new Error("No User Exists with this email!");
  const jwtUserId = signJwt({
    id: myUser[0].id,
  });
  const resetPasswordUrl = `${process.env.NEXTAUTH_URL}/auth/resetpassword/${jwtUserId}`;
  const fullname = `${myUser[0].firstname} ${myUser[0].lastname} `;
  const body = compileResetTemplate(fullname, resetPasswordUrl);
  const sendResult = await sendMail({
    to: myUser[0].email,
    subject: "Reset Your Password",
    body,
  });
  return sendResult;
}
// Function to Change User Password
type ResetPasswordFunc = (
  jwtUserId: string,
  password: string
) => Promise<"UserNotExist" | "success">;

export const resetPassword: ResetPasswordFunc = async (jwtUserId, password) => {
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "UserNotExist";
  const userId = payload.id;
  const [myUser]: any = await user_db.execute(
    sql`SELECT * FROM user WHERE id=${userId}`
  );
  if (!myUser[0]) return "UserNotExist";


  const [result]: any = await user_db.execute(sql`UPDATE user SET password = ${await bcrypt.hash(
    password,
    10
  )} WHERE id=${userId}`);
  console.log(result);
  
  if (result) return "success";
  else throw new Error("something went wrong");
};


// REMOVE PRODUCT FROM TRACKING LIST
export const removeFromTrackingList = async (productId: any) => {
  try {
    const authUserData = await getServerSession(authOpitions);
    if (!authUserData?.user) return "unautorized";
    if (!productId) return;
    const [itsMe]: any = await user_db.execute(
      sql`SELECT * FROM user WHERE email = ${authUserData.user.email}`
    );
    await user_db.execute(
      sql`DELETE FROM mytracking WHERE productId =${productId} AND userId = ${itsMe[0].id}`
    );
    return "deletedProduct";
  } catch (error) {
    console.log(error);
  }
};
type addTomyTrackingListProps = {
  product:any,
  isCustomPrice?:boolean,
  customPrice?:number | null
}
// Function to add product to user tracking list
export const addTomyTrackingList = async ({product,isCustomPrice,customPrice}:addTomyTrackingListProps) => {
  try {
    const authUserData = await getServerSession(authOpitions);
    if (!authUserData?.user) return "unautorized";
    const { id, name, price, image, url, track_by, track_value, store } = product;
    const [itsMe]: any = await user_db.execute(
      sql`SELECT * FROM user WHERE email = ${authUserData.user.email}`
    );
    
    if(isCustomPrice ){
      await user_db.execute(sql`INSERT INTO mytracking(userId, productId, productImg, productName, productPrice, productUrl, track_by, track_value, store, custom_price) VALUES (${itsMe[0].id},${id},${image},${name},${price},${url}, ${track_by}, ${track_value}, ${store || null}, ${customPrice})`);
      return "ProductAdded";
      
    }
    await user_db.execute(sql`INSERT INTO mytracking(userId, productId, productImg, productName, productPrice, productUrl, track_by, track_value, store) VALUES (${itsMe[0].id},${id},${image},${name},${price},${url}, ${track_by}, ${track_value}, ${store || null})`);
    return "ProductAdded";
  } catch (error) {
    console.log(error);
  }
};
// FUNCTION TO FIND THAT IS PRODUCT IN THE TRACKING LIST
export const checkProductinMyList = async (myId: any) => {
  try {
    const authUserData = await getServerSession(authOpitions);
    if (!authUserData?.user) return "unautorized";
    if (!myId) return "noIdProvided";
    
    const [itsMe]: any = await user_db.execute(
      sql`SELECT * FROM user WHERE email = ${authUserData.user.email}`
    );
    const userId = itsMe[0].id;
    const [result]: any = await user_db.execute(sql`SELECT *
    FROM mytracking
    WHERE productId = ${myId} AND userId = ${userId}`);
    if (result[0]) return true;
    return false;
  } catch (error) {
    console.log(error);
  }
};

// Function to Fetch MyTracking Products
export const MyTrackingProducts = async () => {
  try {
    const authUserData = await getServerSession(authOpitions);
    if (!authUserData?.user) return;
    const [itsMe]: any = await user_db.execute(
      sql`SELECT * FROM user WHERE email = ${authUserData.user.email}`
    );
    // @ts-ignore
    const [products] = await user_db.execute(sql`SELECT * FROM mytracking WHERE userId = ${itsMe[0].id}`)
    return products;
  } catch (error) {
    console.log(error);
  }
};

// Fucntion to fetch custom rating & regular price for StoreProduct component - Taqui
export const fetchCustomRating = async (store:string, productId:string) => {
  try {
    const [getStore]: any = await user_db.execute(
      sql`SELECT db_name FROM stores WHERE name  = ${store} `
    );
    const querry =  sql.raw(
      `SELECT * FROM ${getStore[0]?.db_name}.prices WHERE id = '${productId}' `
    )
    const [product]: any = await deals_db.execute(sql`${querry}`)
if (product.length === 0) {
  return null;
}
const reg_price_querry = sql.raw(
  `SELECT * FROM ${getStore[0]?.db_name}.regular_prices WHERE id='${productId}'`
);
const [get_req_price]:any = await deals_db.execute(sql`${reg_price_querry}`) 
const latestDate =  product.reduce((latest:any, current:any) => {
  const latestDate = new Date(latest.last_updated);
  const currentDate = new Date(current.last_updated);
  return currentDate > latestDate ? current : latest;
});
return {product:latestDate, reg_price: get_req_price?.[0].regular_price} as any
  } catch (error) {
    return error
  }
}