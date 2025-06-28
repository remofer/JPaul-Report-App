import '@shopify/shopify-api/adapters/node';
import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
  throw new Error("SHOPIFY_API_KEY and SHOPIFY_API_SECRET must be defined in environment variables.");
}

if (!process.env.HOST) {
  throw new Error("HOST must be defined in environment variables.");
}

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.April25, // Última versión soportada
  scopes: process.env.SCOPES?.split(","),
  hostName: process.env.HOST.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.April25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;

export const login = async (request, shop, redirectUri, isOnline) => {
  const authUrl = await shopify.auth.begin({
    shop,
    callbackPath: redirectUri || "/auth/callback",
    isOnline: isOnline || false,
  });
  // Asegúrate que authUrl es string
  console.log("Auth URL from login:", authUrl);
  return authUrl;
};
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
