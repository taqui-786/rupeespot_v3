import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/api/auth") ||
    req.nextUrl.pathname.startsWith("/api/og") ||
    req.nextUrl.pathname.startsWith("/api/user")
  ) {
    return NextResponse.next();
  }
  // Create a response object
  const res = NextResponse.next();

  // Add the CORS headers to the response for all requests
  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", "*"); // Replace with your actual origin
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: res.headers });
  }

  try {
    // Check for the API key in the request headers
    const apiKey = req.headers.get("x-api-key");
    const validApiKey = process.env.NEXT_PUBLIC_APP_API_KEY;

    if (!apiKey) {
      // Log missing API key
      //  console.error(`Missing API key. Headers: ${JSON.stringify(Object.fromEntries(req.headers))}`);

      // Return a 400 Bad Request response if the API key is missing
      console.error(`Unauthorized access attempt 400.`);
      return new NextResponse("Bad Request: Missing API Key", { status: 400 });
    }

    if (apiKey !== validApiKey) {
      // Log the unauthorized access attempt
      console.error(`Unauthorized access attempt.`);

      // Return a 403 Forbidden response if the API key is invalid
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Proceed with the request
    return res;
  } catch (error) {
    // Handle and log any unexpected errors
    console.error("Error in middleware:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: "/api/:path*",
};