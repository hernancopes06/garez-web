import json
import os
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):

    def do_GET(self):

        api_key = os.environ.get("RESEND_API_KEY")

        if not api_key:
            self.responder(
                500,
                {
                    "ok": False,
                    "error": "Falta RESEND_API_KEY"
                }
            )
            return

        datos = {
            "from": "onboarding@resend.dev",
            "to": ["delivered@resend.dev"],
            "subject": "Prueba de email GAREZ",
            "html": """
                <h1>GAREZ</h1>

                <p>
                    Si estás viendo este correo,
                    Resend está funcionando correctamente.
                </p>

                <p>
                    Esta es una prueba del sistema
                    de notificaciones de pedidos.
                </p>
            """
        }

        payload = json.dumps(datos).encode("utf-8")

        request = urllib.request.Request(
            "https://api.resend.com/emails",
            data=payload,
          headers={
    "Authorization": "Bearer {}".format(api_key),
    "Content-Type": "application/json",
    "User-Agent": "GAREZ-Web/1.0"
},
            method="POST"
        )

        try:

            with urllib.request.urlopen(
                request,
                timeout=10
            ) as response:

                respuesta = response.read().decode("utf-8")

                self.responder(
                    200,
                    {
                        "ok": True,
                        "resend": json.loads(respuesta)
                    }
                )

        except urllib.error.HTTPError as error:

            detalle = error.read().decode("utf-8")

            print("Error Resend:", detalle)

            self.responder(
                error.code,
                {
                    "ok": False,
                    "error": "Resend rechazó la petición",
                    "status": error.code,
                    "detalle": detalle
                }
            )

        except Exception as error:

            print("Error enviando email:", error)

            self.responder(
                500,
                {
                    "ok": False,
                    "error": "No se pudo enviar el email",
                    "detalle": str(error)
                }
            )

    def responder(self, status, cuerpo):

        payload = json.dumps(cuerpo).encode("utf-8")

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json"
        )

        self.send_header(
            "Content-Length",
            str(len(payload))
        )

        self.end_headers()

        self.wfile.write(payload)

        "User-Agent": "GAREZ-Web/1.0"