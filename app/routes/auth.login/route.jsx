import { redirect } from "@remix-run/node";
import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
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

export const loader = async () => {
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
    console.log("Attempting authentication for shop:", shop);
    const authUrl = await login(request, shop, "/auth/callback", false);
    console.log("Auth URL generated:", authUrl);

    return redirect(authUrl);
  } catch (error) {
    console.error("Authentication error:", error.message);
    return {
      errors: { shop: "Authentication failed. Please try again." },
    };
  }
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || {};

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
                onChange={(value) => setShop(value)}
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
