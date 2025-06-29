import React, { useState } from "react";
import { Page, Layout, Card, DropZone, Toast, Frame } from "@shopify/polaris";
import Papa from "papaparse";

export default function FileUploader() {
  const [toastMessage, setToastMessage] = useState(null);

  const getLocationId = async (name) => {
    try {
      const res = await fetch("/locations");
      if (!res.ok) return null;
      const locations = await res.json();
      return locations.find((l) => l.name === name)?.id || null;
    } catch {
      return null;
    }
  };

  const handleDrop = async (files) => {
    const file = files[0];
    !file || file.type !== "text/csv"
      ? setToastMessage("Please upload a valid CSV file.")
      : Papa.parse(file, {
          header: true,
          complete: async ({ data }) => {
            const locationId = await getLocationId("JPaul Warehouse");
            !locationId
              ? setToastMessage("JPaul Warehouse location not found.")
              : (() => {
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("locationId", locationId);
                  fetch("/inventory-update", { method: "POST", body: formData })
                    .then((res) =>
                      setToastMessage(res.ok ? "JPaul Report updated." : "Update failed.")
                    )
                    .catch(() => setToastMessage("Backend connection error."));
                })();
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

// import '@shopify/shopify-api/adapters/node';
// import { useState } from "react";
// import { Page, Layout, Card, DropZone, Toast, Frame } from "@shopify/polaris";
// import Papa from "papaparse";

// export default function FileUploader() {
//   const [toastMessage, setToastMessage] = useState(null);

//   const getLocationId = async (name) => {
//     try {
//       const res = await fetch("/locations");
//       if (!res.ok) return null;
//       const locations = await res.json();
//       return locations.find((l) => l.name === name)?.id || null;
//     } catch {
//       return null;
//     }
//   };

//   const handleDrop = async (files) => {
//     const file = files[0];
//     !file || file.type !== "text/csv"
//       ? setToastMessage("Please upload a valid CSV file.")
//       : Papa.parse(file, {
//           header: true,
//           complete: async ({ data }) => {
//             const locationId = await getLocationId("JPaul Warehouse");
//             !locationId
//               ? setToastMessage("JPaul Warehouse location not found.")
//               : (() => {
//                   const formData = new FormData();
//                   formData.append("file", file);
//                   formData.append("locationId", locationId);
//                   fetch("/inventory-update", { method: "POST", body: formData })
//                     .then((res) =>
//                       setToastMessage(res.ok ? "JPaul Report updated." : "Update failed.")
//                     )
//                     .catch(() => setToastMessage("Backend connection error."));
//                 })();
//           },
//         });
//   };

//   return (
//     <Frame>
//       <Page title="Update Inventory">
//         <Layout>
//           <Layout.Section>
//             <Card sectioned>
//               <DropZone accept=".csv" onDrop={handleDrop}>
//                 <DropZone.FileUpload actionTitle="Update JPaul Report" />
//               </DropZone>
//             </Card>
//           </Layout.Section>
//         </Layout>
//         {toastMessage && <Toast content={toastMessage} onDismiss={() => setToastMessage(null)} />}
//       </Page>
//     </Frame>
//   );
// }
