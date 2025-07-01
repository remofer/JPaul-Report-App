import { parse } from "csv-parse/sync";
import { json } from "@remix-run/node";

const fetchLocations = async (shop, accessToken) => {
  try {
    const res = await fetch(`https://${shop}/admin/api/2023-01/locations.json`, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });

    if (!res.ok) throw new Error(`Failed to fetch locations: ${res.statusText}`);
    const data = await res.json();

    return Object.fromEntries(data.locations.map((loc) => [loc.name, loc.id.toString()]));
  } catch (error) {
    console.error("Error fetching locations:", error.message);
    throw error;
  }
};

const fetchProducts = async (shop, accessToken) => {
  let nextLink = `https://${shop}/admin/api/2023-01/products.json?limit=250`;
  let products = [];

  try {
    while (nextLink) {
      const res = await fetch(nextLink, { headers: { "X-Shopify-Access-Token": accessToken } });

      if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
      const data = await res.json();
      products.push(...data.products);

      nextLink = res.headers
        .get("link")
        ?.includes('rel="next"')
        ? res
            .headers.get("link")
            .split(",")
            .find((l) => l.includes('rel="next"'))
            .split(";")[0]
            .trim()
            .slice(1, -1)
        : null;
    }

    return products.reduce((acc, p) => {
      acc[p.handle] = p.variants.reduce((map, v) => {
        map[v.sku] = v.inventory_item_id;
        return map;
      }, {});
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};

export const action = async ({ request }) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) return json({ error: "File not found" }, { status: 400 });

  try {
    const records = parse(await file.text(), { columns: true, skip_empty_lines: true });
    const shop = process.env.SHOPIFY_SHOP;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    const [locations, products] = await Promise.all([
      fetchLocations(shop, accessToken),
      fetchProducts(shop, accessToken),
    ]);

    const locationId = locations["JPaul Warehouse"];
    if (!locationId) return json({ error: "'JPaul Warehouse' location not found" }, { status: 400 });

    const { updates, errors } = records.reduce(
      (acc, product) => {
        const inventoryId = products[product.Handle]?.[product.SKU];
        const available = parseInt(product["JPaul Warehouse"], 10) || 0;

        if (!inventoryId) {
          acc.errors.push(`Product ${product.Handle} with SKU ${product.SKU} not found.`);
        } else {
          acc.updates.push(
            fetch(`https://${shop}/admin/api/2023-01/inventory_levels/set.json`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
              },
              body: JSON.stringify({ location_id: locationId, inventory_item_id: inventoryId, available }),
            })
              .then((res) =>
                !res.ok
                  ? res.json().then((body) => acc.errors.push(body.errors))
                  : null
              )
              .catch((error) =>
                acc.errors.push(`Error updating inventory for ${product.Handle}: ${error.message}`)
              )
          );
        }
        return acc;
      },
      { updates: [], errors: [] }
    );

    await Promise.all(updates);

    return json({ success: true, errors });
  } catch (error) {
    console.error("Error processing the file:", error.message);
    return json({ error: "Error processing the file" }, { status: 500 });
  }
};