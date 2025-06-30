import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";

export async function loader({ request }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY);

    if (!decoded || !decoded.dest) {
      throw new Error("Invalid token payload");
    }

    return json({ success: true, data: decoded });
  } catch (error) {
    console.error("Error in session-token loader:", error.message);
    return json({ success: false, error: error.message }, { status: 400 });
  }
}

export function ErrorBoundary() {
  return <div>Error en la API de validación de tokens.</div>;
}
