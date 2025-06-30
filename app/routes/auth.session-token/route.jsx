import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import React, { useEffect, useState } from "react";

export const loader = async () => {
  return json({
    apiKey: process.env.SHOPIFY_API_KEY,
  });
};

export default function SessionTokenPage() {
  const { apiKey } = useLoaderData();
  const [sessionToken, setSessionToken] = useState(null);
  const [backendResponse, setBackendResponse] = useState(null);
  const [urlParams, setUrlParams] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener parámetros de la URL
    const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    setUrlParams(params);

    if (!params.host) {
      setError("Host parameter missing");
    }
  }, []);

  useEffect(() => {
    // Validar y enviar el token al backend
    if (!apiKey || !urlParams.host || error) return;

    async function fetchSessionToken() {
      try {
        const app = createApp({ apiKey, host: urlParams.host });
        const token = await getSessionToken(app);
        setSessionToken(token);

        const response = await fetch("/api/session-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.success) {
          setBackendResponse(result);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    fetchSessionToken();
  }, [apiKey, urlParams]);

  return (
    <div>
      <h1>Session Token Debug</h1>

      <h2>Parámetros de la URL</h2>
      <pre>{JSON.stringify(urlParams, null, 2)}</pre>

      {error && (
        <div>
          <h2>Error</h2>
          <pre>{JSON.stringify({ error }, null, 2)}</pre>
        </div>
      )}

      {sessionToken && (
        <>
          <h2>Session Token Obtenido</h2>
          <pre>{sessionToken}</pre>
        </>
      )}

      {backendResponse && (
        <>
          <h2>Respuesta del Backend</h2>
          <pre>{JSON.stringify(backendResponse, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
// // import { json } from "@remix-run/node";
// // import { useEffect, useState } from "react";
// // import createApp from "@shopify/app-bridge";
// // import { getSessionToken } from "@shopify/app-bridge/utilities";
// // import { useLoaderData } from "@remix-run/react";

// // export const loader = async () => {
// //   return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
// // };

// // export default function SessionTokenPage() {
// //   const { apiKey } = useLoaderData();
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     async function fetchSessionToken() {
// //       try {
// //         const params = new URLSearchParams(window.location.search);
// //         const host = params.get("host");
// //         if (!host) throw new Error("Host parameter missing");

// //         const app = createApp({ apiKey, host });
// //         const token = await getSessionToken(app);

// //         const response = await fetch("/api/session-token", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         if (response.ok) {
// //           window.location.href = "/app"; // redirige a tu app
// //         } else {
// //           throw new Error("Unauthorized");
// //         }
// //       } catch (err) {
// //         setError(err.message);
// //       }
// //     }

// //     fetchSessionToken();
// //   }, [apiKey]);

// //   if (error) return <div>Error: {error}</div>;
// //   return <div>Verificando sesión...</div>;
// // }
// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import createApp from "@shopify/app-bridge";
// import { getSessionToken } from "@shopify/app-bridge/utilities";
// import React, { useEffect, useState } from "react";

// export const loader = async ({ request }) => {
//   // No chequeas Authorization aquí porque es la página que se carga sin token
//   return json({
//     apiKey: process.env.SHOPIFY_API_KEY,
//   });
// };

// export default function SessionTokenRoute() {
//   const { apiKey } = useLoaderData();
//   const [sessionToken, setSessionToken] = useState(null);
//   const [backendResponse, setBackendResponse] = useState(null);
//   const [urlParams, setUrlParams] = useState({});

//   useEffect(() => {
//     const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
//     setUrlParams(params);
//   }, []);

//   useEffect(() => {
//     if (!apiKey || !urlParams.host) return;

//     async function fetchToken() {
//       try {
//         const app = createApp({ apiKey, host: urlParams.host });
//         const token = await getSessionToken(app);
//         setSessionToken(token);

//         const response = await fetch("/api/session-token", {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) {
//           const text = await response.text();
//           throw new Error(`Fetch error: ${text}`);
//         }

//         const json = await response.json();
//         setBackendResponse(json);
//       } catch (err) {
//         console.error("Client Error:", err.message);
//       }
//     }

//     fetchToken();
//   }, [apiKey, urlParams]);

//   return (
//     <div>
//       <h1>Session Token Route</h1>
//       <h2>Parámetros de la URL</h2>
//       <pre>{JSON.stringify(urlParams, null, 2)}</pre>

//       {sessionToken && (
//         <>
//           <h2>Session Token Obtenido</h2>
//           <pre>{sessionToken}</pre>
//         </>
//       )}

//       {backendResponse && (
//         <>
//           <h2>Respuesta del Backend</h2>
//           <pre>{JSON.stringify(backendResponse, null, 2)}</pre>
//         </>
//       )}
//     </div>
//   );
// }


// // import { redirect } from "@remix-run/node";
// // import jwt from "jsonwebtoken";

// // export async function loader({ request }) {
// //   const url = new URL(request.url);
// //   const sessionToken = url.searchParams.get("session");

// //   if (!sessionToken) {
// //     return redirect("/auth/login");
// //   }

// //   try {
// //     const decodedToken = jwt.decode(sessionToken);

// //     // Valida datos del token (opcional)
// //     if (!decodedToken || !decodedToken.shop) {
// //       return redirect("/auth/login");
// //     }

// //     console.log("Token válido:", decodedToken);

// //     return redirect("/app");
// //   } catch (error) {
// //     console.error("Error procesando token:", error);
// //     return redirect("/auth/login");
// //   }
// // }
