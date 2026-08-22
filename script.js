/* ===========================================
   GAREZ STORE
   SCRIPT V2.0
=========================================== */

// ==========================
// VARIABLES
// ==========================

const carrito = [];

const botonesAgregar = document.querySelectorAll(".add-cart");

const carritoItems = document.getElementById("cart-items");

const carritoTotal = document.getElementById("cart-total");

const botonFinalizar = document.getElementById("checkout");

const notificacion = document.getElementById("notification");

const carritoPanel = document.getElementById("cart");

const botonCarrito = document.getElementById("cart-button");

const contadorCarrito = document.getElementById("cart-count");

// ==========================
// FORMATEAR PRECIO
// ==========================

function formatoPrecio(numero){

    return numero.toLocaleString("es-AR");

}

// ==========================
// MOSTRAR NOTIFICACIÓN
// ==========================

function mostrarNotificacion(texto){

    notificacion.textContent = texto;

    notificacion.classList.add("show");

    setTimeout(()=>{

        notificacion.classList.remove("show");

    },2000);

}

// ==========================
// ACTUALIZAR TOTAL
// ==========================

function actualizarTotal(){

    let total = 0;

    carrito.forEach(producto=>{

        total += producto.precio * producto.cantidad;

    });

    carritoTotal.textContent="$"+formatoPrecio(total);

}

// ==========================
// REDIBUJAR CARRITO
// ==========================

function actualizarCarrito(){

    carritoItems.innerHTML = "";

    if(carrito.length===0){

        carritoItems.innerHTML="<p>Todavía no agregaste productos.</p>";

        carritoTotal.textContent="$0";

        contadorCarrito.textContent="0";

        return;

    }

    let total = 0;

    carrito.forEach((producto,index)=>{

        total += producto.precio * producto.cantidad;

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `

            <strong>${producto.nombre}</strong>

            <br>

            Talle: ${producto.talle}

            ${producto.color ? `<br>Color: ${producto.color}` : ""}

            <br>

            Cantidad: ${producto.cantidad}

            <br>

            $${formatoPrecio(producto.precio)}

            <br><br>

            <button class="eliminar-producto"

            data-index="${index}">

            Eliminar

            </button>

            <hr>

        `;

        carritoItems.appendChild(item);

    });

    carritoTotal.textContent =
        "$" + formatoPrecio(total);

    let cantidadTotal = 0;

    carrito.forEach(producto=>{

        cantidadTotal += producto.cantidad;

    });

    contadorCarrito.textContent =
        cantidadTotal;

    document.querySelectorAll(".eliminar-producto").forEach(boton=>{

        boton.addEventListener("click",()=>{

            carrito.splice(boton.dataset.index,1);

            actualizarCarrito();

        });

    });

}

// ==========================
// AGREGAR PRODUCTOS
// ==========================

botonesAgregar.forEach(boton=>{

    boton.addEventListener("click",()=>{

        const tarjeta=boton.closest(".product-card");

        const nombre=tarjeta.dataset.name;

        const precio=parseInt(tarjeta.dataset.price);

        const talle=tarjeta.querySelector(".product-size").value;

        const selectorColor=tarjeta.querySelector(".product-color");

        const color=selectorColor ? selectorColor.value : "";

        const cantidad=parseInt(

            tarjeta.querySelector(".product-quantity").value

        );

        // ¿Ya existe ese producto?

        const existente=carrito.find(producto=>

            producto.nombre===nombre &&

            producto.talle===talle &&

            producto.color===color

        );

        if(existente){

            existente.cantidad+=cantidad;

        }else{

            carrito.push({

                id:tarjeta.dataset.id,

                nombre:nombre,

                precio:precio,

                talle:talle,

                color:color,

                cantidad:cantidad

            });

        }

        actualizarCarrito();

        mostrarNotificacion("✓ Producto agregado");

    });

});

// ==========================
// ELIMINAR PRODUCTOS
// ==========================

carritoItems.addEventListener("click",(e)=>{

    if(

        e.target.classList.contains("eliminar-producto")

    ){

        const indice=e.target.dataset.index;

        carrito.splice(indice,1);

        actualizarCarrito();

        mostrarNotificacion("Producto eliminado");

    }

});

// ==========================
// LOCAL STORAGE
// ==========================

function guardarCarrito(){

    localStorage.setItem(

        "garez-carrito",

        JSON.stringify(carrito)

    );

}

function cargarCarrito(){

    const datos = localStorage.getItem("garez-carrito");

    if(!datos) return;

    const productos = JSON.parse(datos);

    productos.forEach(producto=>{

        carrito.push(producto);

    });

    actualizarCarrito();

}

// ==========================
// GUARDAR AUTOMÁTICAMENTE
// ==========================

const actualizarCarritoOriginal = actualizarCarrito;

actualizarCarrito = function(){

    actualizarCarritoOriginal();

    guardarCarrito();

};

// ==========================
// INICIAR
// ==========================

cargarCarrito();

atualizarTodo();

function atualizarTodo(){

    actualizarCarrito();

}

//=========================
// ABRIR / CERRAR CARRITO
//=========================

botonCarrito.addEventListener("click",()=>{

    carritoPanel.classList.toggle("open");

});

//=========================
// BUSCADOR Y FILTRO
//=========================

const buscador = document.getElementById("search-product");

const filtro = document.getElementById("category-filter");

const tarjetas = document.querySelectorAll(".product-card");

function filtrarProductos(){

    const texto = buscador.value.toLowerCase();

    const categoria = filtro.value;

    tarjetas.forEach(tarjeta=>{

        const nombre = tarjeta.dataset.name.toLowerCase();

        const categoriaProducto = tarjeta.dataset.category;

        const coincideNombre = nombre.includes(texto);

        const coincideCategoria =

        categoria==="todos" ||

        categoriaProducto===categoria;

        if(coincideNombre && coincideCategoria){

            tarjeta.style.display="flex";

        }

        else{

            tarjeta.style.display="none";

        }

    });

}

buscador.addEventListener(

"input",

filtrarProductos

);

filtro.addEventListener(

"change",

filtrarProductos

);


// =========================================
// MODAL DE PRODUCTO - GAREZ
// =========================================

document.addEventListener("click", (e) => {

    // ABRIR MODAL
    const botonProducto =
        e.target.closest(".view-product");

    if (botonProducto) {

        const tarjeta =
            botonProducto.closest(".product-card");

        const modal =
            document.getElementById("product-modal");

        const modalName =
            document.getElementById("modal-name");

        const modalPrice =
            document.getElementById("modal-price");

        const modalDescription =
            document.getElementById("modal-description");

        const modalImage =
            document.getElementById("modal-product-image");

        const modalPrev =
            document.getElementById("modal-prev");

        const modalNext =
            document.getElementById("modal-next");

        if (!tarjeta || !modal) return;


        // =========================================
        // DATOS DEL PRODUCTO
        // =========================================

        const nombre =
            tarjeta.dataset.name;

        const precio =
            parseInt(tarjeta.dataset.price);


        // =========================================
        // IMAGEN PRINCIPAL
        // =========================================

        const imagen =
            tarjeta.querySelector(
                ".product-image img"
            );


        // =========================================
        // IMÁGENES DEL CARRUSEL
        // =========================================

        let imagenes = [];


        // BUZO CANGURO FRISADO
        if (
            nombre === "Buzo Canguro Frisado"
        ) {

            imagenes = [
                "assets/img/buzo-canguro-frisado3.jpg",
                "assets/img/buzo-canguro-frisado2.jpg"
            ];

        }


        // REMERAS OVERSIZE
        else if (
            nombre === "Remeras Oversize"
        ) {

            imagenes = [
                "assets/img/remeras-oversize3.jpg",
                "assets/img/remeras-oversize5.jpg",
                "assets/img/remeras-oversize4.jpg"
            ];

        }


        // JEAN BAGGY TROPA
        else if (
            nombre === "Jean Baggy Tropa"
        ) {

            imagenes = [
                "assets/img/jean-baggy-tropa2.jpg",
                "assets/img/jean-baggy-tropa3.jpg"
            ];

        }


        // CAMISETA UTOPÍA
        else if (
            nombre === "Camiseta Utopía"
        ) {

            imagenes = [
                "assets/img/camiseta-utopia4.jpg",
                "assets/img/camiseta-utopia3.jpg"
            ];

        }


        // REMERA BOXY CALIFORNIA
        else if (
            nombre === "Remera Boxy California"
        ) {

            imagenes = [
                "assets/img/remera-boxy-california3.jpg",
                "assets/img/remera-boxy-california2.jpg"
            ];

        }


        // BUZO CANGURO DARK MOON
        else if (
            nombre ===
            "Buzo Canguro Dark Moon Strass"
        ) {

            imagenes = [
                "assets/img/buzo-canguro-dark-moon-strass2.jpg"
            ];

        }


        // BERMUDAS BAGGY RIO GLITCH
        else if (
            nombre ===
            "Bermudas Baggy Rio Glitch"
        ) {

            imagenes = [
                "assets/img/bermudas-baggy-rio-glitch2.jpg"
            ];

        }


        // RESTO DE LOS PRODUCTOS
        else if (imagen) {

            imagenes = [
                imagen.src
            ];

        }


        let imagenActual = 0;


        // =========================================
        // MOSTRAR IMAGEN
        // =========================================

        function mostrarImagen() {

            if (!imagenes.length) return;

            modalImage.src =
                imagenes[imagenActual];

            modalImage.alt =
                nombre;

        }


        mostrarImagen();


        // =========================================
        // MOSTRAR / OCULTAR FLECHAS
        // =========================================

        if (imagenes.length > 1) {

            modalPrev.style.display = "flex";

            modalNext.style.display = "flex";

        } else {

            modalPrev.style.display = "none";

            modalNext.style.display = "none";

        }


        // =========================================
        // FLECHA ANTERIOR
        // =========================================

        modalPrev.onclick = () => {

            if (imagenes.length <= 1) return;

            imagenActual--;

            if (imagenActual < 0) {

                imagenActual =
                    imagenes.length - 1;

            }

            mostrarImagen();

        };


        // =========================================
        // FLECHA SIGUIENTE
        // =========================================

        modalNext.onclick = () => {

            if (imagenes.length <= 1) return;

            imagenActual++;

            if (
                imagenActual >=
                imagenes.length
            ) {

                imagenActual = 0;

            }

            mostrarImagen();

        };


        // =========================================
        // NOMBRE Y PRECIO
        // =========================================

        modalName.textContent =
            nombre;

        modalPrice.textContent =
            "$" + formatoPrecio(precio);


        // =========================================
        // DESCRIPCIONES
        // =========================================

        const descripciones = {

            "Remera Boxy California":
                "Remera boxy de calce amplio, cómoda y versátil para todos los días.",

            "Buzo Canguro Frisado":
                "Buzo canguro frisado, cómodo y abrigado, ideal para acompañar tus looks.",

            "Buzo Canguro Dark Moon Strass":
                "Buzo canguro de estilo urbano con detalles de strass y diseño Dark Moon.",

            "Jean Baggy Tropa":
                "Jean baggy de calce relajado, pensado para un estilo urbano y cómodo.",

            "Remeras Oversize":
                "Remera oversize de calce amplio y cómodo, pensada para un estilo urbano.",

            "Bermudas Baggy Rio Glitch":
                "Bermuda baggy de calce cómodo, con un diseño urbano y moderno.",

            "Baby Tee São Paulo":
                "Baby tee de calce corto y cómodo, inspirada en un estilo urbano y moderno.",

            "Bolsa Bahia Bag":
                "Bolsa de diseño GAREZ, práctica y versátil para acompañar tus looks.",

            "Bolsa Medusa Mar":
                "Bolsa de diseño GAREZ, cómoda y versátil para completar tu estilo.",

            "Camiseta Utopía":
                "Camiseta de diseño GAREZ, cómoda y versátil para crear distintos looks.",

            "Headpiece Raio de Sol":
                "Headpiece de diseño GAREZ, pensado para darle un toque único a tu look.",

            "Jean Baggy Strass":
                "Jean baggy de calce relajado con detalles de strass para destacar tu look."

        };


        modalDescription.textContent =
            descripciones[nombre] ||
            "Una prenda GAREZ pensada para formar parte de tu estilo.";


        // =========================================
        // ABRIR MODAL
        // =========================================

        modal.classList.add("active");

        return;

    }


    // =========================================
    // CERRAR CON LA X
    // =========================================

    if (
        e.target.closest("#close-modal")
    ) {

        const modal =
            document.getElementById(
                "product-modal"
            );

        modal.classList.remove("active");

        return;

    }


    // =========================================
    // CERRAR TOCANDO FUERA
    // =========================================

    if (
        e.target.id === "product-modal"
    ) {

        e.target.classList.remove(
            "active"
        );

    }

});

        

// =========================================
// FUNCIONES DEL MODAL DE PRODUCTO
// =========================================

let tarjetaModalActual = null;


// =========================================
// ABRIR PRODUCTO Y GUARDAR TARJETA
// =========================================

document.addEventListener("click", (e) => {

    const botonProducto = e.target.closest(".view-product");

    if (!botonProducto) return;

    tarjetaModalActual =
        botonProducto.closest(".product-card");

});


// =========================================
// SELECCIONAR TALLE
// =========================================

document.addEventListener("click", (e) => {

    const talle = e.target.closest(".sizes span");

    if (!talle) return;

    document.querySelectorAll(".sizes span").forEach((otroTalle) => {

        otroTalle.classList.remove("selected");

    });

    talle.classList.add("selected");

});


// =========================================
// AGREGAR AL CARRITO DESDE EL MODAL
// =========================================

document.addEventListener("click", (e) => {

    const botonAgregar =
        e.target.closest("#modal-add-cart");

    if (!botonAgregar) return;


    // Verificamos que haya un producto abierto
    if (!tarjetaModalActual) {

        mostrarNotificacion(
            "No se pudo identificar el producto"
        );

        return;

    }


    // =========================================
    // TALLE
    // =========================================

    const talleSeleccionado =
        document.querySelector(
            ".sizes span.selected"
        );


    if (!talleSeleccionado) {

        mostrarNotificacion(
            "Seleccioná un talle"
        );

        return;

    }


    const talle =
        talleSeleccionado.textContent.trim();


    // =========================================
    // DATOS DEL PRODUCTO
    // =========================================

    const nombre =
        tarjetaModalActual.dataset.name;


    const precio =
        parseInt(
            tarjetaModalActual.dataset.price
        );


    const id =
        tarjetaModalActual.dataset.id;


    // =========================================
    // COLOR
    // =========================================

    const selectorColor =
        tarjetaModalActual.querySelector(
            ".product-color"
        );


    const color =
        selectorColor
            ? selectorColor.value
            : "";


    // =========================================
    // CANTIDAD
    // =========================================

    const selectorCantidad =
        tarjetaModalActual.querySelector(
            ".product-quantity"
        );


    const cantidad =
        selectorCantidad
            ? parseInt(selectorCantidad.value)
            : 1;


    // =========================================
    // COMPROBAR SI YA EXISTE
    // =========================================

    const existente =
        carrito.find(producto =>

            producto.nombre === nombre &&
            producto.talle === talle &&
            producto.color === color

        );


    if (existente) {

        existente.cantidad += cantidad;

    } else {

        carrito.push({

            id: id,

            nombre: nombre,

            precio: precio,

            talle: talle,

            color: color,

            cantidad: cantidad

        });

    }


    // =========================================
    // ACTUALIZAR CARRITO
    // =========================================

    actualizarCarrito();


    mostrarNotificacion(
        "✓ Producto agregado"
    );


    // =========================================
    // CERRAR MODAL
    // =========================================

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

});


// =========================================
// ABRIR GUÍA DE TALLES
// =========================================

document.addEventListener("click", (e) => {

    const botonGuia =
        e.target.closest("#size-guide-btn");

    if (!botonGuia) return;

    const guia =
        document.getElementById("size-guide-modal");

    if (!guia) {

        mostrarNotificacion("No se encontró la guía de talles");

        return;

    }

    guia.classList.add("active");

});


// =========================================
// CERRAR GUÍA DE TALLES
// =========================================

document.addEventListener("click", (e) => {

    const botonCerrar =
        e.target.closest("#close-size-guide");

    if (!botonCerrar) return;

    const guia =
        document.getElementById("size-guide-modal");

    if (guia) {

        guia.classList.remove("active");

    }

});


// =========================================
// CERRAR GUÍA TOCANDO AFUERA
// =========================================

document.addEventListener("click", (e) => {

    const guia = e.target;

    if (guia.id !== "size-guide-modal") return;

    guia.classList.remove("active");

});

// =========================================
// FAVORITOS — GAREZ
// =========================================

// Recuperar favoritos guardados
let favoritos = JSON.parse(
    localStorage.getItem("garez-favoritos")
) || [];


// =========================================
// ACTUALIZAR VISUAL DE FAVORITOS
// =========================================

function actualizarFavoritos(){

    document.querySelectorAll(".product-card").forEach(tarjeta=>{

        const id = tarjeta.dataset.id;

        const boton = tarjeta.querySelector(".favorite-btn");

        if(!boton) return;


        if(favoritos.includes(id)){

            boton.classList.add("active");

            boton.textContent = "♥";

            boton.setAttribute(
                "aria-label",
                "Quitar de favoritos"
            );

        }else{

            boton.classList.remove("active");

            boton.textContent = "♡";

            boton.setAttribute(
                "aria-label",
                "Agregar a favoritos"
            );

        }

    });

}


// =========================================
// CLIC EN FAVORITO
// =========================================

document.addEventListener("click",(e)=>{

    const boton =
        e.target.closest(".favorite-btn");

    if(!boton) return;


    const tarjeta =
        boton.closest(".product-card");

    if(!tarjeta) return;


    const id =
        tarjeta.dataset.id;


    // Si ya es favorito, quitarlo
    if(favoritos.includes(id)){

        favoritos =
            favoritos.filter(favorito => favorito !== id);

        mostrarNotificacion(
            "♡ Producto quitado de favoritos"
        );

    }

    // Si no es favorito, agregarlo
    else{

        favoritos.push(id);

        mostrarNotificacion(
            "♥ Producto agregado a favoritos"
        );

    }


    // Guardar
    localStorage.setItem(
        "garez-favoritos",
        JSON.stringify(favoritos)
    );


    // Actualizar corazones
    actualizarFavoritos();

});


// =========================================
// CARGAR FAVORITOS AL INICIAR
// =========================================

actualizarFavoritos();

// =========================================
// CHECKOUT — GAREZ
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // ELEMENTOS DEL CHECKOUT
    // =========================================

    const checkoutModal =
        document.getElementById("checkout-modal");

    const closeCheckout =
        document.getElementById("close-checkout");

    const checkoutProducts =
        document.getElementById("checkout-products");

    const checkoutSubtotal =
        document.getElementById("checkout-subtotal");

    const checkoutShipping =
        document.getElementById("checkout-shipping");

    const checkoutTotal =
        document.getElementById("checkout-total");


    // =========================================
    // COMPROBAR ELEMENTOS
    // =========================================

    if (
        !checkoutModal ||
        !closeCheckout ||
        !checkoutProducts ||
        !checkoutSubtotal ||
        !checkoutShipping ||
        !checkoutTotal
    ) {

        console.error(
            "Error: faltan elementos del checkout en el HTML."
        );

        return;

    }


    // =========================================
    // ABRIR CHECKOUT
    // =========================================

    botonFinalizar.addEventListener("click", () => {

        if (carrito.length === 0) {

            mostrarNotificacion(
                "El carrito está vacío"
            );

            return;

        }

        actualizarCheckout();

        checkoutModal.classList.add("active");

    });


    // =========================================
    // CERRAR CHECKOUT
    // =========================================

    closeCheckout.addEventListener("click", () => {

        checkoutModal.classList.remove("active");

    });


    // =========================================
    // CERRAR TOCANDO AFUERA
    // =========================================

    checkoutModal.addEventListener("click", (e) => {

        if (e.target === checkoutModal) {

            checkoutModal.classList.remove("active");

        }

    });


    // =========================================
// ACTUALIZAR CHECKOUT
// =========================================

function actualizarCheckout(){

    checkoutProducts.innerHTML = "";

    let subtotal = 0;


    // =========================================
    // PRODUCTOS
    // =========================================

    carrito.forEach((producto) => {

        const item =
            document.createElement("div");

        item.className =
            "checkout-product";


        const importe =
            producto.precio *
            producto.cantidad;


        subtotal += importe;


        item.innerHTML = `

            <div class="checkout-product-info">

                <strong>
                    ${producto.nombre}
                </strong>

                <span>
                    Talle: ${producto.talle}
                </span>

                ${
                    producto.color
                    ? `<span>Color: ${producto.color}</span>`
                    : ""
                }

                <span>
                    Cantidad: ${producto.cantidad}
                </span>

            </div>


            <strong>

                $${formatoPrecio(importe)}

            </strong>

        `;


        checkoutProducts.appendChild(item);

    });


    // =========================================
    // SUBTOTAL
    // =========================================

    checkoutSubtotal.textContent =
        "$" + formatoPrecio(subtotal);


    // =========================================
    // RECUPERAR ENVÍO ACTUAL
    // =========================================

    const precioEnvio =
        Number(
            checkoutModal.dataset.shippingPrice || 0
        );


    // =========================================
    // MOSTRAR ENVÍO
    // =========================================

    if (precioEnvio > 0) {

        checkoutShipping.textContent =
            "$" + formatoPrecio(precioEnvio);

    }

    else {

        checkoutShipping.textContent =
            "A calcular";

    }


    // =========================================
    // TOTAL
    // =========================================

    const total =
        subtotal + precioEnvio;


    checkoutTotal.textContent =
        "$" + formatoPrecio(total);

}

// =========================================
// CALCULAR ENVÍO — GAREZ
// =========================================

const botonCalcularEnvio =
    document.getElementById("calculate-shipping");


botonCalcularEnvio.addEventListener("click", () => {

    // =====================================
    // BUSCAR LA OPCIÓN SELECCIONADA
    // =====================================

    const envioSeleccionado =
        document.querySelector(
            'input[name="shipping"]:checked'
        );


    // =====================================
    // SI NO SE SELECCIONÓ NADA
    // =====================================

    if (!envioSeleccionado) {

        mostrarNotificacion(
            "Seleccioná un método de envío"
        );

        return;

    }


    // =====================================
    // OBTENER PRECIO DEL ENVÍO
    // =====================================

    const precioEnvio =
        Number(envioSeleccionado.dataset.price);


    // =====================================
    // OBTENER SUBTOTAL
    // =====================================

    const subtotalTexto =
        checkoutSubtotal.textContent
            .replace("$", "")
            .replace(/\./g, "")
            .replace(",", ".");


    const subtotal =
        Number(subtotalTexto) || 0;


    // =====================================
    // CALCULAR TOTAL
    // =====================================

    const total =
        subtotal + precioEnvio;


    // =====================================
    // MOSTRAR ENVÍO
    // =====================================

    checkoutShipping.textContent =
        "$" + formatoPrecio(precioEnvio);


    // =====================================
    // MOSTRAR TOTAL
    // =====================================

    checkoutTotal.textContent =
        "$" + formatoPrecio(total);


    // =====================================
    // NOTIFICACIÓN
    // =====================================

    mostrarNotificacion(
        "✓ Envío calculado"
    );

});

});

// =========================================
// CHECKOUT — MÉTODO DE ENVÍO
// =========================================

const opcionesEnvio =
    document.querySelectorAll('input[name="shipping"]');


// =========================================
// SELECCIONAR MÉTODO DE ENVÍO
// =========================================

opcionesEnvio.forEach(opcion => {

    opcion.addEventListener("change", () => {

        // Quitar selección visual anterior
        document
            .querySelectorAll(".shipping-option")
            .forEach(opcionVisual => {

                opcionVisual.classList.remove("selected");

            });


        // Marcar la opción seleccionada
        const opcionActual =
            opcion.closest(".shipping-option");

        if(opcionActual){

            opcionActual.classList.add("selected");

        }


        // Obtener precio del envío
        const precioEnvio =
            parseInt(opcion.dataset.price) || 0;


        // Calcular subtotal
        let subtotal = 0;

        carrito.forEach(producto => {

            subtotal +=
                producto.precio * producto.cantidad;

        });


        // Actualizar envío
        if(precioEnvio > 0){

            checkoutShipping.textContent =
                "$" + formatoPrecio(precioEnvio);

        }else{

            checkoutShipping.textContent =
                "A calcular";

        }


        // Actualizar total
        const total =
            subtotal + precioEnvio;

        checkoutTotal.textContent =
            "$" + formatoPrecio(total);

    });

});

// =========================================
// ACTUALIZAR ENVÍO AL ABRIR EL CHECKOUT
// =========================================

function actualizarMetodoEnvio(){

    const seleccionado =
        document.querySelector(
            'input[name="shipping"]:checked'
        );

    if(!seleccionado){

        checkoutShipping.textContent =
            "A calcular";

        let subtotal = 0;

        carrito.forEach(producto => {

            subtotal +=
                producto.precio * producto.cantidad;

        });

        checkoutTotal.textContent =
            "$" + formatoPrecio(subtotal);

        return;

    }


    const precioEnvio =
        parseInt(seleccionado.dataset.price) || 0;


    if(precioEnvio > 0){

        checkoutShipping.textContent =
            "$" + formatoPrecio(precioEnvio);

    }else{

        checkoutShipping.textContent =
            "A calcular";

    }


    let subtotal = 0;

    carrito.forEach(producto => {

        subtotal +=
            producto.precio * producto.cantidad;

    });


    checkoutTotal.textContent =
        "$" + formatoPrecio(
            subtotal + precioEnvio
        );

}

// =========================================
// PAGO — GAREZ
// =========================================

document.addEventListener("click", function(e) {

    const botonPago =
        e.target.closest("#continue-payment");

    if (!botonPago) {
        return;
    }


    // =====================================
    // AVISO DE ERROR
    // =====================================

    const checkoutError =
        document.getElementById("checkout-error");


    // =====================================
    // DATOS PERSONALES
    // =====================================

    const nombre =
        document.getElementById("checkout-name")?.value.trim() || "";

    const apellido =
        document.getElementById("checkout-lastname")?.value.trim() || "";

    const email =
        document.getElementById("checkout-email")?.value.trim() || "";

    const telefono =
        document.getElementById("checkout-phone")?.value.trim() || "";


    // =====================================
    // DATOS DE ENVÍO
    // =====================================

    const direccion =
        document.getElementById("checkout-address")?.value.trim() || "";

    const localidad =
        document.getElementById("checkout-city")?.value.trim() || "";

    const provincia =
        document.getElementById("checkout-province")?.value || "";

    const codigoPostal =
        document.getElementById("checkout-postal")?.value.trim() || "";


    // =====================================
    // MÉTODO DE ENVÍO
    // =====================================

    const envioSeleccionado =
        document.querySelector(
            'input[name="shipping"]:checked'
        );


    // =====================================
    // VALIDAR DATOS
    // =====================================

    if (
        !nombre ||
        !apellido ||
        !email ||
        !telefono ||
        !direccion ||
        !localidad ||
        !provincia ||
        !codigoPostal ||
        !envioSeleccionado
    ) {

        if (checkoutError) {

            checkoutError.textContent =
                "Completá todos los campos y seleccioná un método de envío.";

            checkoutError.classList.add("active");

        }

        return;
    }


    // =====================================
    // OCULTAR ERROR
    // =====================================

    if (checkoutError) {

        checkoutError.classList.remove("active");

    }


    // =====================================
    // CALCULAR SUBTOTAL
    // =====================================

    let subtotal = 0;

    carrito.forEach(producto => {

        subtotal +=
            producto.precio * producto.cantidad;

    });


    // =====================================
    // CALCULAR ENVÍO
    // =====================================

    let precioEnvio = 0;


    if (envioSeleccionado.value === "flex-sur") {

        precioEnvio = 6500;

    }

    else if (envioSeleccionado.value === "flex-caba") {

        precioEnvio = 8000;

    }

    else if (envioSeleccionado.value === "correo-bsas") {

        precioEnvio = 8000;

    }

    else if (envioSeleccionado.value === "correo-resto") {

        precioEnvio = 12500;

    }

    else if (envioSeleccionado.value === "correo") {

        if (
            provincia === "Buenos Aires" ||
            provincia === "Ciudad Autónoma de Buenos Aires"
        ) {

            precioEnvio = 8000;

        } else {

            precioEnvio = 12500;

        }

    }


    // =====================================
    // TOTAL
    // =====================================

    const total =
        subtotal + precioEnvio;


    // =====================================
// GUARDAR PEDIDO
// =====================================

const pedido = {

    cliente: {

        nombre,
        apellido,
        email,
        telefono

    },

    envio: {

        direccion,
        localidad,
        provincia,
        codigoPostal,

        metodo:
            envioSeleccionado.value,

        precio:
            precioEnvio

    },

    productos:
        carrito.map(producto => ({

            id: producto.id,
            nombre: producto.nombre,
            talle: producto.talle,
            color: producto.color || "",
            cantidad: producto.cantidad,
            precio: producto.precio

        })),

    subtotal,
    total

};


localStorage.setItem(
    "garez-pedido",
    JSON.stringify(pedido)
);


// =====================================
// PREPARAR EMAIL
// =====================================

const productosPedido =
    carrito.map(producto => {

        return (
            "- " +
            producto.nombre +
            " | Talle: " +
            (producto.talle || "No corresponde") +
            (
                producto.color
                ? " | Color: " + producto.color
                : ""
            ) +
            " | Cantidad: " +
            producto.cantidad +
            " | Precio: $" +
            formatoPrecio(producto.precio) +
            " | Importe: $" +
            formatoPrecio(
                producto.precio *
                producto.cantidad
            )
        );

    }).join("\n");


// =====================================
// ASUNTO
// =====================================

const asunto =
    "NUEVO PEDIDO GAREZ";


// =====================================
// CUERPO DEL EMAIL
// =====================================

const cuerpo = `NUEVO PEDIDO GAREZ

================================
DATOS DEL CLIENTE
================================

Nombre: ${nombre}
Apellido: ${apellido}
Email: ${email}
Teléfono: ${telefono}


================================
DATOS DE ENVÍO
================================

Dirección: ${direccion}
Localidad: ${localidad}
Provincia: ${provincia}
Código postal: ${codigoPostal}

Método de envío: ${envioSeleccionado.value}


================================
PRODUCTOS
================================

${productosPedido}


================================
RESUMEN
================================

Subtotal: $${formatoPrecio(subtotal)}
Envío: $${formatoPrecio(precioEnvio)}

TOTAL: $${formatoPrecio(total)}


================================
ESTADO
================================

Pendiente de pago.
Verificar el pago en Mercado Pago.
`;

// =====================================
// ABRIR GMAIL Y MERCADO PAGO
// =====================================

const enlaceGmail =
    "https://mail.google.com/mail/?view=cm" +
    "&to=tiendagarez@gmail.com" +
    "&su=" +
    encodeURIComponent(asunto) +
    "&body=" +
    encodeURIComponent(cuerpo);


// =====================================
// ABRIR GMAIL
// =====================================

window.open(
    enlaceGmail,
    "_blank"
);


// =====================================
// ABRIR MERCADO PAGO
// =====================================

setTimeout(() => {

    window.open(
        "https://link.mercadopago.com.ar/tiendagarez",
        "_blank"
    );

}, 500);

});
    

// =========================================
// FLEX GAREZ — DESPLEGABLE
// =========================================

const toggleFlex =
    document.getElementById("toggle-flex");

const flexOptions =
    document.getElementById("flex-options");


toggleFlex.addEventListener("click", () => {

    flexOptions.classList.toggle("active");

});

// =========================================
// CALCULAR ENVÍO
// =========================================

const botonCalcularEnvio =
    document.getElementById("calculate-shipping");


botonCalcularEnvio.addEventListener("click", () => {

    const seleccionado =
        document.querySelector(
            'input[name="shipping"]:checked'
        );


    if (!seleccionado) {

        mostrarNotificacion(
            "Seleccioná un método de envío"
        );

        return;

    }


    // =========================================
    // PRECIO DEL ENVÍO
    // =========================================

    let precioEnvio =
        parseInt(
            seleccionado.dataset.price
        ) || 0;


    // =========================================
    // CORREO ARGENTINO
    // =========================================

    if (seleccionado.value === "correo") {

        const provincia =
            document.getElementById(
                "checkout-province"
            ).value;


        if (!provincia) {

            mostrarNotificacion(
                "Seleccioná tu provincia primero"
            );

            return;

        }


        if (
            provincia === "Buenos Aires" ||
            provincia ===
            "Ciudad Autónoma de Buenos Aires"
        ) {

            precioEnvio = 8000;

        } else {

            precioEnvio = 12500;

        }

    }


    // =========================================
    // VERIFICAR PRECIO
    // =========================================

    if (precioEnvio <= 0) {

        mostrarNotificacion(
            "Este método todavía no está disponible"
        );

        return;

    }


    // =========================================
    // CALCULAR SUBTOTAL
    // =========================================

    let subtotal = 0;

    carrito.forEach(producto => {

        subtotal +=
            producto.precio *
            producto.cantidad;

    });


    // =========================================
    // TOTAL
    // =========================================

    const total =
        subtotal + precioEnvio;


    // =========================================
    // ACTUALIZAR CHECKOUT
    // =========================================

    checkoutShipping.textContent =
        "$" + formatoPrecio(precioEnvio);


    checkoutTotal.textContent =
        "$" + formatoPrecio(total);


    mostrarNotificacion(
        "✓ Envío calculado"
    );

});

// =========================================
// SELECCIÓN DE COLOR — GAREZ
// =========================================

document.addEventListener("click", function (e) {

    const botonColor = e.target.closest(".color-option");

    if (!botonColor) {
        return;
    }

    const grupoColores =
        botonColor.closest(".product-colors");

    if (!grupoColores) {
        return;
    }

    // Evitar que el botón active otras funciones
    e.preventDefault();
    e.stopPropagation();

    // Quitar selección de todos los colores
    const botones =
        grupoColores.querySelectorAll(".color-option");

    botones.forEach(function (boton) {

        boton.style.setProperty(
            "background-color",
            "#fff",
            "important"
        );

        boton.style.setProperty(
            "color",
            "#111",
            "important"
        );

        boton.style.setProperty(
            "border-color",
            "#ddd",
            "important"
        );

        boton.classList.remove("active");

    });

    // Seleccionar el color presionado
    botonColor.classList.add("active");

    // Forzar visualmente el estado seleccionado
    botonColor.style.setProperty(
        "background-color",
        "#111",
        "important"
    );

    botonColor.style.setProperty(
        "color",
        "#fff",
        "important"
    );

    botonColor.style.setProperty(
        "border-color",
        "#111",
        "important"
    );

});
