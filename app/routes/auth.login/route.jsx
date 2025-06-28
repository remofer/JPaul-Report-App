import { redirect } from "@remix-run/node";
import { useState } from "react";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
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
import { login } from "../../shopify.server"; // Cambiado desde `login`

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const topLevel = url.searchParams.get("top_level");

  if (topLevel === "true" && shop) {
    const authUrl = await login.getAuthUrl(shop);
    return redirect(authUrl);
  }

  return { polarisTranslations };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const errors = actionData?.errors || loaderData?.errors;

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
