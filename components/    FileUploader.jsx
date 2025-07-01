// components/FileUploader.jsx
import React, { useState, useEffect } from "react";
import { Card, DropZone, Toast, Frame, Page, Layout } from "@shopify/polaris";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import Papa from "papaparse";

export default function FileUploader({ shopifyApiKey }) {
    const [toastMessage, setToastMessage] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);
  
    useEffect(() => {
      const initializeAppBridge = async () => {
        try {
          const host = new URLSearchParams(window.location.search).get("host");
          if (!host) throw new Error("Host parameter is missing.");
  
          const app = createApp({
            apiKey: shopifyApiKey, // Usa la clave API pasada desde el servidor
            host,
            forceRedirect: true,
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
    }, [shopifyApiKey]);
  
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
          {toastMessage && (
            <Toast content={toastMessage} onDismiss={() => setToastMessage(null)} />
          )}
        </Page>
      </Frame>
    );
  }