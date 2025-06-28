// app/routes/auth.jsx
import shopify from "../shopify.server";
import { redirect } from "@remix-run/node";

export const action = async ({ request }) => {
    const formData = await request.formData();
    const shop = formData.get("shop");
  
    if (!shop || !shop.endsWith(".myshopify.com")) {
      return { errors: { shop: "Please enter a valid Shopify domain (e.g., example.myshopify.com)." } };
    }
  
    try {
        const authUrl = await shopify.auth.begin({
          shop,
          callbackPath: "/auth/callback",
          isOnline: false,
          rawRequest: request,
          rawResponse: undefined,
        });
        return redirect(authUrl);
      } catch (error) {
        console.error("Error during OAuth process:", error);
        console.log("Shopify instance:", shopify);
        console.log("Shopify auth methods:", shopify.auth);
        console.log("Environment Variables:", {
            SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
            SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
            HOST: process.env.HOST,
            SCOPES: process.env.SCOPES,
          });                
        return { errors: { shop: `Authentication failed. Error: ${error.message}` } };
      }
  };  
