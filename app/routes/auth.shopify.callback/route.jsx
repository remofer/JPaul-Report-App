// import { redirect } from "@remix-run/node";

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const shop = url.searchParams.get("shop");

//   if (!shop) {
//     console.error("Shop parameter missing");
//     return redirect("/auth/login");
//   }

//   // Realiza cualquier acción adicional necesaria aquí (validar scopes, etc.)
//   console.log(`Callback recibido para la tienda: ${shop}`);

//   // Redirige a la app principal
//   return redirect(`/app?shop=${shop}`);
// }

// export default function ShopifyCallback() {
//   return <div>Procesando Shopify callback...</div>;
// }
