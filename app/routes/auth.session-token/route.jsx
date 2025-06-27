import { redirect } from "@remix-run/node";
import jwt from "jsonwebtoken";

export async function loader({ request }) {
  const url = new URL(request.url);
  const sessionToken = url.searchParams.get("session");

  if (!sessionToken) {
    return redirect("/auth/login");
  }

  try {
    const decodedToken = jwt.decode(sessionToken);

    // Valida datos del token (opcional)
    if (!decodedToken || !decodedToken.shop) {
      return redirect("/auth/login");
    }

    console.log("Token válido:", decodedToken);

    return redirect("/app");
  } catch (error) {
    console.error("Error procesando token:", error);
    return redirect("/auth/login");
  }
}
