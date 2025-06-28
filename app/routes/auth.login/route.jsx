import { useState } from "react";
import { useActionData } from "@remix-run/react";
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

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export default function Auth() {
  const actionData = useActionData();
  const [shop, setShop] = useState("");

  return (
    <PolarisAppProvider i18n={polarisTranslations}>
      <Page>
        <Card>
          <form method="post" action="/auth.login.server">
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
                error={actionData?.errors?.shop}
              />
              <Button submit>Log in</Button>
            </FormLayout>
          </form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}
