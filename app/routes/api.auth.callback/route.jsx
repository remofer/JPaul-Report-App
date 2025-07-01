import { json } from "@remix-run/node";

export async function loader() {
  return json({ message: "GET method not supported" }, { status: 405 });
}

export async function action({ request }) {
  try {
    const body = await request.json();
    console.log("Data received in API callback:", body);

    return json({ success: true });
  } catch (error) {
    console.error("Error in API callback:", error);
    return json({ error: "Error processing callback" }, { status: 500 });
  }
}

export default function ApiAuthCallback() {
  return <div>API Callback</div>;
}
