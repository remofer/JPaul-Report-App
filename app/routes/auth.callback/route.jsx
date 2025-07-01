import { json, redirect } from "@remix-run/node";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["write_inventory, read_inventory, read_locations, read_products"],
  hostName: process.env.HOST || "",
  apiVersion: LATEST_API_VERSION,
});

export async function loader({ request }) {
  return json({ message: "GET not supported" }, { status: 405 });
}

export async function action({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  const hmac = url.searchParams.get("hmac");

  if (!shop || !code || !hmac) {
    return json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const isValid = shopify.utils.validateHmac(hmac, process.env.SHOPIFY_API_SECRET, url.searchParams);

    if (!isValid) {
      return json({ error: "Invalid HMAC" }, { status: 400 });
    }

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
      throw new Error("Error obtaining access token");
    }

    const data = await response.json();
    const accessToken = data.access_token;
    console.log(`Access Token for ${shop}:`, accessToken);

    return redirect(`/app?shop=${shop}`);
  } catch (error) {
    console.error("Error in auth.callback:", error);
    return json({ error: "Error processing authentication" }, { status: 500 });
  }
}

export default function AuthCallback() {
  return <div>Processing authentication...</div>;
}
