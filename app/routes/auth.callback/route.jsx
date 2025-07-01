import { json, redirect } from "@remix-run/node";
import { Shopify } from "@shopify/shopify-api";

export async function loader({ request }) {
  return json({ message: "GET no soportado" }, { status: 405 });
}

export async function action({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  const hmac = url.searchParams.get("hmac");

  if (!shop || !code || !hmac) {
    return json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  try {
    // Verifica el HMAC para la seguridad
    const isValid = Shopify.Utils.validateHmac(hmac, process.env.SHOPIFY_API_SECRET, url.searchParams);

    if (!isValid) {
      return json({ error: "HMAC inválido" }, { status: 400 });
    }

    // Intercambia el código por un token de acceso
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error("Error obteniendo token de acceso");
    }

    const data = await response.json();
    const accessToken = data.access_token;

    console.log(`Access Token para ${shop}:`, accessToken);

    // Almacena el token de acceso según sea necesario
    // Por ejemplo, en tu base de datos o en un sistema de sesiones

    // Redirige al usuario a la página principal de tu app
    return redirect(`/app?shop=${shop}`);
  } catch (error) {
    console.error("Error en auth.callback:", error);
    return json({ error: "Error procesando la autenticación" }, { status: 500 });
  }
}

export default function AuthCallback() {
  return <div>Procesando autenticación...</div>;
}
