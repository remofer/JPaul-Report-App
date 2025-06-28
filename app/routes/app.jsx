import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { useEffect } from "react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  try {
    const session = await authenticate.admin(request);

    if (!session) {
      throw redirect("/auth/login?top_level=true");
    }

    return { apiKey: process.env.SHOPIFY_API_KEY || "" };
  } catch (error) {
    console.error("App Loader Error:", error);
    throw redirect("/auth/login?top_level=true");
  }
};

export default function App() {
  const { apiKey } = useLoaderData();

  useEffect(() => {
    if (window.top !== window.self) {
      window.top.location.href = window.location.href;
    }
  }, []);

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (args) => boundary.headers(args);
