import React, { useState, useEffect } from "react";
import {
  Frame,
  Page,
  Layout,
  Card,
  DropZone,
  Toast,
  Button,
  TextContainer,
  Spinner,
} from "@shopify/polaris";

export default function InventoryUploader() {
  const [toastMessage, setToastMessage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files) => {
    if (files.length === 0) return;

    const droppedFile = files[0];

    if (droppedFile.type !== "text/csv") {
      setToastMessage("Please upload a valid CSV file.");
      return;
    }

    setFile(droppedFile);
    setLoading(true);

    // Aquí iría la lógica para procesar el archivo, como el fetch a backend
    // Simulamos demora:
    setTimeout(() => {
      setLoading(false);
      setToastMessage("JPaul Report updated successfully.");
      setFile(null); // Opcional: limpiar archivo luego del proceso
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setToastMessage(null);
  };

  return (
    <Frame>
      <Page title="Update Inventory">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <TextContainer>
                <p>
                  Please upload a CSV file containing your inventory update. This
                  will update the JPaul Warehouse stock.
                </p>
              </TextContainer>
              <DropZone
                accept=".csv"
                onDrop={handleDrop}
                active={Boolean(file)}
                allowMultiple={false}
              >
                <DropZone.FileUpload
                  actionTitle="Upload CSV"
                  // Si tienes un archivo, muestra su nombre
                  description={file ? file.name : undefined}
                />
              </DropZone>

              {file && (
                <Button onClick={handleReset} disabled={loading} outline>
                  Remove File
                </Button>
              )}

              {loading && (
                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <Spinner accessibilityLabel="Loading inventory update" size="large" />
                </div>
              )}
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
