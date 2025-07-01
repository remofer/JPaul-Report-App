import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";

export const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY);
    console.log('Decoded Token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Invalid Token:', error);
    throw new Error('Invalid session token');
  }
};

export async function loader({ request }) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    console.error("Authorization header is missing");
    return json(
      { success: false, error: "Authorization header missing" },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY);

    console.log("Decoded token:", decoded);

    if (!decoded || !decoded.dest) {
      throw new Error("Invalid token");
    }

    return json({ success: true, data: decoded });
  } catch (error) {
    console.error("Token validation error:", error.message);
    return json({ success: false, error: error.message }, { status: 401 });
  }
}

export function ErrorBoundary() {
  return <div>Error in token validation API.</div>;
}
