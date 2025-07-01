import { useRouteError, useSearchParams } from "@remix-run/react";

export function ErrorBoundary() {
    const error = useRouteError();
  
    // Filtrar las variables de entorno permitidas
    const safeEnv = Object.keys(process.env)
      .filter((key) => key.startsWith("SHOPIFY_") || key === "NODE_ENV")
      .reduce((env, key) => {
        env[key] = process.env[key];
        return env;
      }, {});
  
    return (
      <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24" }}>
        <h1>Something went wrong!</h1>
        {error?.message && <pre>Error: {error.message}</pre>}
        <h2>Environment Variables</h2>
        <pre>{JSON.stringify(safeEnv, null, 2)}</pre>
      </div>
    );
  }
  