import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["read_products", "write_products"],
  hostName: process.env.HOST.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
});

export async function login(request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return { shop: "Shop domain is required" };
  }

  const authUrl = await shopify.auth.beginAuth(
    request,
    shop,
    "/auth/callback",
    false,
  );

  return Response.redirect(authUrl);
}