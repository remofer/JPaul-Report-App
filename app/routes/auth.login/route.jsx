import { useState, useEffect } from "react";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  console.log("Loader function called with request:", request.url);

  try {
    const errors = loginErrorMessage(await login(request));
    console.log("Errors returned from login in loader:", errors);

    return { errors, polarisTranslations };
  } catch (error) {
    console.error("Error in loader function:", error);

    return json(
      { errors: { shop: "An error occurred while loading the login page." } },
      { status: 500 }
    );
  }
};

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const shop = formData.get("shop");
    if (!shop) throw new Error("Missing shop parameter");

    // Asegúrate de que el parámetro `shop` no contenga `.myshopify.com`
    const shopDomain = shop.replace(/\.myshopify\.com$/, "");

    const authUrl = `https://admin.shopify.com/store/${shopDomain}/oauth/install?client_id=50ff88a57d12509b08b03a5930423629`;
    console.log("Auth URL generated:", authUrl);

    return json({ authUrl });
  } catch (error) {
    console.error("Error in action function:", error);
    return json(
      { errors: { shop: "Authentication failed. Please check your input or server configuration." } },
      { status: 500 }
    );
  }
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  console.log("Rendered component with loaderData:", loaderData);
  console.log("Rendered component with actionData:", actionData);

  // Manejo del redireccionamiento basado en la respuesta del servidor
  useEffect(() => {
    if (actionData?.authUrl) {
      console.log("Redirecting to authUrl:", actionData.authUrl);
      window.location.href = actionData.authUrl; // Redirecciona al usuario
    }
  }, [actionData]);

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <Text variant="headingMd" as="h2">
                Log in
              </Text>
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
