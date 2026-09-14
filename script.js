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

        carritoItems.innerHTML =
            '<p class="cart-empty">Todavía no agregaste productos.</p>';

        carritoTotal.textContent = "$0";

        contadorCarrito.textContent = "0";

        actualizarEstadoCarrito();

        guardarCarrito();

        return;

    }

    let total = 0;

    carrito.forEach((producto,index)=>{

        total += producto.precio * producto.cantidad;

        const item = document.createElement("div");

        item.className = "cart-item";


        // Los accesorios no tienen talle: sin este chequeo
        // aparecia "Talle:" vacio.

        const detalles = [];

        if (producto.talle) {

            // Hay un producto cuyo talle ya se llama "Talle único":
            // sin esto salia "Talle Talle único".
            detalles.push(
                /talle/i.test(producto.talle)
                    ? producto.talle
                    : "Talle " + producto.talle
            );

        }

        if (producto.color) {
            detalles.push(producto.color);
        }


        const miniatura =
            producto.imagen
                ? `<img src="${producto.imagen}" alt="" loading="lazy">`
                : "";


        item.innerHTML = `

            <div class="cart-item-img">
                ${miniatura}
            </div>

            <div class="cart-item-info">

                <strong>${producto.nombre}</strong>

                ${
                    detalles.length
                    ? `<span class="cart-item-meta">${detalles.join(" · ")}</span>`
                    : ""
                }

                <div class="cart-qty" role="group" aria-label="Cantidad">

                    <button
                        type="button"
                        class="cart-qty-btn"
                        data-accion="menos"
                        data-index="${index}"
                        aria-label="Quitar uno">−</button>

                    <span class="cart-qty-valor">${producto.cantidad}</span>

                    <button
                        type="button"
                        class="cart-qty-btn"
                        data-accion="mas"
                        data-index="${index}"
                        aria-label="Agregar uno">+</button>

                </div>

            </div>

            <div class="cart-item-right">

                <strong>$${formatoPrecio(producto.precio * producto.cantidad)}</strong>

                <button
                    type="button"
                    class="eliminar-producto"
                    data-index="${index}"
                    aria-label="Eliminar ${producto.nombre}">

                    Eliminar

                </button>

            </div>

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


    // ---- eliminar ----

    carritoItems.querySelectorAll(".eliminar-producto").forEach(boton=>{

        boton.addEventListener("click",()=>{

            carrito.splice(Number(boton.dataset.index),1);

            actualizarCarrito();

            mostrarNotificacion("Producto eliminado");

        });

    });


    // ---- cambiar cantidad ----

    carritoItems.querySelectorAll(".cart-qty-btn").forEach(boton=>{

        boton.addEventListener("click",()=>{

            const i = Number(boton.dataset.index);

            const producto = carrito[i];

            if (!producto) return;

            if (boton.dataset.accion === "mas") {

                producto.cantidad += 1;

            } else {

                producto.cantidad -= 1;

                // Al llegar a cero se saca del carrito
                if (producto.cantidad <= 0) {
                    carrito.splice(i,1);
                }

            }

            actualizarCarrito();

        });

    });

    actualizarEstadoCarrito();

    guardarCarrito();

}


// ==========================
// ESTADO DEL CARRITO
// ==========================
// Deshabilita "Finalizar compra" y esconde el globito
// cuando no hay nada.

function actualizarEstadoCarrito(){

    const vacio = carrito.length === 0;

    if (botonFinalizar) {

        botonFinalizar.disabled = vacio;

        botonFinalizar.classList.toggle("is-disabled", vacio);

    }

    if (contadorCarrito) {

        contadorCarrito.classList.toggle("is-empty", vacio);

    }

}


// ==========================
// AVISO AL AGREGAR
// ==========================
// Feedback inmediato: el boton confirma, el carrito late
// y el globito salta.

function festejarAgregado(boton){

    if (boton) {

        const textoOriginal = boton.dataset.textoOriginal || boton.textContent;

        boton.dataset.textoOriginal = textoOriginal;

        boton.classList.add("agregado");

        boton.textContent = "✓ Agregado";

        clearTimeout(boton._volver);

        boton._volver = setTimeout(()=>{

            boton.classList.remove("agregado");

            boton.textContent = textoOriginal;

        }, 1400);

    }

    if (botonCarrito) {

        botonCarrito.classList.remove("late");

        // reiniciar la animacion
        void botonCarrito.offsetWidth;

        botonCarrito.classList.add("late");

        setTimeout(()=>{
            botonCarrito.classList.remove("late");
        }, 600);

    }

    if (contadorCarrito) {

        contadorCarrito.classList.remove("salta");

        void contadorCarrito.offsetWidth;

        contadorCarrito.classList.add("salta");

        setTimeout(()=>{
            contadorCarrito.classList.remove("salta");
        }, 500);

    }

}


// ==========================
// AGREGAR PRODUCTOS
// ==========================

botonesAgregar.forEach(boton=>{

    boton.addEventListener("click",()=>{

        const tarjeta=boton.closest(".product-card");

        const nombre=tarjeta.dataset.name;

        const precio=parseInt(tarjeta.dataset.price);

        // Las bolsas y el headpiece no tienen talle: sin esto tiraba
        // TypeError al agregarlos al carrito.
        const selectorTalle=tarjeta.querySelector(".product-size");

        const talle=selectorTalle ? selectorTalle.value : "";

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

            const foto =
                tarjeta.querySelector(".product-image img");

            carrito.push({

                id:tarjeta.dataset.id,

                nombre:nombre,

                precio:precio,

                talle:talle,

                color:color,

                cantidad:cantidad,

                // para la miniatura del carrito
                imagen: foto ? foto.getAttribute("src") : ""

            });

        }

        actualizarCarrito();

        festejarAgregado(boton);

        mostrarNotificacion("Sumaste " + nombre + " al carrito");

    });

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
// RECUPERAR EL CARRITO GUARDADO
// ==========================
// cargarCarrito() estaba definida pero nunca se llamaba:
// el carrito se perdia al recargar la pagina.

cargarCarrito();

actualizarCarrito();


//=========================
// ABRIR / CERRAR CARRITO
//=========================

const cerrarCarritoBtn =
    document.getElementById("close-cart");

const carritoOverlay =
    document.getElementById("cart-overlay");


function abrirCarrito(){

    carritoPanel.classList.add("open");

    if (carritoOverlay) {
        carritoOverlay.classList.add("active");
    }

}


function cerrarCarrito(){

    carritoPanel.classList.remove("open");

    if (carritoOverlay) {
        carritoOverlay.classList.remove("active");
    }

}


botonCarrito.addEventListener("click",()=>{

    if (carritoPanel.classList.contains("open")) {
        cerrarCarrito();
    } else {
        abrirCarrito();
    }

});


if (cerrarCarritoBtn) {
    cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
}

if (carritoOverlay) {
    carritoOverlay.addEventListener("click", cerrarCarrito);
}


document.addEventListener("keydown",(e)=>{

    if (e.key === "Escape" && carritoPanel.classList.contains("open")) {
        cerrarCarrito();
    }

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


    // Avisar cuando la busqueda no encuentra nada, en vez de
    // dejar la tienda vacia sin explicacion.

    const grilla = document.querySelector(".products-grid");

    if (grilla) {

        const visibles = [...tarjetas].filter(
            t => t.style.display !== "none"
        ).length;

        let aviso = grilla.querySelector(".sin-resultados");

        if (visibles === 0) {

            if (!aviso) {

                aviso = document.createElement("p");
                aviso.className = "sin-resultados";

                grilla.appendChild(aviso);

            }

            aviso.textContent =
                "No encontramos productos con esa búsqueda.";

            aviso.style.display = "block";

        }

        else if (aviso) {

            aviso.style.display = "none";

        }

    }

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

// HOODIE BUZO OULET FRISA
else if (
    nombre ===
    "Hoodie Buzo Oulet Frisa"
) {

    imagenes = [
        "assets/img/hoodie-buzo-oulet-frisa1.jpg",
        "assets/img/hoodie-buzo-oulet-frisa2.jpg"
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

"Hoodie Buzo Oulet Frisa":
    "Aprovechá nuestro OUTLET SEGUNDA SELECCIÓN, donde cada unidad viene surtida por color al azar, ¡una sorpresa que suma variedad a tu guardarropa! Su diseño clásico y cómodo lo convierte en una prenda imprescindible para el día a día.",

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
        // TALLES SEGUN EL PRODUCTO
        // =========================================
        // Las bolsas y el headpiece no tienen talle: mostrar
        // S/M/L/XL ahi obligaba a elegir uno inventado.

        const tieneTalle =
            !!tarjeta.querySelector(".product-size");

        const bloqueTalles =
            modal.querySelector(".modal-sizes");

        const botonGuia =
            document.getElementById("size-guide-btn");

        if (bloqueTalles) {
            bloqueTalles.hidden = !tieneTalle;
        }

        if (botonGuia) {
            botonGuia.hidden = !tieneTalle;
        }

        // Arranca sin talle elegido y refleja los talles reales
        // de la ficha, no una lista fija.

        const contenedorTalles =
            modal.querySelector(".sizes");

        if (contenedorTalles && tieneTalle) {

            const opciones =
                [...tarjeta.querySelectorAll(".product-size option")]
                    .map(o => o.textContent.trim());

            contenedorTalles.innerHTML = "";

            opciones.forEach(t => {

                const span = document.createElement("span");
                span.textContent = t;

                contenedorTalles.appendChild(span);

            });

        }


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

    const tieneTalle =
        !!tarjetaModalActual.querySelector(".product-size");


    const talleSeleccionado =
        document.querySelector(
            ".sizes span.selected"
        );


    if (tieneTalle && !talleSeleccionado) {

        mostrarNotificacion(
            "Seleccioná un talle"
        );

        return;

    }


    const talle =
        talleSeleccionado
            ? talleSeleccionado.textContent.trim()
            : "";


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

        const foto =
            tarjetaModalActual.querySelector(
                ".product-image img"
            );

        carrito.push({

            id: id,

            nombre: nombre,

            precio: precio,

            talle: talle,

            color: color,

            cantidad: cantidad,

            // para la miniatura del carrito
            imagen: foto ? foto.getAttribute("src") : ""

        });

    }


    // =========================================
    // ACTUALIZAR CARRITO
    // =========================================

    actualizarCarrito();

    festejarAgregado(botonAgregar);


    mostrarNotificacion(
        "Sumaste " + nombre + " al carrito"
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

             const continuePayment =
    document.getElementById("continue-payment");

const checkoutError =
    document.getElementById("checkout-error");

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

        // Arrancar siempre sin envio elegido: si no, quedaba
        // el precio de una compra anterior.

        checkoutModal.dataset.shippingPrice = 0;

        checkoutModal
            .querySelectorAll('input[name="shipping"]')
            .forEach(op => { op.checked = false; });

        checkoutModal
            .querySelectorAll(".flex-option")
            .forEach(op => op.classList.remove("seleccionada"));

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
    // CALCULAR ENVÍO
    // =========================================
    // El boton y los radios existian en el HTML pero no habia
    // nada escuchandolos, asi que dataset.shippingPrice nunca
    // se seteaba y el resumen quedaba siempre en "A calcular".

    const botonCalcular =
        document.getElementById("calculate-shipping");

    const opcionesEnvio =
        checkoutModal.querySelectorAll(
            'input[name="shipping"]'
        );


    function opcionEnvioElegida(){

        return checkoutModal.querySelector(
            'input[name="shipping"]:checked'
        );

    }


    function aplicarEnvio(){

        const elegida = opcionEnvioElegida();

        checkoutModal.dataset.shippingPrice =
            elegida
                ? (elegida.dataset.price || 0)
                : 0;

        // Resaltar la opcion elegida con una clase. Depender de
        // :has() dejaba el recuadro sin marcar.

        checkoutModal
            .querySelectorAll(".flex-option")
            .forEach(op => op.classList.remove("seleccionada"));

        if (elegida) {

            const contenedor =
                elegida.closest(".flex-option");

            if (contenedor) {
                contenedor.classList.add("seleccionada");
            }

        }

        actualizarCheckout();

        return elegida;

    }


    // Se actualiza al toque de elegir, sin esperar al boton

    opcionesEnvio.forEach((opcion) => {

        opcion.addEventListener("change", () => {

            aplicarEnvio();

            if (checkoutError) {
                checkoutError.style.display = "none";
            }

        });

    });


    // El boton confirma y avisa si no eligieron nada

    if (botonCalcular) {

        botonCalcular.addEventListener("click", () => {

            const elegida = aplicarEnvio();

            if (!elegida) {

                mostrarNotificacion(
                    "Elegí un método de envío"
                );

                if (checkoutError) {

                    checkoutError.textContent =
                        "Seleccioná un método de envío para calcular el costo.";

                    checkoutError.style.display = "block";

                }

                return;

            }

            if (checkoutError) {
                checkoutError.style.display = "none";
            }

            mostrarNotificacion(
                "Envío calculado"
            );

            // Llevar la vista al resumen, que es donde
            // aparece el numero recien calculado

            const resumen =
                document.getElementById("checkout-products");

            if (resumen) {

                resumen.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });

            }

        });

    }


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

                ${
                    producto.talle
                    ? `<span>Talle: ${producto.talle}</span>`
                    : ""
                }

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
// MERCADO PAGO — CONTINUAR AL PAGO
// =========================================

continuePayment.addEventListener("click", async () => {

    // =====================================
    // COMPROBAR DATOS PERSONALES
    // =====================================

    const nombre =
        document.getElementById("checkout-name").value.trim();

    const apellido =
        document.getElementById("checkout-lastname").value.trim();

    const email =
        document.getElementById("checkout-email").value.trim();

    const telefono =
        document.getElementById("checkout-phone").value.trim();


    // =====================================
    // COMPROBAR DATOS DE ENVÍO
    // =====================================

    const direccion =
        document.getElementById("checkout-address").value.trim();

    const localidad =
        document.getElementById("checkout-city").value.trim();

    const provincia =
        document.getElementById("checkout-province").value;

    const codigoPostal =
        document.getElementById("checkout-postal").value.trim();


    // =====================================
    // COMPROBAR MÉTODO DE ENVÍO
    // =====================================

    const envioSeleccionado =
        document.querySelector(
            'input[name="shipping"]:checked'
        );


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

        checkoutError.textContent =
            "Completá todos los campos y seleccioná un método de envío.";

        checkoutError.style.display = "block";

        return;

    }


    checkoutError.style.display = "none";


    // =====================================
    // OBTENER PRECIO DEL ENVÍO
    // =====================================

    const precioEnvio =
        Number(envioSeleccionado.dataset.price);


    // =====================================
    // PREPARAR PRODUCTOS
    // =====================================

    const productos =
        carrito.map(producto => ({

            nombre: producto.nombre,

            precio: Number(producto.precio),

            cantidad: Number(producto.cantidad),

            talle: producto.talle || "",

            color: producto.color || ""

        }));


    // =====================================
    // MOSTRAR ESTADO
    // =====================================

    continuePayment.disabled = true;

    continuePayment.textContent =
        "Conectando con Mercado Pago...";


    try {

        // =====================================
        // ENVIAR PEDIDO AL BACKEND
        // =====================================

        const response =
            await fetch("/api/create-preference", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    productos: productos,

                    envio: precioEnvio,

                    comprador: {

                        nombre: nombre,

                        apellido: apellido,

                        email: email,

                        telefono: telefono,

                        direccion: direccion,

                        localidad: localidad,

                        provincia: provincia,

                        codigoPostal: codigoPostal

                    }

                })

            });


        // =====================================
        // LEER RESPUESTA
        // =====================================

        const texto =
            await response.text();


        let data = {};

        try {

            data = JSON.parse(texto);

        } catch (e) {

            throw new Error(
                "El servidor respondió " +
                response.status +
                " sin JSON. Probá el sitio publicado en Vercel, " +
                "no el Live Server."
            );

        }


        if (!response.ok || !data.init_point) {

            throw new Error(
                data.error ||
                "No se pudo crear el pago."
            );

        }


        // =====================================
        // IR A MERCADO PAGO
        // =====================================

        window.location.href =
            data.init_point;


    } catch (error) {

        console.error(
            "Error Mercado Pago:",
            error
        );

        checkoutError.textContent =
            error.message ||
            "No se pudo iniciar el pago. Intentá nuevamente.";

        checkoutError.style.display =
            "block";

        continuePayment.disabled =
            false;

        continuePayment.textContent =
            "Continuar al pago";

    }

});

});

// =========================================
// ABRIR EL DETALLE TOCANDO LA FOTO
// =========================================
// En celular la ficha no muestra el boton "Ver producto",
// asi que la foto es la que entra al detalle. Reusa el
// boton de la ficha para no repetir la logica del modal.

document.addEventListener("click", (e) => {

    const foto = e.target.closest(".product-image");

    if (!foto) return;

    const tarjeta = foto.closest(".product-card");

    if (!tarjeta) return;

    const boton = tarjeta.querySelector(".view-product");

    if (boton) boton.click();

});


// Mismo acceso desde el teclado

document.querySelectorAll(".product-image").forEach(foto => {

    foto.setAttribute("role", "button");
    foto.setAttribute("tabindex", "0");

    const nombre =
        foto.closest(".product-card")?.dataset.name || "el producto";

    foto.setAttribute("aria-label", "Ver detalle de " + nombre);

    foto.addEventListener("keydown", (e) => {

        if (e.key === "Enter" || e.key === " ") {

            e.preventDefault();

            foto.click();

        }

    });

});


// =========================================
// MENU MOVIL — HAMBURGUESA
// =========================================

const menuToggle =
    document.getElementById("menu-toggle");

const mainNav =
    document.getElementById("main-nav");

const navOverlay =
    document.getElementById("nav-overlay");


if (menuToggle && mainNav && navOverlay) {

    // =====================================
    // ABRIR / CERRAR
    // =====================================

    const abrirMenu = () => {

        mainNav.classList.add("open");
        navOverlay.classList.add("active");
        menuToggle.classList.add("open");

        document.body.classList.add("nav-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Cerrar menu");

    };


    const cerrarMenu = () => {

        mainNav.classList.remove("open");
        navOverlay.classList.remove("active");
        menuToggle.classList.remove("open");

        document.body.classList.remove("nav-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");

    };


    // =====================================
    // BOTON
    // =====================================

    menuToggle.addEventListener("click", () => {

        if (mainNav.classList.contains("open")) {
            cerrarMenu();
        } else {
            abrirMenu();
        }

    });


    // =====================================
    // CERRAR AL TOCAR EL FONDO
    // =====================================

    navOverlay.addEventListener("click", cerrarMenu);


    // =====================================
    // CERRAR AL ELEGIR UN APARTADO
    // =====================================

    mainNav.querySelectorAll("a").forEach(enlace => {

        enlace.addEventListener("click", cerrarMenu);

    });


    // =====================================
    // CERRAR CON ESCAPE
    // =====================================

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape" && mainNav.classList.contains("open")) {
            cerrarMenu();
        }

    });


    // =====================================
    // CERRAR SI SE VUELVE A ESCRITORIO
    // =====================================

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900 && mainNav.classList.contains("open")) {
            cerrarMenu();
        }

    });

}


// =========================================
// FLEX GAREZ — DESPLEGABLE
// =========================================

const toggleFlex =
    document.getElementById("toggle-flex");

const flexOptions =
    document.getElementById("flex-options");


if (toggleFlex && flexOptions) {

    toggleFlex.addEventListener("click", () => {

        flexOptions.classList.toggle("active");

    });

}

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
