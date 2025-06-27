import { json } from "@remix-run/node";
import jwt from "jsonwebtoken"; // Usar librería para decodificar el token

export async function loader({ request }) {
  const url = new URL(request.url);
  const sessionToken = url.searchParams.get("session");

  if (!sessionToken) {
    return json({ error: "Session token missing" }, { status: 400 });
  }

  try {
    // Decodifica el token para validarlo (opcional)
    const decodedToken = jwt.decode(sessionToken);
    console.log("Decoded token:", decodedToken);

    // Aquí podrías guardar datos o validarlos según sea necesario
    return json({ success: true });
  } catch (error) {
    return json({ error: "Invalid session token" }, { status: 400 });
  }
}

export default function SessionTokenHandler() {
  return <div>Processing session token...</div>;
}
