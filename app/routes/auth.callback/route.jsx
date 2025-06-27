// app/routes/auth.callback.jsx (o .tsx)

import { redirect } from "@remix-run/node";

export async function loader({ request }) {
  // Aquí pones la lógica para manejar la callback de Shopify,
  // obtener los query params (code, shop, state, etc),
  // validar el OAuth, guardar tokens, etc.

  // Por ejemplo:
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  // Validar y procesar...

  // Luego redirigir a tu app o dashboard dentro de Shopify
  return redirect(`/app?shop=${shop}`);
}

export default function AuthCallback() {
  return <div>Procesando autenticación...</div>;
}
