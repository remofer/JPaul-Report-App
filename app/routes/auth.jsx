import React, { useState, useEffect } from "react";
import { Page, Layout, Card, DropZone, Toast, Frame } from "@shopify/polaris";
import Papa from "papaparse";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import createApp from "@shopify/app-bridge";

export default function FileUploader() {
  const [toastMessage, setToastMessage] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    const initializeAppBridge = async () => {
      try {
        const host = new URLSearchParams(window.location.search).get("host");
        if (!host) throw new Error("Host parameter is missing.");

        const app = createApp({
          apiKey: process.env.SHOPIFY_API_KEY,
          host,
        });

        const token = await getSessionToken(app);
        setSessionToken(token);
        console.log("Session Token initialized:", token);
      } catch (error) {
        console.error("Error initializing App Bridge:", error.message);
        setToastMessage("Error initializing authentication.");
      }
    };

    initializeAppBridge();
  }, []);

  const getLocationId = async (name) => {
    if (!sessionToken) {
      setToastMessage("Session token not available.");
      return null;
    }

    try {
      const res = await fetch("/locations", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch locations:", res.statusText);
        return null;
      }
      const locations = await res.json();
      return locations.find((l) => l.name === name)?.id || null;
    } catch (error) {
      console.error("Error fetching locations:", error.message);
      return null;
    }
  };

  const handleDrop = async (files) => {
    const file = files[0];
    if (!file || file.type !== "text/csv") {
      setToastMessage("Please upload a valid CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async ({ data }) => {
        const locationId = await getLocationId("JPaul Warehouse");
        if (!locationId) {
          setToastMessage("JPaul Warehouse location not found.");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("locationId", locationId);

        try {
          const res = await fetch("/inventory-update", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
            body: formData,
          });

          if (!res.ok) {
            console.error("Failed to update inventory:", res.statusText);
            setToastMessage("Update failed.");
            return;
          }

          setToastMessage("JPaul Report updated successfully.");
        } catch (error) {
          console.error("Error updating inventory:", error.message);
          setToastMessage("Backend connection error.");
        }
      },
    });
  };

  return (
    <Frame>
      <Page title="Update Inventory">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <DropZone accept=".csv" onDrop={handleDrop}>
                <DropZone.FileUpload actionTitle="Update JPaul Report" />
              </DropZone>
            </Card>
          </Layout.Section>
        </Layout>
        {toastMessage && <Toast content={toastMessage} onDismiss={() => setToastMessage(null)} />}
      </Page>
    </Frame>
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
