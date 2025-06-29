import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    console.error("Error: Shop parameter is required.");
    throw redirect("/error?message=Shop%20parameter%20is%20required");
  }

  // Redirigir al flujo de autenticación
  return redirect(`/auth?shop=${shop}`);
};
