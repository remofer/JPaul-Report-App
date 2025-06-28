import "@shopify/shopify-api/adapters/node";
import { redirect } from "@remix-run/node";
import { shopifyApi } from "@shopify/shopify-api";

// Validar que HOST esté definido
if (!process.env.HOST) {
  throw new Error("Environment variable HOST is not defined.");
}

// Inicializar Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["write_inventory", "read_inventory", "read_locations", "read_products"],
  hostName: process.env.HOST.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
});

export async function loader({ request }) {
  const url = new URL(request.url);

  try {
    // Validar el callback de autenticación
    const session = await shopify.auth.validateAuthCallback(
      request, // La solicitud de Shopify
      url.searchParams // Los parámetros del callback (shop, hmac, etc.)
    );

    console.log("Authenticated session:", session);

    // Redirigir al área principal de la aplicación
    return redirect(`/app?shop=${session.shop}`);
  } catch (error) {
    console.error("Error during auth callback:", error);

    // Redirigir al login en caso de error
    return redirect("/auth/login");
  }
}

export default function AuthCallback() {
  return <div>Processing authentication...</div>;
}
