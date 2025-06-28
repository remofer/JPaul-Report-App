import { redirect } from "@remix-run/node";
import jwt from "jsonwebtoken"; // Para decodificar o validar el token

export async function loader({ request }) {
  const url = new URL(request.url);
  const sessionToken = url.searchParams.get("session");

  if (!sessionToken) {
    return redirect("/error?message=session-token-missing"); // Redirige a una página de error si falta el token
  }

  try {
    // Decodifica el token (si es necesario)
    const decodedToken = jwt.decode(sessionToken);
    console.log("Decoded token:", decodedToken);

    // Aquí podrías agregar lógica adicional como guardar el token o verificar datos

    // Redirige a la página principal de tu app
    return redirect("/app");
  } catch (error) {
    console.error("Error procesando el token:", error);
    return redirect("/error?message=invalid-session-token");
  }
}

export default function SessionTokenHandler() {
  return null; // No necesitas devolver contenido ya que estás redirigiendo
}
