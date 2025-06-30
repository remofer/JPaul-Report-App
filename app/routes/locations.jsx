import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const shop = process.env.SHOPIFY_SHOP;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  console.log("SHOPIFY_SHOP:", shop);
  console.log("SHOPIFY_ACCESS_TOKEN:", accessToken);

  try {
    // Validar el header de autorización para tokens de sesión
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Authorization header missing" }, { status: 401 });
    }

    // Validar el token de sesión si es necesario
    const sessionToken = authHeader.replace("Bearer ", "");
    console.log("Session Token Received:", sessionToken);

    // Realizar la solicitud a Shopify para obtener las ubicaciones
    const response = await fetch(`https://${shop}/admin/api/2023-01/locations.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        Authorization: `Bearer ${sessionToken}`, // Agregar si es necesario para validaciones
      },
    });

    if (response.ok) {
      const data = await response.json();
      return json(data.locations);
    } else {
      console.error("Error fetching locations from Shopify:", response.statusText);
      return json({ error: "Failed to fetch locations from Shopify" }, { status: response.status });
    }
  } catch (error) {
    console.error("Server error while fetching locations:", error.message);
    return json({ error: "Server error while fetching locations" }, { status: 500 });
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