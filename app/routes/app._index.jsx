import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppProvider, Page } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import FileUploader from "../../components/FileUploader";

export async function loader() {
  return json({ shopifyApiKey: process.env.SHOPIFY_API_KEY });
}

export default function AppIndex() {
  const { shopifyApiKey } = useLoaderData();

  return (
    <AppProvider i18n={polarisTranslations}>
      <Page title="JPaul Report">
        <FileUploader shopifyApiKey={shopifyApiKey} />
      </Page>
    </AppProvider>
  );
}
