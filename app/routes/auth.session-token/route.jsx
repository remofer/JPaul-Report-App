// import { json } from "@remix-run/node";
// import { useEffect, useState } from "react";
// import createApp from "@shopify/app-bridge";
// import { getSessionToken } from "@shopify/app-bridge/utilities";
// import { useLoaderData } from "@remix-run/react";

// export const loader = async () => {
//   return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
// };

// export default function SessionTokenPage() {
//   const { apiKey } = useLoaderData();
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchSessionToken() {
//       try {
//         const params = new URLSearchParams(window.location.search);
//         const host = params.get("host");
//         if (!host) throw new Error("Host parameter missing");

//         const app = createApp({ apiKey, host });
//         const token = await getSessionToken(app);

//         const response = await fetch("/api/session-token", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok) {
//           window.location.href = "/app"; // redirige a tu app
//         } else {
//           throw new Error("Unauthorized");
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     }

//     fetchSessionToken();
//   }, [apiKey]);

//   if (error) return <div>Error: {error}</div>;
//   return <div>Verificando sesión...</div>;
// }
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import React, { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  return json({
    apiKey: process.env.SHOPIFY_API_KEY,
  });
};

export default function SessionTokenRoute() {
  const { apiKey } = useLoaderData();
  const [urlParams, setUrlParams] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    setUrlParams(params);
  }, []);

  useEffect(() => {
    if (!apiKey || !urlParams.host) return;

    async function fetchToken() {
      try {
        const app = createApp({ apiKey, host: urlParams.host });
        const token = await getSessionToken(app);

        const response = await fetch("/api/session-token", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Fetch error: ${text}`);
        }

        // Si la validación es exitosa, redirige a la app
        window.location.href = "/app";
      } catch (err) {
        setError(err.message);
      }
    }

    fetchToken();
  }, [apiKey, urlParams]);

  if (error) return <div>Error: {error}</div>;
  return <div>Verificando sesión...</div>;
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
