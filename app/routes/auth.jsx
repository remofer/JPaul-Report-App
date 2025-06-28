// app/routes/auth.jsx
import shopify from "../shopify.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop || !shop.endsWith(".myshopify.com")) {
    return new Response("Invalid shop parameter", { status: 400 });
  }

  try {
    // Generar URL de autorización OAuth
    const authUrl = await shopify.auth.callbackPath({
      shop,
      callbackPath: "/auth/callback",
      isOnline: false,
    });

    return redirect(authUrl);
  } catch (error) {
    console.error("Error starting OAuth:", error);
    return new Response("Failed to start OAuth process", { status: 500 });
  }
};
