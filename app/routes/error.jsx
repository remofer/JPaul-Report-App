import { useSearchParams } from "@remix-run/react";

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("message") || "An unexpected error occurred.";

  return (
    <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#f8d7da", color: "#721c24" }}>
      <h1>Error</h1>
      <p>{errorMessage}</p>
      <a href="/" style={{ color: "#004085", textDecoration: "underline" }}>
        Go back to the homepage
      </a>
    </div>
  );
}
