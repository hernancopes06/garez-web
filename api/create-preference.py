import json
import os

from http.server import BaseHTTPRequestHandler

import mercadopago


# =========================================
# CONSTRUIR LA PREFERENCIA
# =========================================

def crear_preferencia(data):
    """
    Recibe el JSON del frontend y devuelve
    (status, cuerpo) para responder.
    """

    access_token = os.environ.get("MP_ACCESS_TOKEN")

    if not access_token:
        return 500, {
            "error": "Falta configurar MP_ACCESS_TOKEN"
        }

    if not data:
        return 400, {
            "error": "No se recibieron datos"
        }

    productos = data.get("productos", [])
    envio = float(data.get("envio", 0))

    if not productos:
        return 400, {
            "error": "El carrito está vacío"
        }

    # =====================================
    # ITEMS
    # =====================================

    items = []

    for producto in productos:

        nombre = str(
            producto.get("nombre", "Producto GAREZ")
        )

        precio = float(producto.get("precio", 0))
        cantidad = int(producto.get("cantidad", 1))

        talle = producto.get("talle", "")
        color = producto.get("color", "")

        descripcion = ""

        if talle:
            descripcion += "Talle: {}".format(talle)

        if color:

            if descripcion:
                descripcion += " | "

            descripcion += "Color: {}".format(color)

        items.append({
            "title": nombre,
            "description": descripcion,
            "quantity": cantidad,
            "unit_price": precio,
            "currency_id": "ARS"
        })

    # =====================================
    # ENVÍO
    # =====================================

    if envio > 0:

        items.append({
            "title": "Envío GAREZ",
            "description": "Costo de envío",
            "quantity": 1,
            "unit_price": envio,
            "currency_id": "ARS"
        })

    # =====================================
    # COMPRADOR
    # =====================================

    comprador = data.get("comprador", {})
    email = comprador.get("email", "")

    # =====================================
    # PREFERENCIA
    # =====================================

    sdk = mercadopago.SDK(access_token)

    preference_data = {

        "items": items,

        "payer": {
            "email": email
        },

        "back_urls": {
            "success": "https://www.tiendagarez.com.ar/",
            "failure": "https://www.tiendagarez.com.ar/",
            "pending": "https://www.tiendagarez.com.ar/"
        },

        "auto_return": "approved",

        "external_reference": "GAREZ-PEDIDO",

        "statement_descriptor": "GAREZ"
    }

    result = sdk.preference().create(preference_data)

    response = result.get("response", {}) or {}

    init_point = response.get("init_point")

    if not init_point:

        return 500, {
            "error": "Mercado Pago no devolvió el link de pago.",
            "detalle": response
        }

    return 200, {
        "init_point": init_point
    }


# =========================================
# HANDLER DE VERCEL
# =========================================

class handler(BaseHTTPRequestHandler):

    def _responder(self, status, cuerpo):

        payload = json.dumps(cuerpo).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self):

        try:

            largo = int(
                self.headers.get("Content-Length") or 0
            )

            crudo = self.rfile.read(largo) if largo else b""

            data = json.loads(crudo) if crudo else {}

        except Exception:

            self._responder(400, {
                "error": "JSON inválido"
            })

            return

        try:

            status, cuerpo = crear_preferencia(data)

            self._responder(status, cuerpo)

        except Exception as error:

            print("Error creando preferencia:", error)

            self._responder(500, {
                "error": "Error interno al crear el pago."
            })

    def do_GET(self):

        self._responder(405, {
            "error": "Método no permitido"
        })
