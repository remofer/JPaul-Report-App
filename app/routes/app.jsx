import { json, redirect } from "@remix-run/node";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  try {
    const { session, redirect: redirectTo } = await authenticate.admin(request);

    if (redirectTo) {
      return redirect(redirectTo);
    }

    if (!session || !session.shop) {
      console.error('Session is invalid or missing:', session);
      throw new Error('Invalid or missing session');
    }

    return new Response('Session validated successfully');
  } catch (error) {
    console.error('Error in app loader:', error);
    return new Response('Failed to authenticate', { status: 401 });
  }
};

export default function App() {
  const { apiKey } = useLoaderData();
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24" }}>
      <h1>Something went wrong!</h1>
      <pre>{error?.message || "Unknown error"}</pre>
    </div>
  );
}

export const headers = (args) => boundary.headers(args);
