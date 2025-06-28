import '@shopify/shopify-api/adapters/node';
import { redirect } from "@remix-run/node";
import { shopifyApi } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["write_inventory", "read_inventory", "read_locations", "read_products"],
  hostName: process.env.HOST.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
});

console.log(shopify, "XDD");

export async function loader({ request }) {
  const url = new URL(request.url);

  try {
    const session = await shopify.auth.validateAuthCallback(
      request, // Shopify valida la solicitud
      url.searchParams
    );

    // Aquí puedes guardar la sesión si lo necesitas
    console.log("Authenticated session:", session);

    // Redirige a tu app principal dentro de Shopify
    return redirect(`/app?shop=${session.shop}`);
  } catch (error) {
    console.error("Error en /auth/callback:", error);
    return redirect("/auth/login"); // Redirige al login si hay error
  }
}

export default function AuthCallback() {
  return <div>Procesando autenticación...</div>;
}
