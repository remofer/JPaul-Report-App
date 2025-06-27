import { redirect } from "@remix-run/node";

export async function loader({ request }) {
  // Lógica OAuth específica para este callback
  // Igual que en /auth/callback, extraer params, validar, etc.

  return redirect("/app"); // o donde sea que quieras redirigir
}

export default function ShopifyCallback() {
  return <div>Procesando Shopify callback...</div>;
}
