import json
import os

import mercadopago


def handler(request):
    """
    Crea una preferencia de Mercado Pago para GAREZ.
    """

    # Solo aceptamos POST
    if request.method != "POST":
        return {
            "statusCode": 405,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "error": "Método no permitido"
            })
        }

    try:
        # =========================================
        # ACCESS TOKEN
        # =========================================

        access_token = os.environ.get(
            "MP_ACCESS_TOKEN"
        )

        if not access_token:
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "error": "Falta configurar MP_ACCESS_TOKEN"
                })
            }

        # =========================================
        # RECIBIR DATOS DEL FRONTEND
        # =========================================

        data = request.get_json()

        if not data:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "error": "No se recibieron datos"
                })
            }

        productos = data.get("productos", [])
        envio = float(data.get("envio", 0))

        if not productos:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "error": "El carrito está vacío"
                })
            }

        # =========================================
        # CREAR ITEMS
        # =========================================

        items = []

        for producto in productos:

            nombre = str(
                producto.get("nombre", "Producto GAREZ")
            )

            precio = float(
                producto.get("precio", 0)
            )

            cantidad = int(
                producto.get("cantidad", 1)
            )

            talle = producto.get("talle", "")
            color = producto.get("color", "")

            descripcion = ""

            if talle:
                descripcion += f"Talle: {talle}"

            if color:
                if descripcion:
                    descripcion += " | "

                descripcion += f"Color: {color}"

            items.append({
                "title": nombre,
                "description": descripcion,
                "quantity": cantidad,
                "unit_price": precio,
                "currency_id": "ARS"
            })

        # =========================================
        # AGREGAR ENVÍO
        # =========================================

        if envio > 0:

            items.append({
                "title": "Envío GAREZ",
                "description": "Costo de envío",
                "quantity": 1,
                "unit_price": envio,
                "currency_id": "ARS"
            })

        # =========================================
        # DATOS DEL COMPRADOR
        # =========================================

        comprador = data.get(
            "comprador",
            {}
        )

        email = comprador.get(
            "email",
            ""
        )

        # =========================================
        # CREAR PREFERENCIA
        # =========================================

        sdk = mercadopago.SDK(
            access_token
        )

        preference_data = {

            "items": items,

            "payer": {
                "email": email
            },

            "back_urls": {

                "success":
                    "https://www.tiendagarez.com.ar/",

                "failure":
                    "https://www.tiendagarez.com.ar/",

                "pending":
                    "https://www.tiendagarez.com.ar/"
            },

            "auto_return": "approved",

            "external_reference":
                "GAREZ-PEDIDO",

            "statement_descriptor":
                "GAREZ"
        }

        # =========================================
        # ENVIAR A MERCADO PAGO
        # =========================================

        result = sdk.preference().create(
            preference_data
        )

        response = result.get(
            "response",
            {}
        )

        init_point = response.get(
            "init_point"
        )

        if not init_point:

            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "error":
                        "Mercado Pago no devolvió el link de pago.",
                    "response": response
                })
            }

        # =========================================
        # DEVOLVER LINK AL FRONTEND
        # =========================================

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "init_point": init_point
            })
        }

    except Exception as error:

        print(
            "Error creando preferencia:",
            error
        )

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "error":
                    "Error interno al crear el pago."
            })
        }