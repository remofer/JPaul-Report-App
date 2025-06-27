import { json } from "@remix-run/node";

export async function loader({ request }) {
  // Si esta ruta es para API, usualmente no es GET, 
  // podrías querer usar action para POST

  // Pero si necesitas aceptar GET:
  return json({ message: "API callback GET no implementado" }, { status: 404 });
}

export async function action({ request }) {
  // Aquí podrías recibir POST del callback
  // Procesa y devuelve respuesta adecuada

  return json({ success: true });
}

export default function ApiAuthCallback() {
  return <div>API Callback</div>;
}
