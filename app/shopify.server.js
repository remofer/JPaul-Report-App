import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["read_products", "write_products"],
  hostName: process.env.HOST.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
});

// Función para autenticar solicitudes
export async function authenticate(request) {
  const sessionToken = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!sessionToken) {
    throw new Error("Authentication failed: No session token provided");
  }

  try {
    const decodedSession = await shopify.session.decodeSession(sessionToken);
    if (!decodedSession || !decodedSession.shop) {
      throw new Error("Invalid session token");
    }

    return decodedSession;
  } catch (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }
}

// Función para manejar el login
export async function login(request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return { shop: "Shop domain is required" };
  }

  const authUrl = await shopify.auth.beginAuth(request, shop, "/auth/callback", false);

  return Response.redirect(authUrl);
}
