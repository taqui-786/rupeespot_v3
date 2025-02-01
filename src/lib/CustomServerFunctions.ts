"use server";
import https from "https";

import { sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

import pThrottle from "p-throttle";
import { deals_db, user_db } from "./db/db_connect";
import { authOpitions } from "./authentication/AuthOptions";
import { sendMail } from "./mail/mailConfiguration";
import CartEmailTemplate from "./mail/dealsProductsEmailTemplate";
// FUNCTION TO EXTRECT PID OF FLIPKART LINK
function extractPidFromLink(link: any) {
  const url = new URL(link);
  const pid = url.searchParams.get("pid");
  return pid;
}

// FUNCTION TO EXTRACT ID FROM AMAZON LINK
function extractProductIdFromAmazonLink(link: any) {
  const url = new URL(link);
  const pathSegments = url.pathname.split("/");
  const pidIndex = pathSegments.indexOf("dp") + 1;
  if (pidIndex > 0 && pidIndex < pathSegments.length) {
    return pathSegments[pidIndex];
  } else {
    return null; // PID not found
  }
}
// FUNCTION TO EXTRACT ID FROM AJIO LINK
function extractIdFromAjioLink(link: any) {
  const url = new URL(link);
  const pathSegments = url.pathname.split("/");
  const idSegment = pathSegments.find((segment) => segment.includes("_"));
  if (idSegment) {
    return idSegment.split("_")[0];
  } else {
    return null; // ID not found
  }
}

// FUNCTION TO EXTRACT AFFILIATE LINK FROM SHORT DIRECT LINK
function extractAffiliateLink(deepLink: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const parsedUrl = new URL(deepLink);
    const options: https.RequestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    };

    const request = https.request(options, (response) => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        resolve(response.headers.location as string);
      } else {
        reject(new Error("Failed to extract affiliate link"));
      }
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.end();
  });
}
// FUNCTION TO EXTRACT id FROM URL
export async function extractProductId(url: string) {
  try {
    const parsedUrl = new URL(url);
    const extractStoreName = parsedUrl.hostname.replace(/^www\./, "");
    const storeName = extractStoreName.split(".");

    if (url.includes("www.flipkart")) {
      const pathnameParts = parsedUrl.pathname.split("/");
      const productIdIndex = pathnameParts.indexOf("p");
      const flipkartPid = extractPidFromLink(url);
      if (productIdIndex !== -1 && productIdIndex < pathnameParts.length - 1) {
        return [flipkartPid, "flipkart"];
      } else {
        return null;
      }
    } else if (url.includes("www.amazon.in")) {
      const amazonPid = extractProductIdFromAmazonLink(url);
      return [amazonPid, "amazon"];
    } else if (url.includes("www.ajio.com")) {
      const id = extractIdFromAjioLink(url);
      return [id, "ajio"];
    } else if (url.includes("dl.flipkart")) {
      const result = await extractAffiliateLink(url);
      const parsedUrl = new URL(result);
      const pathnameParts = parsedUrl.pathname.split("/");
      const productIdIndex = pathnameParts.indexOf("p");
      return [pathnameParts[productIdIndex + 1], "flipkart"];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

// FUNCTION TO CONVERT IMAGE TO FULL URL
export async function convertToFullImageUrl(
  halfImageUrl: string,
  store: string
) {
  try {
    const [getBaseUrl]: any = await user_db.execute(
      sql`SELECT img_base_url FROM stores WHERE name  = ${store} `
    );
    if (store === "amazon") {
      return `${getBaseUrl[0].img_base_url}/${halfImageUrl}`;
    } else if (store === "ajio") {
      return `${getBaseUrl[0].img_base_url}/${halfImageUrl}`;
    }

    return `${getBaseUrl[0].img_base_url}/image/${halfImageUrl}`;
  } catch (error) {
    // console.log(error);
    return null;
  }
}
// Function to get product title and description for meta data
export const getProductMetaData = async (store: string, productId: string) => {
  try {
    const [getStore]: any = await deals_db.execute(
      sql`SELECT db_name FROM stores WHERE name  = ${store} `
    );
    const querry =
      store === "deals"
        ? sql.raw(`SELECT store, name FROM deals WHERE id = '${productId}' `)
        : sql.raw(
            `SELECT category,title FROM ${getStore[0].db_name}.products WHERE item_id = '${productId}' `
          );
    const [product]: any = await deals_db.execute(sql`${querry}`);
    return product[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getProductPrices = async (id: string, store: string) => {
  try {
    const [getStore]: any = await deals_db.execute(
      sql`SELECT db_name FROM stores WHERE name  = ${store} `
    );
    const priceQuerry = sql.raw(
      `SELECT * FROM ${getStore[0].db_name}.prices WHERE id='${id}'`
    );
    const [prices]: any = await deals_db.execute(sql`${priceQuerry}`);
    return prices;
  } catch (error) {
    return null;
  }
};
// FUNCTION TO EXTRACT ALL STORES NAMES
export const getCheckboxOpitions = async () => {
  try {
    const store: any = [];
    const category: any = [];
    const [storeData]: any = await deals_db.execute(sql`SELECT DISTINCT store
    FROM deals`);
    const [categoryData]: any =
      await deals_db.execute(sql`SELECT DISTINCT category
    FROM deals`);
    store.unshift({ id: "all", label: "All" });
    category.unshift({ id: "all", label: "All" });
    storeData.map((itm: any) => {
      store.push({
        id: itm.store,
        label: itm.store,
      });
    });
    categoryData.map((itm: any) => {
      category.push({
        id: itm.category,
        label: itm.category,
      });
    });
    return { store, category };
  } catch (error) {
    return null;
  }
};

// PRice Tracking Notification ***********************************************************************
function isOlderThanOneMinute(timestamp: string): boolean {
  const givenTime = new Date(timestamp).getTime(); // Convert to milliseconds
  const currentTime = new Date().getTime(); // Get current time in milliseconds
  const oneMinuteInMs = 60 * 1000; // 1 minute in milliseconds

  return currentTime - givenTime > oneMinuteInMs;
}
const updateTrackingList = async ({
  trackingId,
  lastPrice,
}: {
  trackingId: string;
  lastPrice: number;
}) => {
  try {
    const [setNotificationData] = await user_db.execute(sql`UPDATE mytracking
SET last_notification_sent = NOW(), 
    last_notification_price = ${lastPrice}
WHERE id = ${trackingId}`);
    setNotificationData.insertId &&
      console.log("Notification updated successfully");
    return true;
  } catch (error) {
    return error;
  }
};
// Check if price has gone up or down

const checkPriceChange = async (
  productId: string,
  store: string,
  myPrice: number,
  priceTimestamp: any,
  trackingId: string,
  lastPrice: number
) => {
  try {
    // console.log(productId, store, myPrice, priceTimestamp);

    const TheStore = store;
    if (TheStore === null) return false;
    const [getStore]: any = await user_db.execute(
      sql`SELECT db_name FROM stores WHERE name  = ${TheStore} `
    );

    const priceQuerry = sql.raw(
      `SELECT price,last_updated FROM ${getStore[0].db_name}.prices WHERE id='${productId}'`
    );
    const [prices]: any = await deals_db.execute(sql`${priceQuerry}`);
    if (prices?.length === 0) return false;
    const sortedProducts = prices.sort((a: any, b: any) => {
      // Convert the date strings into valid Date objects and compare their timestamps
      return Date.parse(b.last_updated) - Date.parse(a.last_updated);
    });
    if (sortedProducts?.[0]?.price === lastPrice) return false;

    if (sortedProducts?.[0].price < myPrice) {
      updateTrackingList({ trackingId, lastPrice: sortedProducts?.[0].price });
      return sortedProducts?.[0].price;
    }
    return false;
  } catch (error) {
    return error;
  }
};
// Get myTracking prics

// Get myTracking prices and handle email notifications

export const sendTestEmail = async () => {
  try {
    const authUserData = await getServerSession(authOpitions);
    if (!authUserData?.user) return;
    const sendResult = await sendMail({
      to: authUserData?.user?.email as string,
      subject: "Testing Email - Rupeespot",
      body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RupeeSpot Test Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 300px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
        }
        h1 {
            color: #7c3aed;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupeespot_logo_email-C6ry5v3bgOsmzqUExgabYvr4Q6Dge2.png" alt="RupeeSpot Logo">
    </div>
    <div class="content">
        <h1>This is just a testing Email</h1>
        <p>Hello,</p>
        <p>This email is sent to confirm that our RupeeSpot email template is working correctly.</p>
        <p>If you received this email, it means our system is functioning as expected.</p>
        <p>Thank you for your attention to this test.</p>
        <p>Best regards,<br>The RupeeSpot Team</p>
    </div>
</body>
</html>`,
    });
    return sendResult;
  } catch (error) {
    return error;
  }
};

// New func
// Throttle to prevent overloading external services (adjust rate limit and interval as necessary)
const throttle = pThrottle({
  limit: 10, // 10 requests at a time
  interval: 1000, // per second
});
export const getTrackingProductAndNotify = async () => {
  // console.log("Started ---------------------------");
  try {
    // Step 1: Fetch all users and their tracked products in a single query
    const [userProductData]: any = await user_db.execute(sql`
      SELECT 
        u.id AS userId, 
        u.email, 
        u.firstname, 
        u.lastname,
        mt.id AS trackingId,
        mt.productId, 
        mt.productName, 
        mt.productImg, 
        mt.productPrice, 
        mt.store, 
        mt.createdAt, 
        mt.last_notification_sent, 
        mt.last_notification_price,
        mt.custom_price
      FROM rupeespot.user u
      JOIN mytracking mt ON u.id = mt.userId
    `);

    if (userProductData.length === 0) {
      console.log("No users with tracked products.");
      return;
    }

    // Step 2: Organize data by users
    const usersMap = new Map();
    for (const row of userProductData) {
      if (!usersMap.has(row.userId)) {
        usersMap.set(row.userId, {
          email: row.email,
          firstname: row.firstname,
          products: [],
        });
      }
      usersMap.get(row.userId).products.push(row);
    }

    // Step 3: Process each user in batches to avoid overloading
    const batchSize = 50;
    const userList = Array.from(usersMap.values());

    for (let i = 0; i < userList.length; i += batchSize) {
      const batch = userList.slice(i, i + batchSize);

      // Process each batch in parallel
      await Promise.all(
        batch.map(async (user: any) => {
          const productsToNotify: Array<any> = [];

          // Step 4: Process each product for the user in parallel
          await Promise.all(
            user.products.map(async (product: any) => {
              // Skip if the notification was sent recently
              if (!isOlderThanOneMinute(product.last_notification_sent)) {
                return;
              }

              // Throttled check for price change to prevent overload
              const priceStatus = await throttle(checkPriceChange)(
                product.productId,
                product.store,
                product.custom_price !== null
                  ? product.custom_price
                  : product.productPrice,
                new Date(product.createdAt),
                product.trackingId,
                product.last_notification_price
              );

              if (priceStatus !== false) {
                productsToNotify.push({
                  name: product.productName,
                  image: product.productImg,
                  originalPrice:
                    product.custom_price !== null
                      ? product.custom_price
                      : product.productPrice,
                  discountPrice: priceStatus,
                  realPrice: product.productPrice,
                  targetPrice: product?.custom_price,
                });

                // Update the last notification sent time in the database
                await user_db.execute(sql`
                  UPDATE mytracking 
                  SET last_notification_sent = NOW(), last_notification_price = ${priceStatus}
                  WHERE id = ${product.trackingId}
                `);
              }
            })
          );

          // Step 5: Send notification if there are products to notify
          if (productsToNotify.length > 0) {
            await sendMail({
              to: user.email,
              subject:
                "Price Drop Alert: Multiple Items Have Reached Your Target Prices!",
              body: CartEmailTemplate({
                name: user.firstname || "Customer",
                products: productsToNotify,
              }),
            });
            // console.log(`Email sent successfully to ${user.email}`);
          } else {
            // console.log(`No price drops for user ${user.email}.`);
          }
        })
      );
    }
  } catch (error) {
    console.error("Error in testTracking:", error);
  } finally {
    // console.log(" --------------------------- Closed");
  }
};
