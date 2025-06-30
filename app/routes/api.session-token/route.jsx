import { redirect } from "@remix-run/node";
import jwt from "jsonwebtoken";

export async function loader({ request }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header missing");

    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY);

    // Token válido: redirige a la app
    return redirect("/app");
  } catch (error) {
    console.error("Error verifying session token:", error.message);
    // Token inválido o error: redirige a login o error
    return redirect("/login?error=unauthorized");
  }
}

export function ErrorBoundary() {
  return <div>Error en la API session-token.</div>;
}
