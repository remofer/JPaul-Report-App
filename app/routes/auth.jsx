import { redirect } from "@remix-run/node";

const isValidShop = (shop) => /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop);

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (shop && isValidShop(shop)) {
    const host = url.searchParams.get("host");
    return redirect(`/app?shop=${shop}${host ? `&host=${host}` : ""}`);
  }

  return redirect(`/error?message=missing-or-invalid-shop`);
};

export default function AuthPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Authenticating...</h1>
      <p>Please wait while we verify your credentials.</p>
    </div>
  );
}
// import { redirect } from "@remix-run/node";
// import { authenticate } from "../shopify.server";

// const isValidShop = (shop) => /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop);

// export const loader = async ({ request }) => {
//   const url = new URL(request.url);
//   const shop = url.searchParams.get("shop");

//   // Validar parámetro `shop`
//   if (!shop || !isValidShop(shop)) {
//     return redirect("/auth/login?error=invalid_shop");
//   }

//   try {
//     // Verificar si ya existe una sesión
//     const session = await authenticate.admin(request);
//     if (session) {
//       return redirect("/dashboard"); // Redirige a una página válida
//     }

//     // Continuar con el flujo OAuth si no hay sesión
//     const host =
//       process.env.HOST || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;
//     const authUrl = new URL(`/auth/callback`, host);
//     authUrl.searchParams.set("shop", shop);
//     return redirect(authUrl.toString());
//   } catch (error) {
//     console.error("Error in loader:", error);
//     return redirect("/auth/login?error=auth_error");
//   }
// };
