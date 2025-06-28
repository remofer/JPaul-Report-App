// app/routes/auth.callback.jsx
import shopify from "../../shopify.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);

    // Shopify envía los query params para validar el callback
    const session = await shopify.auth.validateAuthCallback(request, url.pathname);

    // Aquí puedes guardar session info en DB o session storage
    console.log("Auth session:", session);

    // Redirigir a la app luego de login
    return redirect("/");
  } catch (error) {
    console.error("Failed to complete OAuth:", error);
    return new Response("OAuth callback error", { status: 500 });
  }
};
