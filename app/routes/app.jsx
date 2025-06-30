import { json, redirect } from "@remix-run/node";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  try {
    console.log("App loader - authenticating...");
    const { session, redirect: redirectTo } = await authenticate.admin(request);

    if (redirectTo) {
      console.log("Redirect required:", redirectTo);
      return redirect(redirectTo);
    }

    if (!session || !session.shop) {
      throw new Error("Session is missing or invalid");
    }

    console.log("Authenticated session:", session);
    return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
  } catch (error) {
    console.error("Error in app loader:", error.message);
    return redirect(`/error?message=${encodeURIComponent(error.message)}`);
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
// import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
// import { redirect } from "@remix-run/node";
// import { boundary } from "@shopify/shopify-app-remix/server";
// import { AppProvider } from "@shopify/shopify-app-remix/react";
// import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
// import { authenticate } from "../shopify.server";
// import { useEffect } from "react";

// export const links = () => [
//   { rel: "stylesheet", href: polarisStyles },
// ];

// export const loader = async ({ request }) => {
//   try {
//     console.log("Loader request URL:", request.url);

//     const session = await authenticate.admin(request);

//     if (!session) {
//       console.warn("No session found. Redirecting to login.");
//       throw redirect("/auth/login?top_level=true");
//     }

//     console.log("Session authenticated:", session);
//     return { apiKey: process.env.SHOPIFY_API_KEY || "" };
//   } catch (error) {
//     console.error("Error in loader:", error);
//     throw redirect("/auth/login?top_level=true");
//   }
// };

// export default function App() {
//   const { apiKey } = useLoaderData();

//   useEffect(() => {
//     if (window.top !== window.self) {
//       const url = new URL(window.location.href);
//       if (!url.searchParams.has("embedded")) {
//         url.searchParams.set("embedded", "true");
//         window.top.location.href = url.toString();
//       }
//     }
//   }, []);

//   return (
//     <AppProvider isEmbeddedApp apiKey={apiKey}>
//       <Outlet />
//     </AppProvider>
//   );
// }

// export function ErrorBoundary() {
//   const error = useRouteError();
//   return (
//     <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24" }}>
//       <h1>Something went wrong!</h1>
//       <pre>{error?.message || "Unknown error"}</pre>
//     </div>
//   );
// }

// export const headers = (args) => {
//   const headers = boundary.headers(args);

//   // Agregar encabezados personalizados para seguridad, como Content-Security-Policy
//   headers.set("Content-Security-Policy", "frame-ancestors https://*.myshopify.com");
//   return headers;
// };
