import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const shop = process.env.SHOPIFY_SHOP;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Authorization header missing" }, { status: 401 });
    }

    const sessionToken = authHeader.replace("Bearer ", "");
    const response = await fetch(`https://${shop}/admin/api/2023-01/locations.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        Authorization: `Bearer ${sessionToken}`,
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
