/* ============================================
   SELECTORS - DOM REFERENCES
   ============================================ */

/**
 * Module: selectors.js
 * Description: Centralizes all DOM element references.
 * Exports: Variables that reference HTML elements
 */

/* ============================================
   SECTION 1: GLOBAL VARIABLES
   ============================================ */

/** Dynamically updated window width */
export let width = window.innerWidth;

/** Update the width on resize */
window.addEventListener("resize", () => {
  width = window.innerWidth;
});

/** Body element reference */
const body = document.body;

/* ============================================
   SECTION 2: HEADER / NAVIGATION
   ============================================ */

/** Main header */
const header = document.querySelector(".header");

/** Side-menu access points */
const favoritoLateral = document.querySelector(".favorito-lateral");
const carritoLateral = document.querySelector(".carrito-lateral");

/** Hamburger menu button and container */
const menuBtn = document.querySelector(".menu-btn");
const menuBtnContainer = document.querySelector(".menu-btn-container");
const menuCategorias = document.querySelector(".menu-categorias");
const menuCategoriasContainer = document.querySelector(
  ".menu-categorias-container",
);
const categoriasMenuLateralWrapper = document.querySelector(
  ".categorias-menu-lateral-wrapper",
);

/** Category toggle buttons */
const btnCategoriaMujer = document.querySelector(
  'button[data-categoria="categorias-btn-mujer"]',
);
const btnCategoriaHombre = document.querySelector(
  'button[data-categoria="categorias-btn-hombre"]',
);

/** Toggle containers */
const toggleBtnMujer = document.querySelector(".categoria-mujer-container");
const toggleBtnHombre = document.querySelector(".categoria-hombre-container");

/* ============================================
   SECTION 3: AUTHENTICATION / LOGIN
   ============================================ */

/** Login container and elements */
const loginContainer = document.querySelector(".login-container");
const logInLogo = document.querySelector(".log-in-logo");
const logInLateral = document.querySelector(".log-in-lateral");
const opcionesLoginContainer = document.querySelector(
  ".opciones-login-container",
);
const iconoLogin = document.getElementById("icono-login");
/* ============================================
   SECTION 4: SEARCH
   ============================================ */

/** Search containers and elements */
const containerInput = document.querySelector(".container-input");
const buscarContainer = document.querySelector(".buscar-container");
const buscarWrapper = document.querySelector(".buscar-wrapper");
const buscarInputContainer = document.querySelector(".buscar-input-btn");
const buscarBtnContainer = document.querySelector(".buscar-btn-container");
const btnBuscarContainer = document.querySelector(".buscar-btn-container");

/** Search input and button */
const inputBuscar = document.getElementById("buscar-input");
const buscarInputBtn = document.querySelector(".buscar-input-btn");

/* ============================================
   SECTION 5: WOMEN'S PRODUCTS (GRIDS)
   ============================================ */

const vestidosMujerContainer = document.querySelector(".vestidos-grid");
const blusasMujerContainer = document.querySelector(".blusas-grid");
const pantalonesMujerContainer = document.querySelector(
  ".pantalones-mujer-grid",
);
const faldasMujerContainer = document.querySelector(".faldas-grid");
const conjuntosMujerContainer = document.querySelector(".conjuntos-mujer-grid");
const accesoriosMujerContainer = document.querySelector(
  ".accesorios-mujer-grid",
);

/* ============================================
   SECTION 6: MEN'S PRODUCTS (GRIDS)
   ============================================ */

const camisasHombreContainer = document.querySelector(".camisas-grid");
const pantalonesHombreContainer = document.querySelector(
  ".pantalones-hombre-grid",
);
const gorrasHombreContainer = document.querySelector(".gorras-grid");
const zapatosHombreContainer = document.querySelector(".zapatos-grid");
const conjuntosHombreContainer = document.querySelector(
  ".conjuntos-hombre-grid",
);
const accesoriosHombreContainer = document.querySelector(
  ".accesorios-hombre-grid",
);

/* ============================================
   SECTION 7: SLIDER
   ============================================ */

const slider = document.getElementById("slider-contenedor");
const sliderContainer = document.querySelector(".previuw-next-container");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const swiperPagination = document.querySelector(".swiper-pagination");

/* ============================================
   SECTION 8: FAVORITES / CART / MODALS
   ============================================ */

/** Favorites */
const favoritosLogo = document.querySelector(".favoritos-logo");
const favoritosContainer = document.querySelector(".favoritos-container");

/** Cart */
const carritoLogo = document.querySelector(".carrito-logo");
const carritoContainer = document.querySelector(".carrito-container");

/** Cart counter */
const contadorCirculo = document.querySelector(".contador-add-carrito");
const spanContador = document.querySelector(".span-contador");

/** Cart mini-modal */
const miniModalCarritoContainer = document.querySelector(
  ".mini-modal-carrito-container",
);
const miniModalCarrito = document.querySelector(".mini-modal-carrito");

/** Purchase modal */
const modalComprarContainer = document.querySelector(
  ".modal-comprar-container",
);

/** Empty cart/favorites message */
const mostrarMensajeVacio = document.querySelector(".mostrar-mensaje-vacio");

/* ============================================
   SECTION 9: PROFILE / ORDERS / INVOICE
   ============================================ */

/** User profile */
const perfilContainer = document.querySelector(".perfil-container");
const contenedoresPerfil = document.querySelectorAll(".perfil-contenido");
const btnsPerfil = document.querySelectorAll(".perfil-btn");
const editarPerfil = document.querySelector(".editar-perfil");
const btnActivoFijo = document.querySelector(".btn-activo-fijo");
const imgVolver = document.querySelector(".img-volver");

/** Payment methods */
const btnVisaMastercard = document.querySelector(".btn-add-visa-mastercard");
const btnPaypal = document.querySelector(".btn-add-paypal");
const formTarjeta = document.querySelector(".form-tarjeta");
const formPaypal = document.querySelector(".form-paypal");

/** Order history */
const btnHistorial = document.querySelector(".btn-historial");
const historialPedidosContainer = document.querySelector(
  ".historial-pedidos-container",
);
const encabezadoPedidoContainer = document.querySelector(
  ".encabezado-pedido-container",
);

/** Status table */
const btnTablaPedido = document.querySelector(".btn-tabla-pedido");
const tablaEstadosPedidosContainer = document.querySelector(
  ".tabla-estados-pedidos-container",
);

/** Saved cards */
const btnVerTarjetas = document.querySelector(".btn-ver-tarjetas");
const tarjetasGuardadasContainer = document.querySelector(
  ".tarjeta-guardada-container",
);

/** Invoice */
const btnDescargarFactura = document.querySelector(".btn-descargar-factura");

/* ============================================
   SECTION 10: PAYMENT
   ============================================ */

const btnTarjetasPago = document.getElementById("btn-tarjetas-pago");
const btnPaypalPago = document.getElementById("btn-paypal-pago");

/* ============================================
   SECTION 11: SIDE CONTAINERS
   ============================================ */

/** All category containers */
const containers = document.querySelectorAll(
  ".vestidos-container, .blusas-container, .pantalones-mujer-container, " +
    ".faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, " +
    ".camisas-container, .pantalones-hombre-container, .gorras-container, " +
    ".zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
);

/* ============================================
   EXPORTS
   ============================================ */
export {
  // Global
  body,

  // Header / Nav
  header,
  favoritoLateral,
  carritoLateral,
  menuBtn,
  menuBtnContainer,
  menuCategorias,
  menuCategoriasContainer,
  categoriasMenuLateralWrapper,
  btnCategoriaMujer,
  btnCategoriaHombre,
  toggleBtnMujer,
  toggleBtnHombre,

  // Auth
  loginContainer,
  logInLogo,
  logInLateral,
  opcionesLoginContainer,
  iconoLogin,

  // Search
  buscarContainer,
  btnBuscarContainer,
  containerInput,
  buscarWrapper,
  buscarInputContainer,
  buscarBtnContainer,
  inputBuscar,
  buscarInputBtn,

  // Women's products
  vestidosMujerContainer,
  blusasMujerContainer,
  pantalonesMujerContainer,
  faldasMujerContainer,
  conjuntosMujerContainer,
  accesoriosMujerContainer,

  // Men's products
  camisasHombreContainer,
  pantalonesHombreContainer,
  gorrasHombreContainer,
  zapatosHombreContainer,
  conjuntosHombreContainer,
  accesoriosHombreContainer,

  // Slider
  slider,
  sliderContainer,
  btnPrev,
  btnNext,
  swiperPagination,

  // Favorites / Cart / Modals
  favoritosLogo,
  favoritosContainer,
  carritoLogo,
  carritoContainer,
  contadorCirculo,
  spanContador,
  miniModalCarritoContainer,
  miniModalCarrito,
  modalComprarContainer,
  mostrarMensajeVacio,

  // Profile / Orders / Invoice
  perfilContainer,
  contenedoresPerfil,
  btnsPerfil,
  editarPerfil,
  btnActivoFijo,
  imgVolver,
  btnVisaMastercard,
  btnPaypal,
  formTarjeta,
  formPaypal,
  btnHistorial,
  historialPedidosContainer,
  encabezadoPedidoContainer,
  btnTablaPedido,
  tablaEstadosPedidosContainer,
  btnDescargarFactura,

  // Payment
  btnTarjetasPago,
  btnPaypalPago,

  // Collapsables
  containers,
};
