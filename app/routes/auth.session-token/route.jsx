import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import React, { useEffect, useState } from "react";

export const loader = async () => {
  return json({ apiKey: process.env.SHOPIFY_API_KEY });
};

export default function SessionTokenPage() {
  const { apiKey } = useLoaderData();
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    async function initializeApp() {
      const params = new URLSearchParams(window.location.search);
      const host = params.get("host");

      if (!host) {
        console.error("Host parameter is missing");
        window.location.href = `/error?message=${encodeURIComponent("Host parameter is missing")}`;
        return;
      }

      try {
        const app = createApp({ apiKey, host });
        const token = await getSessionToken(app);
        setSessionToken(token);

        const response = await fetch("/api/session-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = "/app";
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error("Error initializing app:", err.message);
        window.location.href = `/error?message=${encodeURIComponent(err.message)}`;
      }
    }

    initializeApp();
  }, [apiKey]);

  if (!sessionToken) {
    return <div>Initializing session...</div>;
  }

  return <div>Redirecting to the app...</div>;
}
