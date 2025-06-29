import { redirect } from "@remix-run/node";
import shopify from "../../shopify.server";

export const action = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    console.error("Error: Shop parameter is required in action.");
    throw new Error("Shop parameter is required.");
  }

  try {
    const authUrl = await shopify.auth.begin({
      shop,
      callbackPath: "/auth/callback",
      isOnline: true,
      rawRequest: request,
      rawResponse: undefined, // Remix no usa "res"
    });

    return redirect(authUrl);
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
