import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import jwt from "jsonwebtoken";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";

// Backend: Verificar session token
export const loader = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar el token
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY, {
      algorithms: ["HS256"],
    });

    return json({ message: "Session token is valid", shop: decoded.dest });
  } catch (error) {
    return json({ error: error.message }, { status: 403 });
  }
};

// Frontend: Obtener el session token
export default function SessionTokenRoute() {
  const data = useLoaderData();

  async function handleGetSessionToken() {
    try {
      // Configura Shopify App Bridge
      const app = createApp({
        apiKey: process.env.SHOPIFY_API_KEY,
        host: new URLSearchParams(window.location.search).get("host"),
      });

      // Obtén el session token
      const sessionToken = await getSessionToken(app);

      console.log("Session Token obtenido:", sessionToken);

      // Envía el token al backend
      const response = await fetch("/auth/session-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      const result = await response.json();
      console.log("Respuesta del backend:", result);
    } catch (error) {
      console.error("Error al obtener o enviar el session token:", error);
    }
  }

  return (
    <div>
      <h1>Session Token Route</h1>
      <button onClick={handleGetSessionToken}>Validate Session Token</button>
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
