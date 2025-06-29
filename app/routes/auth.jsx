import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // Validar parámetro `shop`
  if (!shop || !shop.endsWith(".myshopify.com")) {
    return redirect("/auth/login?error=invalid_shop");
  }

  // Verificar si ya existe una sesión
  const session = await authenticate.admin(request);
  if (session) {
    return redirect("/dashboard"); // Redirige a una página válida
  }

  // Continuar con el flujo OAuth si no hay sesión
  const authUrl = new URL(`/auth/callback`, process.env.HOST);
  authUrl.searchParams.set("shop", shop);
  return redirect(authUrl.toString());
};
