import { useState } from "react";
import { Form, useLoaderData, redirect, useActionData } from "@remix-run/react";
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

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  return { polarisTranslations };
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const shop = formData.get("shop");

  if (!shop || !shop.endsWith(".myshopify.com")) {
    return {
      errors: { shop: "Please enter a valid Shopify domain (e.g., example.myshopify.com)." },
    };
  }

  try {
    console.log("Authenticating for shop:", shop);
    const authUrl = await login(request, shop, "/auth/callback", false);
    console.log("Redirecting to:", authUrl);
    return redirect(authUrl);
  } catch (error) {
    console.error("Authentication failed:", error);
    return {
      errors: { shop: "Authentication failed. Please try again." },
    };
  }
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page>
        <Card>
        <Form method="get" action="/auth">
      <label>
        Shop domain:
        <input
          type="text"
          name="shop"
          value={shop}
          onChange={e => setShop(e.target.value)}
          placeholder="example.myshopify.com"
          required
        />
      </label>
      <button type="submit">Log in</button>
    </Form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}
