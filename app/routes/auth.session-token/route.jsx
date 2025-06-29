import { json } from "@remix-run/node"; // Backend responses
import { useLoaderData } from "@remix-run/react"; // Frontend data access
import jwt from "jsonwebtoken"; // Para decodificar/verificar JWT en backend
import createApp from "@shopify/app-bridge"; // Shopify App Bridge para frontend
import { getSessionToken } from "@shopify/app-bridge/utilities"; // Obtener session tokens
import React, { useEffect, useState } from "react";

// Backend: Verificar session token
export const loader = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header missing");

    const sessionToken = authHeader.replace("Bearer ", "");
    console.log("Session Token recibido:", sessionToken);

    // Decodifica y verifica el token con jsonwebtoken
    const decodedToken = jwt.verify(sessionToken, process.env.SHOPIFY_API_SECRET_KEY);

    return json({ success: true, data: decodedToken, apiKey: process.env.SHOPIFY_API_KEY });
  } catch (error) {
    console.error("Error al validar el session token:", error.message);
    return json({ success: false, error: error.message }, { status: 401 });
  }
};

// Frontend: Componente para manejar session tokens
export default function SessionTokenRoute() {
  const { apiKey, ...data } = useLoaderData();
  const [sessionToken, setSessionToken] = useState(null);
  const [backendResponse, setBackendResponse] = useState(null);

  useEffect(() => {
    async function fetchSessionToken() {
      try {
        // Aseguramos que window exista (estamos en cliente)
        if (!apiKey || typeof window === "undefined") return;

        const app = createApp({
          apiKey,
          host: new URLSearchParams(window.location.search).get("host"),
        });

        const token = await getSessionToken(app);
        setSessionToken(token);
        console.log("Session Token obtenido:", token);

        const response = await fetch("/auth/session-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener datos del backend: ${response.statusText}`);
        }

        const responseData = await response.json();
        setBackendResponse(responseData);
        console.log("Respuesta del backend:", responseData);
      } catch (error) {
        console.error("Error al obtener o enviar el session token:", error);
      }
    }

    fetchSessionToken();
  }, [apiKey]);

  return (
    <div>
      <h1>Session Token Route</h1>
      <p>Esta ruta valida el session token.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      {sessionToken && (
        <>
          <h2>Session Token obtenido:</h2>
          <pre>{sessionToken}</pre>
        </>
      )}

      {backendResponse && (
        <>
          <h2>Respuesta del backend:</h2>
          <pre>{JSON.stringify(backendResponse, null, 2)}</pre>
        </>
      )}
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
