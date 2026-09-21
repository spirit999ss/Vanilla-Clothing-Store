/* ============================================
   SELECTORS - REFERENCIAS DOM
   ============================================ */

/**
 * Módulo: selectors.js
 * Descripción: Centraliza todas las referencias a elementos del DOM
 * Exporta: Variables con referencias a elementos HTML
 */

/* ============================================
   SECCIÓN 1: VARIABLES GLOBALES
   ============================================ */

/** Ancho de ventana dinámico */
export let width = window.innerWidth;

/** Actualizar ancho en resize */
window.addEventListener("resize", () => {
  width = window.innerWidth;
});

/** Referencia al body */
const body = document.body;

/* ============================================
   SECCIÓN 2: HEADER / NAVEGACIÓN
   ============================================ */

/** Header principal */
const header = document.querySelector(".header");

/** Accesos del menú lateral */
const favoritoLateral = document.querySelector(".favorito-lateral");
const carritoLateral = document.querySelector(".carrito-lateral");

/** Botón y contenedor del menú hamburguesa */
const menuBtn = document.querySelector(".menu-btn");
const menuCategorias = document.querySelector(".menu-categorias");
const categoriasMenuLateralWrapper = document.querySelector(
  ".categorias-menu-lateral-wrapper",
);

/** Botones de toggle de categorías */
const btnCategoriaMujer = document.querySelector(
  'button[data-categoria="categorias-btn-mujer"]',
);
const btnCategoriaHombre = document.querySelector(
  'button[data-categoria="categorias-btn-hombre"]',
);

/** Contenedores de toggle */
const toggleBtnMujer = document.querySelector(".categoria-mujer-container");
const toggleBtnHombre = document.querySelector(".categoria-hombre-container");

/* ============================================
   SECCIÓN 3: AUTENTICACIÓN / LOGIN
   ============================================ */

/** Contenedor y elementos del login */
const loginContainer = document.querySelector(".login-container");
const logInLogo = document.querySelector(".log-in-logo");
const logInLateral = document.querySelector(".log-in-lateral");
const opcionesLoginContainer = document.querySelector(
  ".opciones-login-container",
);
const iconoLogin = document.getElementById("icono-login");
/* ============================================
   SECCIÓN 4: BUSCADOR
   ============================================ */

/** Contenedores y elementos de búsqueda */
const containerInput = document.querySelector(".container-input");
const buscarContainer = document.querySelector(".buscar-container");
const buscarWrapper = document.querySelector(".buscar-wrapper");
const buscarInputContainer = document.querySelector(".buscar-input-btn");
const buscarBtnContainer = document.querySelector(".buscar-btn-container");
const btnBuscarContainer = document.querySelector(".buscar-btn-container");

/** Input y botón de búsqueda */
const inputBuscar = document.getElementById("buscar-input");
const buscarInputBtn = document.querySelector(".buscar-input-btn");

/* ============================================
   SECCIÓN 5: PRODUCTOS MUJER (GRIDS)
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
   SECCIÓN 6: PRODUCTOS HOMBRE (GRIDS)
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
   SECCIÓN 7: SLIDER
   ============================================ */

const slider = document.getElementById("slider-contenedor");
const sliderContainer = document.querySelector(".previuw-next-container");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");

/* ============================================
   SECCIÓN 8: FAVORITOS / CARRITO / MODALES
   ============================================ */

/** Favoritos */
const favoritosLogo = document.querySelector(".favoritos-logo");
const favoritosContainer = document.querySelector(".favoritos-container");

/** Carrito */
const carritoLogo = document.querySelector(".carrito-logo");
const carritoContainer = document.querySelector(".carrito-container");

/** Contador del carrito */
const contadorCirculo = document.querySelector(".contador-add-carrito");
const spanContador = document.querySelector(".span-contador");

/** Mini modal del carrito */
const miniModalCarritoContainer = document.querySelector(
  ".mini-modal-carrito-container",
);
const miniModalCarrito = document.querySelector(".mini-modal-carrito");

/** Modal de compra */
const modalComprarContainer = document.querySelector(
  ".modal-comprar-container",
);

/** Mensaje de carrito/favoritos vacío */
const mostrarMensajeVacio = document.querySelector(".mostrar-mensaje-vacio");

/* ============================================
   SECCIÓN 9: PERFIL / PEDIDOS / FACTURA
   ============================================ */

/** Perfil de usuario */
const perfilContainer = document.querySelector(".perfil-container");
const contenedoresPerfil = document.querySelectorAll(".perfil-contenido");
const btnsPerfil = document.querySelectorAll(".perfil-btn");
const editarPerfil = document.querySelector(".editar-perfil");
const btnActivoFijo = document.querySelector(".btn-activo-fijo");
const imgVolver = document.querySelector(".img-volver");

/** Métodos de pago */
const btnVisaMastercard = document.querySelector(".btn-add-visa-mastercard");
const btnPaypal = document.querySelector(".btn-add-paypal");
const formTarjeta = document.querySelector(".form-tarjeta");
const formPaypal = document.querySelector(".form-paypal");

/** Historial de pedidos */
const btnHistorial = document.querySelector(".btn-historial");
const historialPedidosContainer = document.querySelector(
  ".historial-pedidos-container",
);
const encabezadoPedidoContainer = document.querySelector(
  ".encabezado-pedido-container",
);

/** Tabla de estados */
const btnTablaPedido = document.querySelector(".btn-tabla-pedido");
const tablaEstadosPedidosContainer = document.querySelector(
  ".tabla-estados-pedidos-container",
);

/** Tarjetas guardadas */
const btnVerTarjetas = document.querySelector(".btn-ver-tarjetas");
const tarjetasGuardadasContainer = document.querySelector(
  ".tarjeta-guardada-container",
);

/** Factura */
const btnDescargarFactura = document.querySelector(".btn-descargar-factura");

/* ============================================
   SECCIÓN 10: PAGO
   ============================================ */

const btnTarjetasPago = document.getElementById("btn-tarjetas-pago");
const btnPaypalPago = document.getElementById("btn-paypal-pago");

/* ============================================
   SECCIÓN 11: CONTENEDORES LATERALES
   ============================================ */

/** Todos los contenedores de categorías */
const containers = document.querySelectorAll(
  ".vestidos-container, .blusas-container, .pantalones-mujer-container, " +
    ".faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, " +
    ".camisas-container, .pantalones-hombre-container, .gorras-container, " +
    ".zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
);

/* ============================================
   EXPORTACIONES
   ============================================ */
export {
  // Global
  body,

  // Header / Nav
  header,
  favoritoLateral,
  carritoLateral,
  menuBtn,
  menuCategorias,
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

  // Buscador
  buscarContainer,
  btnBuscarContainer,
  containerInput,
  buscarWrapper,
  buscarInputContainer,
  buscarBtnContainer,
  inputBuscar,
  buscarInputBtn,

  // Productos Mujer
  vestidosMujerContainer,
  blusasMujerContainer,
  pantalonesMujerContainer,
  faldasMujerContainer,
  conjuntosMujerContainer,
  accesoriosMujerContainer,

  // Productos Hombre
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

  // Favoritos / Carrito / Modales
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

  // Perfil / Pedidos / Factura
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

  // Pago
  btnTarjetasPago,
  btnPaypalPago,

  // Collapsables
  containers,
};
