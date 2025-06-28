import { json } from "@remix-run/node";

export async function loader() {
  return json({ message: "Método GET no soportado" }, { status: 405 });
}

export async function action({ request }) {
  try {
    const body = await request.json();
    console.log("Datos recibidos en API callback:", body);

    // Procesa los datos según sea necesario

    return json({ success: true });
  } catch (error) {
    console.error("Error en API callback:", error);
    return json({ error: "Error procesando el callback" }, { status: 500 });
  }
}

export default function ApiAuthCallback() {
  return <div>API Callback</div>;
}
