/* ==============================
   GLOBAL
============================== */

// Ancho inicial
export let width = window.innerWidth;

window.addEventListener("resize", () => {
  width = window.innerWidth;
});

const body = document.body;
/*Usuario
export const usuario = state.usuarios[state.usuarioActivo];*/
/* ==============================
   HEADER / NAV
============================== */

const header = document.querySelector(".header");

// Accesos laterales
const favoritoLateral = document.querySelector(".favorito-lateral");
const carritoLateral = document.querySelector(".carrito-lateral");

// Menú categorías
const menuBtn = document.querySelector(".menu-btn");
const menuCategorias = document.querySelector(".menu-categorias");
const categoriasMenuLateralWrapper = document.querySelector(
  ".categorias-menu-lateral-wrapper",
);
// Botones categorías
const btnCategoriaMujer = document.querySelector(
  'button[data-categoria="categorias-btn-mujer"]',
);
const btnCategoriaHombre = document.querySelector(
  'button[data-categoria="categorias-btn-hombre"]',
);

// Toggle contenedores categorías
const toggleBtnMujer = document.querySelector(".categoria-mujer-container");
const toggleBtnHombre = document.querySelector(".categoria-hombre-container");
/* ==============================
   LOGIN / AUTH
============================== */

const loginContainer = document.querySelector(".login-container");
const logInLogo = document.querySelector(".log-in-logo");

const logInLateral = document.querySelector(".log-in-lateral");
const opcionesLoginContainer = document.querySelector(
  ".opciones-login-container",
);

const iconoLogin = document.getElementById("icono-login");
/* ==============================
   BUSCADOR
============================== */
const containerInput = document.querySelector(".container-input");
const buscarContainer = document.querySelector(".buscar-container");
const buscarWrapper = document.querySelector(".buscar-wrapper");
const buscarInputContainer = document.querySelector(".buscar-input-btn");
const buscarBtnContainer = document.querySelector(".buscar-btn-container");
const btnBuscarContainer = document.querySelector(".buscar-btn-container");

// Elementos búsqueda
const inputBuscar = document.getElementById("buscar-input");
const buscarInputBtn = document.querySelector(".buscar-input-btn");
/* ==============================
   PRODUCTOS MUJER (GRIDS)
============================== */

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

/* ==============================
   PRODUCTOS HOMBRE (GRIDS)
============================== */

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

/* ==============================
   SLIDER
============================== */

const slider = document.getElementById("slider-contenedor");
const sliderContainer = document.querySelector(".previuw-next-container");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");

/* ==============================
   FAVORITOS / CARRITO / MODALES
============================== */

const favoritosLogo = document.querySelector(".favoritos-logo");
const favoritosContainer = document.querySelector(".favoritos-container");

const carritoLogo = document.querySelector(".carrito-logo");
const carritoContainer = document.querySelector(".carrito-container");

// Contador carrito
const contadorCirculo = document.querySelector(".contador-add-carrito");
const spanContador = document.querySelector(".span-contador");

// Mini modal carrito
const miniModalCarritoContainer = document.querySelector(
  ".mini-modal-carrito-container",
);
const miniModalCarrito = document.querySelector(".mini-modal-carrito");

// Modal compra
const modalComprarContainer = document.querySelector(
  ".modal-comprar-container",
);
//Mensaje de Favoritos y Carrito
const mostrarMensajeVacio = document.querySelector(".mostrar-mensaje-vacio");
/* ==============================
   PERFIL / PEDIDOS / FACTURA
============================== */

const perfilContainer = document.querySelector(".perfil-container");
const contenedoresPerfil = document.querySelectorAll(".perfil-contenido");
const btnsPerfil = document.querySelectorAll(".perfil-btn");
const editarPerfil = document.querySelector(".editar-perfil");

const btnActivoFijo = document.querySelector(".btn-activo-fijo");

//Salir del Contenedor Activo
const imgVolver = document.querySelector(".img-volver");

//Form de Formas de Pago
const btnVisaMastercard = document.querySelector(".btn-add-visa-mastercard");
const btnPaypal = document.querySelector(".btn-add-paypal");

const formTarjeta = document.querySelector(".form-tarjeta");
const formPaypal = document.querySelector(".form-paypal");

// Historial pedidos
const btnHistorial = document.querySelector(".btn-historial");
const historialPedidosContainer = document.querySelector(
  ".historial-pedidos-container",
);
const encabezadoPedidoContainer = document.querySelector(
  ".encabezado-pedido-container",
);

// Tabla estados pedidos
const btnTablaPedido = document.querySelector(".btn-tabla-pedido");
const tablaEstadosPedidosContainer = document.querySelector(
  ".tabla-estados-pedidos-container",
);

/* Tarjeta Guardas Perfil*/
const btnVerTarjetas = document.querySelector(".btn-ver-tarjetas");
const tarjetasGuardadasContainer = document.querySelector(
  ".tarjeta-guardada-container",
);
// Factura
const btnDescargarFactura = document.querySelector(".btn-descargar-factura");

/* ==============================
   PAGO
============================== */

const btnTarjetasPago = document.getElementById("btn-tarjetas-pago");
const btnPaypalPago = document.getElementById("btn-paypal-pago");
/* ==============================
   CONTENEDORES LATERALES (COLAPSABLES)
============================== */

const containers = document.querySelectorAll(
  ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, .camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
);

/* ==============================
   EXPORTS
============================== */

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

  // Perfil /Metodos de Pago / Pedidos / Factura
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
