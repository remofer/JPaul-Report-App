import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";

export async function loader({ request }) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return json({ success: false, error: "Authorization header missing" }, { status: 401 });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY);

    return json({ success: true, data: decoded });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 401 });
  }
}

export function ErrorBoundary() {
  return <div>Error en la API session-token.</div>;
}
