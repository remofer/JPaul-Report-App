// app/routes/auth.session-token.jsx

import { json } from "@remix-run/node";
import jwt from "jsonwebtoken"; // Decodifica y valida el token

export async function loader({ request }) {
  const url = new URL(request.url);
  const sessionToken = url.searchParams.get("session");

  if (!sessionToken) {
    return json({ error: "Session token missing" }, { status: 400 });
  }

  try {
    // Decodificar el token sin validación (opcional)
    const decodedToken = jwt.decode(sessionToken);

    // Validar el token (opcional, si tienes la clave secreta de Shopify)
    // const decodedToken = jwt.verify(sessionToken, "YOUR_SECRET_KEY");

    console.log("Decoded token:", decodedToken);

    // Realizar más validaciones o acciones según sea necesario
    return json({ success: true, token: decodedToken });
  } catch (error) {
    console.error("Token error:", error);
    return json({ error: "Invalid session token" }, { status: 400 });
  }
}

export default function SessionTokenHandler() {
  return <div>Processing session token...</div>;
}
