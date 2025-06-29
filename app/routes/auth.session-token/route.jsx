import { json } from "@remix-run/node";
import crypto from "crypto";

const SHOPIFY_SECRET = process.env.SHOPIFY_API_SECRET_KEY;

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Validar parámetros requeridos
    const { shop, hmac, session } = params;
    if (!shop || !hmac || !session) {
      return json({ message: "Missing required parameters" }, { status: 400 });
    }

    // Validar HMAC
    const { hmac: receivedHmac, ...queryParams } = params;
    const message = Object.keys(queryParams)
      .sort()
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");
    const generatedHmac = crypto
      .createHmac("sha256", SHOPIFY_SECRET)
      .update(message)
      .digest("hex");

    if (generatedHmac !== receivedHmac) {
      return json({ message: "HMAC validation failed" }, { status: 403 });
    }

    // Verificar el token de sesión (opcional según flujo de la app)
    console.log("Session Token Route hit successfully");
    return json({ message: "Session token valid" });
  } catch (error) {
    console.error("Error in loader for /auth/session-token:", error);
    return json({ message: "Unexpected Server Error" }, { status: 500 });
  }
};

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
