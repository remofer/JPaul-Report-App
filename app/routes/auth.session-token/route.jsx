import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import jwt from "jsonwebtoken";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import React, { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header missing");

    const sessionToken = authHeader.replace("Bearer ", "");
    const decodedToken = jwt.verify(sessionToken, process.env.SHOPIFY_API_SECRET_KEY);

    return json({ success: true, data: decodedToken, apiKey: process.env.SHOPIFY_API_KEY });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 401 });
  }
};

export default function SessionTokenRoute() {
  const { apiKey, ...data } = useLoaderData();
  const [sessionToken, setSessionToken] = useState(null);
  const [backendResponse, setBackendResponse] = useState(null);

  useEffect(() => {
    if (!apiKey) return;

    async function fetchToken() {
      try {
        // Aquí sí podemos usar window porque estamos en cliente
        const host = new URLSearchParams(window.location.search).get("host");

        const app = createApp({ apiKey, host });
        const token = await getSessionToken(app);
        setSessionToken(token);

        const response = await fetch("/auth/session-token", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(response.statusText);

        const json = await response.json();
        setBackendResponse(json);
      } catch (error) {
        console.error(error);
      }
    }

    fetchToken();
  }, [apiKey]);

  return (
    <div>
      <h1>Session Token Route</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      {sessionToken && (
        <>
          <h2>Session Token obtenido</h2>
          <pre>{sessionToken}</pre>
        </>
      )}

      {backendResponse && (
        <>
          <h2>Respuesta del backend</h2>
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
