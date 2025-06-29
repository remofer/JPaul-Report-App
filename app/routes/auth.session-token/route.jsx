import { json } from "@remix-run/node"; // Para respuestas backend
import { useLoaderData } from "@remix-run/react"; // Para acceder a datos en frontend
import { decodeSessionToken } from "@shopify/shopify-api"; // Shopify Node API para decodificar tokens
import createApp from "@shopify/app-bridge"; // Shopify App Bridge para frontend
import { getSessionToken } from "@shopify/app-bridge/utilities"; // Utilidad para obtener session tokens
import React, { useEffect } from "react";

// Backend: Verificar session token
export const loader = async ({ request }) => {
  try {
    // Obtén el token desde el encabezado Authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const sessionToken = authHeader.replace("Bearer ", "");
    console.log("Session Token recibido:", sessionToken);

    // Decodifica y valida el token
    const decodedToken = decodeSessionToken(sessionToken, process.env.SHOPIFY_API_SECRET_KEY);

    return json({ success: true, data: decodedToken });
  } catch (error) {
    console.error("Error al validar el session token:", error.message);

    return json({ success: false, error: error.message }, { status: 401 });
  }
};

// Frontend: Componente para manejar session tokens
export default function SessionTokenRoute() {
  const data = useLoaderData();

  useEffect(() => {
    async function fetchSessionToken() {
      try {
        // Inicializa App Bridge
        const app = createApp({
          apiKey: window.ENV.SHOPIFY_API_KEY, // Pasada desde el loader
          host: new URLSearchParams(window.location.search).get("host"), // Obtén el host de la URL
        });

        // Obtén el session token
        const sessionToken = await getSessionToken(app);
        console.log("Session Token obtenido:", sessionToken);

        // Envía el token al backend
        const response = await fetch("/auth/session-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`, // Envío del token en el encabezado
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener datos del backend: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Respuesta del backend:", data);
      } catch (error) {
        console.error("Error al obtener o enviar el session token:", error);
      }
    }

    fetchSessionToken();
  }, []);

  return (
    <div>
      <h1>Session Token Route</h1>
      <p>Esta ruta valida el session token.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}


// import { redirect } from "@remix-run/node";
// import jwt from "jsonwebtoken";

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const sessionToken = url.searchParams.get("session");

//   if (!sessionToken) {
//     return redirect("/auth/login");
//   }

//   try {
//     const decodedToken = jwt.decode(sessionToken);

//     // Valida datos del token (opcional)
//     if (!decodedToken || !decodedToken.shop) {
//       return redirect("/auth/login");
//     }

//     console.log("Token válido:", decodedToken);

//     return redirect("/app");
//   } catch (error) {
//     console.error("Error procesando token:", error);
//     return redirect("/auth/login");
//   }
// }
