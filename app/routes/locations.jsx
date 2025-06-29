// app/routes/api/locations.jsx
import { json } from "@remix-run/node";

export const loader = async () => {
  const shop = process.env.SHOPIFY_SHOP;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  console.log("SHOPIFY_SHOP:", process.env.SHOPIFY_SHOP);
console.log("SHOPIFY_ACCESS_TOKEN:", process.env.SHOPIFY_ACCESS_TOKEN);


  try {
    const response = await fetch(`https://${shop}/admin/api/2023-01/locations.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return json(data.locations);
    } else {
      throw new Response("Failed to fetch locations", { status: response.status });
    }
  } catch {
    throw new Response("Server error while fetching locations", { status: 500 });
  }
};
// import { json } from "@remix-run/node";

// export const loader = async () => {
//   const shop = process.env.SHOPIFY_SHOP;
//   const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

//   console.log("Fetching locations for shop:", shop);

//   try {
//     const response = await fetch(`https://${shop}/admin/api/2023-01/locations.json`, {
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Access-Token": accessToken,
//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Locations fetched successfully:", data.locations);
//       return json(data.locations);
//     } else {
//       const errorBody = await response.text();
//       console.error("Error fetching locations:", response.status, errorBody);
//       throw new Response("Failed to fetch locations", { status: response.status });
//     }
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     throw new Response("Server error while fetching locations", { status: 500 });
//   }
// };