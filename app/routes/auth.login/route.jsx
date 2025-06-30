import { useEffect, useState, useMemo } from "react";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  TextField,
} from "@shopify/polaris";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// Loader para manejar datos iniciales (ajústalo si es necesario)
export const loader = async () => {
  return { errors: null }; // Ajusta según tus necesidades
};

// Action para manejar el envío del formulario
export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const shop = formData.get("shop");

    if (!shop) {
      throw new Error("El dominio de la tienda es requerido.");
    }

    // Lógica para procesar el dominio de la tienda
    const shopDomain = shop.replace(/\.myshopify\.com$/, "");
    const authUrl = `https://admin.shopify.com/store/${shopDomain}/oauth/install`;

    console.log("Auth URL generada:", authUrl);

    return { authUrl };
  } catch (error) {
    console.error("Error en la acción:", error);
    return { errors: { shop: error.message || "Error desconocido." } };
  }
};

export default function Auth() {
  const rawLoaderData = useLoaderData();
  const rawActionData = useActionData();

  const loaderData = useMemo(() => rawLoaderData || {}, [rawLoaderData]);
  const actionData = useMemo(() => rawActionData || {}, [rawActionData]);

  const [shop, setShop] = useState("");
  const errors = actionData.errors || loaderData.errors || {};

  useEffect(() => {
    async function handleRedirection() {
      try {
        const host = new URLSearchParams(window.location.search).get("host");
        const apiKey = loaderData?.polarisTranslations?.Polaris?.apiKey;

        if (!host || !apiKey) {
          console.error("Host or API Key missing");
          return;
        }

        const app = createApp({
          apiKey,
          host,
        });

        const redirect = Redirect.create(app);

        if (actionData?.authUrl) {
          if (window.top !== window.self) {
            console.log("Redirecting inside iframe:", actionData.authUrl);
            redirect.dispatch(Redirect.Action.REMOTE, actionData.authUrl);
          } else {
            console.log("Redirecting outside iframe:", actionData.authUrl);
            window.location.href = actionData.authUrl;
          }
        }
      } catch (error) {
        console.error("Error during redirection:", error);
      }
    }

    handleRedirection();
  }, [actionData, loaderData]);

  return (
    <PolarisAppProvider i18n={polarisTranslations}>
      <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <TextField
                type="text"
                name="shop"
                label="Shop domain"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors?.shop}
              />
              <Button submit>Log in</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}

// import { json, redirect } from "@remix-run/node";
// import { useState } from "react";
// import { useActionData } from "@remix-run/react";
// import {
//   AppProvider as PolarisAppProvider,
//   Button,
//   Card,
//   FormLayout,
//   Page,
//   Text,
//   TextField,
// } from "@shopify/polaris";
// import polarisTranslations from "@shopify/polaris/locales/en.json";
// import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

// export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// // Action to handle POST requests
// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const shop = formData.get("shop");

//   const isValidShop = (shop) => /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop);

//   if (!shop || !isValidShop(shop)) {
//     return json(
//       { errors: { shop: "Invalid shop domain. It must end with .myshopify.com" } },
//       { status: 400 }
//     );
//   }

//   try {
//     const host =
//       process.env.HOST || `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;
//     const shopUrl = new URL(`/auth?shop=${shop}`, host);
//     return redirect(shopUrl.toString());
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return json(
//       { errors: { shop: "An error occurred during authentication." } },
//       { status: 500 }
//     );
//   }
// };

// export default function Auth() {
//   const actionData = useActionData();
//   const [shop, setShop] = useState("");

//   return (
//     <PolarisAppProvider i18n={polarisTranslations}>
//       <Page>
//         <Card>
//           <form method="post" action="/auth/login">
//             <FormLayout>
//               <Text variant="headingMd" as="h2">
//                 Log in
//               </Text>
//               <TextField
//                 type="text"
//                 name="shop"
//                 label="Shop domain"
//                 helpText="example.myshopify.com"
//                 value={shop}
//                 onChange={setShop}
//                 error={actionData?.errors?.shop}
//               />
//               <Button submit>Log in</Button>
//             </FormLayout>
//           </form>
//         </Card>
//       </Page>
//     </PolarisAppProvider>
//   );
// }
