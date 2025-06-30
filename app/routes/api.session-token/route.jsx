// import { redirect } from "@remix-run/node";
// import jwt from "jsonwebtoken";

// export async function loader({ request }) {
//   try {
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader) throw new Error("Authorization header missing");

//     const token = authHeader.replace("Bearer ", "");
//     jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY);

//     // Token válido: redirige a la app
//     return redirect("/app");
//   } catch (error) {
//     console.error("Error verifying session token:", error.message);
//     // Token inválido o error: redirige a login o error
//     return redirect("/auth/login");
//   }
// }

// export function ErrorBoundary() {
//   return <div>Error en la API session-token.</div>;
// }
import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";

export async function loader({ request }) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return json({ success: false, error: "Authorization header missing" }, { status: 401 });
  }

  const secretKey = process.env.SHOPIFY_API_SECRET_KEY;
  if (!secretKey) {
    console.error("SHOPIFY_API_SECRET_KEY no está definido.");
    return json({ success: false, error: "Server configuration error" }, { status: 500 });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, secretKey);

    return json({ success: true, data: decoded });
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return json({ success: false, error: error.message }, { status: 401 });
  }
}

export function ErrorBoundary() {
  return <div>Error en la API session-token.</div>;
}
