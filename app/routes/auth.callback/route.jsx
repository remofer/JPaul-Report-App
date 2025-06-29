import { redirect } from "@remix-run/node";
import {authenticate} from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // Validar `shop`
  if (!shop) {
    throw new Error("Missing shop parameter");
  }

  // Procesar la autenticación
  const session = await authenticate.admin(request);

  // Redirigir al dashboard o página principal
  if (session) {
    return redirect("/dashboard");
  }

  throw new Error("Failed to authenticate");
};
