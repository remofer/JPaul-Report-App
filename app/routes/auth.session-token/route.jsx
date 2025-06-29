import { json } from "@remix-run/node";
import crypto from "crypto";

const SHOPIFY_SECRET = process.env.SHOPIFY_API_SECRET_KEY;

function validateHmac(queryParams) {
  const { hmac, ...params } = queryParams;
  const message = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const generatedHmac = crypto
    .createHmac("sha256", SHOPIFY_SECRET)
    .update(message)
    .digest("hex");

  return generatedHmac === hmac;
}

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Validar parámetros requeridos
    const { shop, hmac, session } = params;
    if (!shop || !hmac || !session) {
      return json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validar HMAC
    if (!validateHmac(params)) {
      return json(
        { message: "HMAC validation failed" },
        { status: 403 }
      );
    }

    // Aquí puedes manejar la lógica del token de sesión
    // Validar sesión o redirigir al flujo de OAuth si es necesario
    return json({ message: "Session token is valid" });
  } catch (error) {
    console.error("Error in session-token loader:", error);
    return json(
      { message: "Unexpected Server Error" },
      { status: 500 }
    );
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
