import '@shopify/shopify-api/adapters/node';
import { redirect } from "@remix-run/node";
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { shopifyApi } from "@shopify/shopify-api";
import crypto from 'crypto';
import axios from 'axios';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["write_inventory", "read_inventory", "read_locations", "read_products"],
  hostName: process.env.HOST.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
});

// HMAC Validation Function
function validateHmac(query, clientSecret) {
  const { hmac, ...rest } = Object.fromEntries(query.entries());
  const sortedParams = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join('&');

  const calculatedHmac = crypto
    .createHmac('sha256', clientSecret)
    .update(sortedParams)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hmac, 'utf-8'),
    Buffer.from(calculatedHmac, 'utf-8')
  );
}

// Function to Get Access Token
async function getAccessToken(shop, code, clientId, clientSecret) {
  const url = `https://${shop}/admin/oauth/access_token`;
  const response = await axios.post(url, {
    client_id: clientId,
    client_secret: clientSecret,
    code,
  });

  return response.data.access_token;
}

// Remix Loader Function
export async function loader({ request }) {
  const query = new URL(request.url).searchParams;

  if (!validateHmac(query, process.env.SHOPIFY_API_SECRET)) {
    console.error("HMAC validation failed");
    return redirect("/auth/login");
  }

  try {
    const session = await shopify.auth.validateAuthCallback(request, query);

    const accessToken = await getAccessToken(
      query.get('shop'),
      query.get('code'),
      process.env.SHOPIFY_API_KEY,
      process.env.SHOPIFY_API_SECRET
    );

    console.log("Access token:", accessToken);

    return redirect(`/app?shop=${session.shop}&token=${accessToken}`);
  } catch (error) {
    console.error("Error en /auth/callback:", error);
    return redirect("/auth/login");
  }
}

// Auth Callback Component
export default function AuthCallback() {
  // Handle embedded apps
  if (window.top !== window.self) {
    const app = createApp({
      apiKey: process.env.SHOPIFY_API_KEY,
      host: new URLSearchParams(window.location.search).get('host'),
    });

    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.REMOTE,
      `${process.env.HOST}/auth/callback`
    );

    return null; // Stop rendering after redirect
  }

  return <div>Procesando autenticación...</div>;
}
