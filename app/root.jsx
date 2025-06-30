import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

export const loader = () => {
  return json({
    ENV: {
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    },
  });
};
 
export const headers = () => {
  return {
    "Content-Security-Policy": "frame-ancestors https://admin.shopify.com https://*.myshopify.com",
  };
};

export default function App() {
  const { ENV } = useLoaderData();

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)};`,
          }}
        />
      </body>
    </html>
  );
}
