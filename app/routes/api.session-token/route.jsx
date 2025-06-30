import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";

export async function loader({ request }) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    console.error("Authorization header missing");
    return json(
      { success: false, error: "Authorization header missing" },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY);

    // Log detallado del token decodificado
    console.log("Decoded token:", decoded);

    // Validar datos necesarios del token
    if (!decoded || !decoded.dest) {
      console.error("Invalid token: Missing 'dest'");
      throw new Error("Invalid token");
    }

    return json({ success: true, data: decoded });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return json({ success: false, error: error.message }, { status: 401 });
  }
}

export function ErrorBoundary() {
  return <div>Error en la API de validación de tokens.</div>;
}
