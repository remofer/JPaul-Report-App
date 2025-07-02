import { AppProvider } from "@shopify/shopify-app-remix/react";
import { Outlet } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export default function App() {
  return (
    <AppProvider isEmbeddedApp apiKey={process.env.SHOPIFY_API_KEY}>
      <Outlet />
    </AppProvider>
  );
}
