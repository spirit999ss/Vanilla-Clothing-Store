/* ==============================
   EVENTS
============================== */
import {
  abrirCapaLateral,
  cerrarCapaLateral,
  crearCapaLateralConExit,
  deleteProducto,
  exitGenerico,
  hiddenCategorias,
} from "./utils.js";
import {
  accesoriosHombreContainer,
  accesoriosMujerContainer,
  blusasMujerContainer,
  body,
  btnActivoFijo,
  btnBuscarContainer,
  btnCategoriaHombre,
  btnCategoriaMujer,
  btnDescargarFactura,
  btnHistorial,
  btnPaypal,
  btnPrev,
  btnTablaPedido,
  btnTarjetasPago,
  btnVisaMastercard,
  btnsPerfil,
  buscarContainer,
  buscarInputBtn,
  camisasHombreContainer,
  carritoContainer,
  carritoLateral,
  carritoLogo,
  categoriasMenuLateralWrapper,
  conjuntosHombreContainer,
  conjuntosMujerContainer,
  containers,
  contenedoresPerfil,
  editarPerfil,
  encabezadoPedidoContainer,
  faldasMujerContainer,
  favoritoLateral,
  favoritosContainer,
  favoritosLogo,
  formPaypal,
  formTarjeta,
  gorrasHombreContainer,
  header,
  iconoLogin,
  imgVolver,
  inputBuscar,
  logInLateral,
  logInLogo,
  loginContainer,
  menuBtn,
  menuBtnContainer,
  menuCategorias,
  menuCategoriasContainer,
  miniModalCarrito,
  miniModalCarritoContainer,
  modalComprarContainer,
  mostrarMensajeVacio,
  opcionesLoginContainer,
  pantalonesHombreContainer,
  pantalonesMujerContainer,
  perfilContainer,
  slider,
  sliderContainer,
  swiperPagination,
  tablaEstadosPedidosContainer,
  toggleBtnHombre,
  toggleBtnMujer,
  vestidosMujerContainer,
  width,
  zapatosHombreContainer,
} from "./selectors.js";
import {
  aplicarAnimacionLetras,
  calcularAnchoCapaLateral,
  calcularSubtotal,
  cerrarZoom,
  detallesCompra,
  irAlProductoSlider,
  mostrarMensajeSinTarjetas,
  renderCarrito,
  renderDashboard,
  renderEstadoTabla,
  renderHistorialPedidos,
  renderImgUsuario,
  renderMiniModalCarrito,
  renderPerfilUsuario,
  renderPrincipalResize,
  renderProductosFiltrados,
  renderizarTarjetas,
  sincronizarBotonCarrito,
  sincronizarBotonFavorito,
  sincronizarContenedorVacio,
} from "./render.js";
import {
  carrito,
  estadosPedidosTabla,
  generarNumeroPedido,
  historialPedidos,
  state,
} from "./state.js";
import { categorias, dataHombres, dataMujeres } from "./products.js";

import { assets } from "./assets.js";
/* ==============================
  1. IMPORTS
============================== */
import { loadAssets } from "./main.js";
import { saveToLocalStorage } from "./storage.js";

/* ==============================
  2. VARIABLES GLOBALES
============================== */
const formLogIn = document.querySelector(".login-form");
const mensaje = document.getElementById("mensajeLogin");

const logoMarca = document.querySelector(".logo-marca");
const nombreUsuario = "Messi Ronaldo";
const correoUsuario = "messironaldo33663@gmail.com";
const dineroGastado = 3600.0;
let pedidosRealizados = 0;
const containersTienda = document.querySelectorAll(
  ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, .camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
);
const template = document.querySelector("#factura-template");
export let facturaContainer = null;
const eliminarTodoLosProductos = document.querySelector(
  ".eliminarTodoLosProductosContainer",
);
const btnVerTarjetas = document.querySelector(".btn-ver-tarjetas");
const tarjetasGuardadasContainer = document.querySelector(
  ".tarjeta-guardada-container",
);
/* =================================
    Slider
================================*/
export function initSliderClicks() {
  const slider = document.querySelector(".swiper");

  if (!slider) return;

  slider.addEventListener("click", (e) => {
    const img = e.target.closest(".slider-producto");

    if (!img) return;
    if (width >= 768) {
      header.classList.remove("desactivado");

      menuCategorias.classList.add("activado");
      menuCategoriasContainer.classList.add("activado");
      swiperPaginationClicks();
    }

    sincronizarBotonCarrito();
    sincronizarBotonFavorito();
    irAlProductoSlider({
      currentTarget: img,
    });
  });
}
function swiperPaginationClicks() {
  swiperPagination.addEventListener("click", () => {
    header.classList.remove("desactivado");
  });
}
/* ==============================
  3. EVENTOS DE NAVEGACIÓN
============================== */
menuBtn.addEventListener("click", () => {
  const estaAbierto = menuCategorias.classList.contains("activado");
  cerrarZoom();

  if (estaAbierto) {
    cerrarCapaLateral();
  } else {
    abrirCapaLateral();

    menuCategorias.classList.add("activado");
    menuBtnContainer.classList.add("activado");
    categoriasMenuLateralWrapper.classList.add("activado");
    body.style.overflowY = "hidden";
    if (menuBtnContainer) {
      menuBtnContainer.classList.add("activado");
    }

    containers.forEach((c) => c.classList.remove("activado"));
    favoritosContainer.classList.remove("activado");
    carritoContainer.classList.remove("activado");

    sincronizarContenedorVacio(mostrarMensajeVacio);
  }

  let capaLateral = document.querySelector(".capaLateral");

  if (!capaLateral) {
    capaLateral = crearCapaLateralConExit(body, () => {
      menuCategorias.classList.remove("activado");
      menuBtnContainer.classList.remove("activado");
      categoriasMenuLateralWrapper.classList.remove("activado");
      hiddenCategorias();

      capaLateral.remove();

      if (menuBtnContainer) {
        menuBtnContainer.classList.remove("activado");
      }

      body.style.overflowY = "";
    });
  }
  if (capaLateral) {
    const anchoCapaLateral = calcularAnchoCapaLateral(menuCategorias);
    capaLateral.style.width = `${anchoCapaLateral.capaWidth}px`;
  }
});
btnBuscarContainer.addEventListener("click", () => {
  const buscarContainer = document.querySelector(".buscar-container");
  cerrarZoom();
  containers.forEach((c) => c.classList.remove("activado"));

  carritoContainer.classList.remove("activado");
  favoritosContainer.classList.remove("activado");

  sincronizarContenedorVacio(mostrarMensajeVacio);

  buscarContainer.classList.add("activado");
  body.style.overflowY = "hidden";

  if (!buscarContainer.querySelector(".exitContainer")) {
    const exitBuscarContainerExiste = document.querySelector(
      ".exitBuscarContainer",
    );
    if (!exitBuscarContainerExiste) {
      const exit = exitGenerico({
        onClick: () => {
          containers.forEach((c) => (c.style.zIndex = ""));
          buscarContainer.classList.remove("activado");
          hiddenCategorias();
          exit.remove();
        },
        containerClass: "exitBuscarContainer",
        imgClass: "exitBuscar",
      });
      buscarContainer.appendChild(exit);
    }
  }
});

function ejecutarBusqueda() {
  const texto = inputBuscar.value.trim().toLowerCase();
  if (!texto) {
    renderProductosFiltrados();
    return;
  }

  renderProductosFiltrados(texto);
}
inputBuscar.addEventListener("input", ejecutarBusqueda);
inputBuscar.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  event.preventDefault();

  const texto = inputBuscar.value.trim().toLowerCase();
  if (!texto) {
    return;
  }

  activarBusqueda();
});

function activarBusqueda() {
  cerrarZoom();

  const buscarContainer = document.querySelector(".buscar-container");
  containers.forEach((c) => {
    c.style.zIndex = "-9";
  });
  carritoContainer.classList.remove("activado");
  favoritosContainer.classList.remove("activado");

  buscarContainer.classList.add("activado");
  body.style.overflowY = "hidden";

  ejecutarBusqueda();

  inputBuscar.focus();
}
buscarInputBtn.addEventListener("click", () => {
  const texto = inputBuscar.value.trim().toLowerCase();
  if (!texto) {
    return;
  }

  activarBusqueda();
});

/* ==============================
  4. EVENTOS DE USUARIO
============================== */
formLogIn.addEventListener("submit", function (e) {
  e.preventDefault();

  const correo = formLogIn.correo.value.trim();
  const password = formLogIn.password.value.trim();

  if (correo === "" || password === "") {
    mensaje.textContent = "Todos los campos son obligatorios.";
    mensaje.style.color = "red";
    return;
  }

  const usuarioEncontrado = Object.values(state.usuarios).find(
    (u) => u.correo === correo && u.contraseña === password,
  );

  if (!usuarioEncontrado) {
    mensaje.textContent = "Correo o contraseña incorrectos.";
    mensaje.style.color = "red";
    return;
  }
  state.usuarioActivo = usuarioEncontrado;
  saveToLocalStorage();
  if (usuarioEncontrado.imagen) {
    iconoLogin.style.display = "none";

    const userlogInActivo = document.createElement("img");
    userlogInActivo.src = usuarioEncontrado.imagen;
    userlogInActivo.alt = "Usuario logueado";
    userlogInActivo.classList.add("userlogInActivo");
    logInLogo
      .querySelectorAll(".userlogInActivo")
      .forEach((img) => img.remove());
    logInLogo.append(userlogInActivo);
  }
  cerrarPerfilLogin();

  if (width >= 768) {
    perfilContainer.classList.add("activado");
    editarPerfil.classList.add("activado");
    loginContainer.classList.add("activado");
    btnActivoFijo.classList.add("activado");
    imgVolver.classList.remove("activado");
  } else {
    perfilContainer.classList.add("activado");
    loginContainer.classList.add("activado");
    imgVolver.classList.remove("activado");
  }

  body.style.overflowY = "hidden";

  formLogIn.classList.add("desactivado");
  opcionesLoginContainer.classList.add("desactivado");
  sincronizarLogoMarca();

  renderPerfilUsuario();
  renderHistorialPedidos();
  renderDashboard();
  renderizarTarjetas();

  formLogIn.reset();

  containers.forEach((c) => (c.style.zIndex = "-9"));
  favoritosContainer.classList.remove("activado");
  carritoContainer.classList.remove("activado");
  mostrarMensajeVacio.classList.remove("activado");
  favoritosContainer.style.zIndex = "";
  carritoContainer.style.zIndex = "";
  mostrarMensajeVacio.style.zIndex = "";
});
document
  .querySelectorAll(".opcion-caja")
  .forEach((t) => t.addEventListener("click", () => alert("Próximamente :)")));
const btnCrearCuenta = document.getElementById("btn-crear-cuenta");
const modal = document.getElementById("modal-registro");
const cerrarModal = document.querySelector(".cerrar-modal");

btnCrearCuenta.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});
cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
const formRegistro = document.querySelector(".modal-registro");
formRegistro.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const username = document.getElementById("username").value.trim();
  const genero = document.getElementById("genero").value;
  const telefono = document.getElementById("telefono").value.trim();
  const correo = document.getElementById("email").value.trim();
  const contraseña = document
    .getElementById("registro-contraseña")
    .value.trim();
  const confirmarContraseña = document
    .getElementById("registro-confirmar-contraseña")
    .value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  if (
    !nombre ||
    !username ||
    !genero ||
    !telefono ||
    !correo ||
    !contraseña ||
    !confirmarContraseña ||
    !direccion
  ) {
    return;
  }
  if (contraseña !== confirmarContraseña) {
    return;
  }

  const nuevoId = agregarUsuario(
    state,
    nombre,
    username,
    genero,
    telefono,
    correo,
    contraseña,
    direccion,
  );
  modal.style.display = "none";
});
function agregarUsuario(
  state,
  nombre,
  username,
  genero,
  telefono,
  correo,
  contraseña,
  direccion,
) {
  const totalUsuarios = Object.keys(state.usuarios).length;
  const nuevoId = `u${totalUsuarios + 1}`;

  const nuevoUsuario = {
    nombre,
    username,
    genero,
    telefono,
    correo,
    contraseña,
    direccion,
    metodosPago: [],
  };

  state.usuarios[nuevoId] = nuevoUsuario;

  return nuevoId;
}
logInLogo.addEventListener("click", () => {
  const nombrePerfilUsario = document.querySelector(".nombre-perfil-usuario");
  aplicarAnimacionLetras(nombrePerfilUsario);

  cerrarZoom();

  renderHistorialPedidos();
  renderDashboard();
  renderPerfilUsuario();
  renderizarTarjetas();

  favoritosContainer.classList.remove("activado");
  carritoContainer.classList.remove("activado");

  sincronizarContenedorVacio(mostrarMensajeVacio);
  containers.forEach((c) => (c.style.zIndex = "-9"));
  body.style.overflowY = "hidden";

  const capaLateral = document.querySelector(".capaLateral");
  if (capaLateral) {
    capaLateral.remove();
    menuCategorias.classList.remove("activado");
  }

  loginContainer.classList.add("activado");
  const usuarioLogueado = state.usuarioActivo;
  if (usuarioLogueado) {
    if (width >= 768) {
      editarPerfil.classList.add("activado");
      perfilContainer.classList.add("activado");
      btnActivoFijo.classList.add("activado");
      imgVolver.classList.remove("activado");
      sincronizarLogoMarca();
    } else {
      perfilContainer.classList.add("activado");
      sincronizarLogoMarca();
    }
  } else {
    loginContainer.classList.add("activado");
    sincronizarLogoMarca();
    perfilContainer.classList.remove("activado");
  }
const exitLogInExiste = document.querySelector(".exitLogIn");

  if (!exitLogInExiste) {
    const exitLogIn = exitGenerico();
    exitLogIn.classList.add("exitLogIn");
    loginContainer.append(exitLogIn);

    exitLogIn.addEventListener("click", () => {
      cerrarPerfilLogin();
      exitLogIn.remove();
    });
  }
});
function sincronizarLogoMarca() {
  if (state.usuarioActivo) {
    logoMarca.classList.add("desactivado");
    formLogIn.classList.add("desactivado");
    opcionesLoginContainer.classList.add("desactivado");
  } else {
    logoMarca.classList.remove("desactivado");
    formLogIn.classList.remove("desactivado");
    opcionesLoginContainer.classList.remove("desactivado");
  }
}
/* ==============================
  5. EVENTOS DE TIENDA
============================== */
favoritosLogo.addEventListener("click", () => {
  favoritosContainer.classList.toggle("activado");
  carritoContainer.classList.remove("activado");
  buscarContainer.classList.remove("activado");
  cerrarZoom();
  if (favoritosContainer.classList.contains("activado")) {
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
    body.style.overflowY = "hidden";
  } else {
    const algunoActivado = [...containers].some((container) =>
      container.classList.contains("activado"),
    );

    if (!algunoActivado) {
      body.style.overflowY = "";
    }
  }

  sincronizarContenedorVacio();
});
carritoLogo.addEventListener("click", () => {
  carritoContainer.classList.toggle("activado");
  favoritosContainer.classList.remove("activado");
  buscarContainer.classList.remove("activado");

  detallesCompra();
  sincronizarBotonCarrito();
  sincronizarContenedorVacio();
  cerrarZoom();
  if (carritoContainer.classList.contains("activado")) {
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
    body.style.overflowY = "hidden";
  } else {
    const algunoActivado = [...containers].some((container) =>
      container.classList.contains("activado"),
    );

    if (!algunoActivado) {
      body.style.overflowY = "";
    }
  }
});
carritoLogo.addEventListener("mouseenter", () => {
  if (!carritoContainer.classList.contains("activado")) {
    const cantidad = Array.isArray(carrito) ? carrito.length : 0;
    if (cantidad > 0) {
      miniModalCarrito.classList.add("activado");
      miniModalCarritoContainer.classList.add("activado");
    }
  }
if (
    favoritosContainer.classList.contains("activado") ||
    carritoContainer.classList.contains("activado")
  ) {
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
  }
});

miniModalCarrito.addEventListener("mouseleave", () => {
  if (!miniModalCarrito.matches(":hover")) {
    const cantidad = Array.isArray(carrito) ? carrito.length : 0;
    if (cantidad > 0) {
      miniModalCarrito.classList.remove("activado");
      miniModalCarritoContainer.classList.remove("activado");
    }
if (
      favoritosContainer.classList.contains("activado") ||
      carritoContainer.classList.contains("activado")
    ) {
      miniModalCarrito.classList.remove("activado");
      miniModalCarritoContainer.classList.remove("activado");
    }
  }
});
eliminarTodoLosProductos.addEventListener("click", () => {
  if (!Array.isArray(carrito) || carrito.length === 0) {
    return;
  }

  const modalConfirm = document.createElement("div");
  modalConfirm.classList.add("eliminarProductosConfirmar");
  const modalContent = document.createElement("div");
  modalContent.classList.add("eliminarTodoConfirmarModalCompra");
  const mensaje = document.createElement("p");
  mensaje.textContent = "¿Seguro que quieres eliminar todos los productos?";
  const btnSi = document.createElement("button");
  btnSi.textContent = "Sí";
  const btnNo = document.createElement("button");
  btnNo.textContent = "No";

  modalContent.appendChild(mensaje);
  btnSi.addEventListener("click", () => {
    carrito.length = 0;
    renderModalCompra();
    renderCarrito();
    if (width >= 768) renderMiniModalCarrito();
    document.body.removeChild(modalConfirm);

    modalComprarContainer.classList.remove("activado");
    renderCarrito();
    renderMiniModalCarrito();
    renderModalCompra();
    sincronizarBotonCarrito();
  });
  btnNo.addEventListener("click", () => {
    document.body.removeChild(modalConfirm);
  });
  modalContent.append(mensaje, btnSi, btnNo);
  modalConfirm.append(modalContent);
  document.body.appendChild(modalConfirm);
});
document.getElementById("uploadImage").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!state.usuarioActivo) {
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    return;
  }
  if (!file.type.startsWith("image/")) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const nuevaImagen = event.target.result;

    state.usuarioActivo.imagen = nuevaImagen;

    const usuarioKey = Object.keys(state.usuarios).find(
      (key) => state.usuarios[key].username === state.usuarioActivo.username,
    );

    if (usuarioKey) {
      state.usuarios[usuarioKey].imagen = nuevaImagen;
    }

    const imagenUsuario = document.getElementById("imagenUsuario");
    if (imagenUsuario) {
      imagenUsuario.src = nuevaImagen;
    }

    const imgLoginHeader = document.querySelector(".userlogInActivo");
    if (imgLoginHeader) {
      imgLoginHeader.src = nuevaImagen;
    }
  };

  reader.readAsDataURL(file);

  e.target.value = "";
});
const verificacionTarjeta = document.querySelector(".form-tarjetas-pago");

let metodoPago = "";
const btnFormaPagoVisa = document.querySelector(".btn-forma-pago-visa");
const btnFormaPagoMastercard = document.querySelector(
  ".btn-forma-pago-mastercard",
);
const btnFormaPagoPaypal = document.querySelector(".btn-forma-pago-paypal");
const imgTarjetaIcon = document.getElementById("img-tarjeta-icon");
const imgPaypalIcon = document.getElementById("img-paypal-icon");
const imgPaypalIconConfirmar = document.getElementById(
  "img-paypal-icon-confirmar",
);
export function actualizarIconoTarjeta(metodo) {
  const imgTarjetas = {
    Visa: assets.visa.src,
    Mastercard: assets.mastercard.src,
    Paypal: assets.paypal.src,
  };
  imgTarjetaIcon?.classList.remove("imgInputTarjetaActiva");
  imgPaypalIcon?.classList.remove("imgInputTarjetaActiva");
  imgPaypalIconConfirmar?.classList.remove("imgInputTarjetaActiva");

  if (metodo === "Visa" || metodo === "Mastercard") {
    imgTarjetaIcon.src = imgTarjetas[metodo];
    imgTarjetaIcon.classList.add("imgInputTarjetaActiva");
  }

  if (metodo === "Paypal") {
    imgPaypalIcon.src = imgTarjetas.Paypal;
    imgPaypalIconConfirmar.src = imgTarjetas.Paypal;

    imgPaypalIcon.classList.add("imgInputTarjetaActiva");
    imgPaypalIconConfirmar.classList.add("imgInputTarjetaActiva");
  }
}

function activarBoton(boton) {
  btnFormaPagoVisa.classList.remove("activado");
  btnFormaPagoMastercard.classList.remove("activado");
  btnFormaPagoPaypal.classList.remove("activado");

  boton.classList.add("activado");
}
const formTarjetasPago = document.querySelector(".form-tarjetas-pago");
const formPaypalPago = document.querySelector(".form-paypal-pago");
btnFormaPagoVisa.addEventListener("click", () => {
  activarBoton(btnFormaPagoVisa);
  metodoPago = "Visa";
  actualizarIconoTarjeta(metodoPago);

  formTarjetasPago.classList.remove("desactivado");
  formPaypalPago.classList.remove("activado");
});

btnFormaPagoMastercard.addEventListener("click", () => {
  activarBoton(btnFormaPagoMastercard);
  metodoPago = "Mastercard";
  actualizarIconoTarjeta(metodoPago);

  formTarjetasPago.classList.remove("desactivado");
  formPaypalPago.classList.remove("activado");
});

btnFormaPagoPaypal.addEventListener("click", () => {
  activarBoton(btnFormaPagoPaypal);
  metodoPago = "Paypal";
  actualizarIconoTarjeta(metodoPago);

  formTarjetasPago.classList.add("desactivado");
  formPaypalPago.classList.add("activado");
});
function procesarPagoConTarjeta() {
  // Payment data is validated locally; no payment provider call is made.
  const nombre = verificacionTarjeta.nombre?.value.trim() || "";
  const numeroInput = verificacionTarjeta.querySelector(
    "#input-numero-tarjeta-compra",
  );
  const numeroTarjeta = numeroInput ? numeroInput.value.trim() : "";
  const cvc = verificacionTarjeta.cvc?.value.trim() || "";
  const fechaInput = verificacionTarjeta.querySelector(
    ".fecha-expiracion-container input",
  );
  const fecha = fechaInput ? fechaInput.value.trim() : "";
  if (!nombre) {
    verificacionTarjeta.nombre?.focus();
    return false;
  }

  const numeroSoloDigitos = numeroTarjeta.replace(/\D/g, "");
  if (numeroSoloDigitos.length !== 10) {
    numeroInput?.focus();
    return false;
  }

  if (!/^\d{3,4}$/.test(cvc)) {
    verificacionTarjeta.cvc?.focus();
    return false;
  }

  if (!/^\d{2}\/\d{2}$/.test(fecha)) {
    fechaInput?.focus();
    return false;
  }

  const [mes, anio] = fecha.split("/").map(Number);
  if (mes < 1 || mes > 12) {
    fechaInput?.focus();
    return false;
  }
  const ahora = new Date();
  const anioActual = ahora.getFullYear() % 100;
  if (
    anio < anioActual ||
    (anio === anioActual && mes < ahora.getMonth() + 1)
  ) {
    fechaInput?.focus();
    return false;
  }

  const metodoPagoFinal = metodoPago;
  if (!metodoPagoFinal) {
    return false;
  }

  const cliente = state.usuarioActivo;
  if (!cliente) {
    alert(" ¡Hola! Para continuar, necesitas iniciar sesión.");
    return false;
  }

  if (carrito.length === 0) {
    return false;
  }

  limpiarFacturasAnteriores();

  document.getElementById("form-tarjetas-pago").reset();
  const { numeroPedido, totalFinal } = generarFactura(
    cliente,
    carrito,
    numeroTarjeta,
    metodoPagoFinal,
  );
  const numeroTarjetaLimpio = numeroTarjeta.replace(/\D/g, "");
  const tarjetaUltimos4 = numeroTarjetaLimpio.slice(-4);
  estadosPedidosTabla.push({
    numeroPedido: numeroPedido,
    fecha: new Date().toLocaleDateString("es-ES"),
    estado: "confirmado",

    total: parseFloat(totalFinal.toFixed(2)),
    totalFinal: parseFloat(totalFinal.toFixed(2)),
    usuario: cliente.nombre,
    direccion: cliente.direccion || "",
    correo: cliente.correo || "",
    telefono: cliente.telefono || "",
    metodoPago: metodoPagoFinal,
    tarjetaUltimos4: tarjetaUltimos4,

    productos: carrito.map((item) => ({
      id: item.id,
      nombre: item.descripcion || item.alt,
      pedido: item.productos,
      precio: item.precio,
      cantidad: item.cantidad,
      talla: item.talla,
      imagen: item.src,
      alt: item.alt,
    })),
  });

  renderEstadoTabla();
  renderDashboard();
  saveToLocalStorage();
  renderPrincipalResize();

  carrito.length = 0;
  saveToLocalStorage();
  loadAssets();

  return true;
}
function limpiarFacturasAnteriores() {
  document.querySelectorAll(".facturas-modal").forEach((modal) => {
    modal.remove();
  });
}
verificacionTarjeta.addEventListener("submit", (e) => {
  e.preventDefault();

  const exito = procesarPagoConTarjeta();

  if (exito) {
    modalComprarContainer.classList.remove("activado");
  }
});
function procesarPagoConPaypal() {
  const titular =
    formPaypalPago.querySelector("#titular-paypal-pago")?.value.trim() || "";
  const email =
    formPaypalPago.querySelector("#email-paypal")?.value.trim() || "";
  const confirmEmail =
    formPaypalPago.querySelector("#confirm-email-paypall")?.value.trim() || "";
  if (!titular) {
    formPaypalPago.querySelector("#titular-paypal-pago")?.focus();
    return false;
  }

  if (!email) {
    formPaypalPago.querySelector("#email-paypal")?.focus();
    return false;
  }

  if (email !== confirmEmail) {
    formPaypalPago.querySelector("#confirm-email-paypall")?.focus();
    return false;
  }
  const metodoPagoFinal = "Paypal";
  const cliente = state.usuarioActivo;
  if (!cliente) {
    if (!cliente) {
      alert(" ¡Hola! Para continuar, necesitas iniciar sesión.");
      return false;
    }
    return false;
  }

  if (carrito.length === 0) {
    return false;
  }

  limpiarFacturasAnteriores();

  document.getElementById("form-paypal-pago").reset();
  const { numeroPedido, totalFinal } = generarFactura(
    cliente,
    carrito,
    email,
    metodoPagoFinal,
  );
  const partesEmail = email.split("@");
  const usuarioEmail = partesEmail[0];
  const dominioEmail = partesEmail[1] || "";

  const cuentaPaypal =
    usuarioEmail.length > 3
      ? `${usuarioEmail.slice(0, 3)}****@${dominioEmail}`
      : `${usuarioEmail}****@${dominioEmail}`;
  estadosPedidosTabla.push({
    numeroPedido,
    fecha: new Date().toLocaleDateString("es-ES"),
    estado: "confirmado",

    total: parseFloat(totalFinal.toFixed(2)),
    totalFinal: parseFloat(totalFinal.toFixed(2)),
    usuario: cliente.nombre,
    direccion: cliente.direccion || "",
    correo: cliente.correo || "",
    telefono: cliente.telefono || "",
    metodoPago: metodoPagoFinal,
    cuentaPaypal: cuentaPaypal,

    productos: carrito.map((item) => ({
      id: item.id,
      nombre: item.descripcion || item.alt,
      precio: item.precio,
      cantidad: item.cantidad,
      talla: item.talla,
      imagen: item.src,
      alt: item.alt,
    })),
  });

  renderEstadoTabla();
  renderDashboard();
  saveToLocalStorage();
  renderPrincipalResize();

  carrito.length = 0;
  saveToLocalStorage();
  loadAssets();

  return true;
}
formPaypalPago.addEventListener("submit", (e) => {
  e.preventDefault();

  const exito = procesarPagoConPaypal();

  if (exito) {
    modalComprarContainer.classList.remove("activado");
  }
});
export function generarFactura(
  cliente,
  carrito,
  numeroInputUsuario,
  metodoPago,
  pedidoExistente = null,
) {
  if (!carrito || carrito.length === 0) {
    console.warn("The cart is empty.");
    return;
  }
  const numeroPedido = pedidoExistente
    ? pedidoExistente.numeroPedido
    : generarNumeroPedido();
  const subtotal = pedidoExistente
    ? pedidoExistente.productos.reduce(
        (total, p) => total + Number(p.precio || 0) * Number(p.cantidad || 0),
        0,
      )
    : calcularSubtotal();
  const descuento = carrito.length > 0 ? 9.36 : 0;
  const iva = subtotal * 0.15;
  const totalFinal = pedidoExistente
    ? Number(pedidoExistente.totalFinal ?? pedidoExistente.total ?? 0)
    : subtotal + iva - descuento;
  const fechaFactura = pedidoExistente
    ? pedidoExistente.fecha
    : new Date().toLocaleDateString();

  const template = document.getElementById("factura-template");

  if (!template) {
    console.error("Invoice template #factura-template was not found");

    return {
      numeroPedido,
      totalFinal,
    };
  }
  document.querySelectorAll(".facturas-modal").forEach((el) => el.remove());

  let valorMostrado = "";

  if (metodoPago && metodoPago.toLowerCase() === "paypal") {
    if (pedidoExistente?.cuentaPaypal) {
      valorMostrado = pedidoExistente.cuentaPaypal;
    } else {
      const email = (numeroInputUsuario || "").trim();

      if (email.includes("@")) {
        const [localPart, dominio] = email.split("@");

        const primeraParte =
          localPart.length <= 3 ? localPart : localPart.substring(0, 3);

        valorMostrado = `${primeraParte}****@${dominio}`;
      }
    }
  } else {
    if (pedidoExistente?.tarjetaUltimos4) {
      valorMostrado = `******${pedidoExistente.tarjetaUltimos4}`;
    } else {
      const soloNumeros = (numeroInputUsuario || "").replace(/\D/g, "");

      if (soloNumeros.length >= 4) {
        valorMostrado = "******" + soloNumeros.slice(-4);
      }
    }
  }

  const productosPrimeraPagina = 6;
  const productosPaginasIntermedias = 18;
  const productosUltimaPagina = 12;
  const totalProductos = carrito.length;

  let totalPaginas = 1;

  if (totalProductos > productosPrimeraPagina) {
    const productosRestantes = totalProductos - productosPrimeraPagina;

    if (productosRestantes <= productosUltimaPagina) {
      totalPaginas = 2;
    } else {
      const productosDespuesDePrimera =
        productosRestantes - productosUltimaPagina;

      const paginasIntermedias = Math.ceil(
        productosDespuesDePrimera / productosPaginasIntermedias,
      );

      totalPaginas = 1 + paginasIntermedias + 1;
    }
  }
  const pageSizes = [];

  if (totalProductos <= productosPrimeraPagina) {
    pageSizes.push(totalProductos);
  } else {
    pageSizes.push(productosPrimeraPagina);

    let remaining = totalProductos - productosPrimeraPagina;
    const numAfter = totalPaginas - 1;

    if (numAfter === 1) {
      pageSizes.push(remaining);
    } else {
      const numInter = numAfter - 1;
      const interSizes = [];
      let tempRemaining = remaining;

      for (let i = 0; i < numInter; i++) {
        const take = Math.min(productosPaginasIntermedias, tempRemaining);
        interSizes.push(take);
        tempRemaining -= take;
      }

      let lastSize = tempRemaining;
      if (lastSize === 0 && numInter > 0) {
        interSizes[numInter - 1] -= 1;
        lastSize = 1;
      }

      pageSizes.push(...interSizes);
      pageSizes.push(lastSize);
    }
  }

  const modalContainer = document.createElement("div");

  modalContainer.className = "facturas-modal activado";

  if (modalContainer.classList.contains("activado")) {
    body.style.overflowY = "hidden";
  }

  if (totalPaginas > 1) {
    modalContainer.classList.add("multi-pagina");
  }

  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    const esPrimeraPagina = pagina === 0;
    const esUltimaPagina = pagina === totalPaginas - 1;
    let inicio = 0;
    for (let i = 0; i < pagina; i++) {
      inicio += pageSizes[i];
    }
    const fin = inicio + pageSizes[pagina];

    const productosPagina = carrito.slice(inicio, fin);
    const cloneModal = template.content.cloneNode(true);

    const facturaContainer = cloneModal.querySelector(".factura-container");

    const facturaWrapper = cloneModal.querySelector(".factura-wrapper");

    const exitFacturaTemplate = cloneModal.querySelector(".exit-factura");

    if (!facturaContainer || !facturaWrapper) {
      continue;
    }

    facturaWrapper.setAttribute("data-pagina", pagina + 1);

    facturaWrapper.setAttribute("data-total-paginas", totalPaginas);

    if (esUltimaPagina) {
      facturaWrapper.setAttribute("data-es-ultima", "true");
    }

    if (esPrimeraPagina) {
      const facturaPedidoEl = facturaWrapper.querySelector(".factura-pedido");

      const facturaFechaEl = facturaWrapper.querySelector(".factura-fecha");

      const facturaTotalEl = facturaWrapper.querySelector(".factura-total");

      if (facturaPedidoEl) {
        facturaPedidoEl.textContent = numeroPedido;
      }

      if (facturaFechaEl) {
        facturaFechaEl.textContent = fechaFactura;
      }

      if (facturaTotalEl) {
        facturaTotalEl.textContent = `$${totalFinal.toFixed(2)}`;

        facturaTotalEl.classList.add("precioFinalPortada");
      }
      const clienteNombreEl = facturaWrapper.querySelector(".cliente-nombre");

      const clienteDireccionEl =
        facturaWrapper.querySelector(".cliente-direccion");

      const clienteCorreoEl = facturaWrapper.querySelector(".cliente-correo");

      const clienteTelefonoEl =
        facturaWrapper.querySelector(".cliente-telefono");

      if (clienteNombreEl) {
        clienteNombreEl.textContent =
          cliente?.nombre || pedidoExistente?.usuario || "";
      }

      if (clienteDireccionEl) {
        clienteDireccionEl.textContent =
          cliente?.direccion || pedidoExistente?.direccion || "";
      }

      if (clienteCorreoEl) {
        clienteCorreoEl.textContent =
          cliente?.correo || pedidoExistente?.correo || "";
      }

      if (clienteTelefonoEl) {
        clienteTelefonoEl.textContent =
          cliente?.telefono || pedidoExistente?.telefono || "";
      }
    }

    const tbody = facturaWrapper.querySelector(".factura-productos");

    if (tbody) {
      tbody.innerHTML = "";

      productosPagina.forEach((p) => {
        const tr = document.createElement("tr");

        const precio = Number(p.precio || 0);
        const cantidad = Number(p.cantidad || 0);

        tr.innerHTML = `
            <td>${(
              (p.nombre || p.alt || "Producto") +
              (p.talla ? " - " + p.talla : "")
            ).toUpperCase()}</td>

            <td>${cantidad}</td>

            <td>$${precio.toFixed(2)}</td>

            <td>$${(precio * cantidad).toFixed(2)}</td>
          `;

        tbody.appendChild(tr);
      });
    }

    if (esUltimaPagina) {
      const subtotalEl = facturaWrapper.querySelector(".factura-subtotal");

      const ivaEl = facturaWrapper.querySelector(".factura-iva");

      const descuentoEl = facturaWrapper.querySelector(".factura-descuento");

      const totalFinalEl = facturaWrapper.querySelector(".factura-total-final");

      const tipoPagoEl = facturaWrapper.querySelector(".tipo-forma-pago");

      const numeroCuentaEl = facturaWrapper.querySelector(".numero-cuenta");

      if (subtotalEl) {
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      }

      if (ivaEl) {
        ivaEl.textContent = `$${iva.toFixed(2)}`;
      }

      if (descuentoEl) {
        descuentoEl.textContent = `$${descuento.toFixed(2)}`;
      }

      if (totalFinalEl) {
        totalFinalEl.textContent = `$${totalFinal.toFixed(2)}`;
      }

      if (tipoPagoEl) {
        tipoPagoEl.textContent = metodoPago || "";
      }

      if (numeroCuentaEl) {
        numeroCuentaEl.textContent = valorMostrado;
      }
    }

    const paginaNumero = facturaWrapper.querySelector(".pagina-numero");

    if (paginaNumero) {
      const actual = paginaNumero.querySelector(".num-pagina-actual");

      const total = paginaNumero.querySelector(".total-paginas");

      if (actual) {
        actual.textContent = pagina + 1;
      }

      if (total) {
        total.textContent = totalPaginas;
      }
    }

    const ultimaOnly = facturaWrapper.querySelectorAll(".ultima-pagina-only");

    ultimaOnly.forEach((el) => {
      el.style.display = esUltimaPagina ? "" : "none";
    });
    modalContainer.appendChild(facturaContainer);
    if (pagina === 0 && exitFacturaTemplate) {
      modalContainer.appendChild(exitFacturaTemplate);
    }
  }

  document.body.appendChild(modalContainer);
  loadAssets();

  const exitFactura = modalContainer.querySelector(".exit-factura");

  if (exitFactura) {
    exitFactura.classList.add("activado");

    exitFactura.style.display = "flex";

    exitFactura.onclick = cerrarFactura;
  }

  const btnDescargarContainer = document.querySelector(
    ".btn-descargar-factura-container",
  );

  if (btnDescargarContainer) {
    document.body.appendChild(btnDescargarContainer);

    btnDescargarContainer.classList.add("activado");

    btnDescargarContainer.style.display = "flex";

    const btnDescargar = btnDescargarContainer.querySelector(
      ".btn-descargar-factura",
    );

    if (btnDescargar) {
      btnDescargar.onclick = descargarFacturaPDF;
    }
  }

  return {
    numeroPedido,
    totalFinal,
  };
}
export function cerrarFactura() {
  renderCarrito();
  renderMiniModalCarrito();
  sincronizarBotonCarrito();
  sincronizarContenedorVacio();

  document.querySelectorAll(".facturas-modal").forEach((modal) => {
    modal.classList.remove("activado");
    modal.remove();
  });

  const btnDescargarFacturaContainer = document.querySelector(
    ".btn-descargar-factura-container",
  );

  if (btnDescargarFacturaContainer) {
    btnDescargarFacturaContainer.classList.remove("activado");
    btnDescargarFacturaContainer.style.display = "none";
  }

  if (Array.from(containers).some((c) => c.classList.contains("activado"))) {
    containers.forEach((c) => {
      c.classList.remove("activado");
    });
  }
  if (!perfilContainer.classList.contains("activado")) {
    body.style.overflowY = "";
  }
}
export async function descargarFacturaPDF() {
  const facturaContainers = document.querySelectorAll(".factura-container");

  if (!facturaContainers.length) {
    return;
  }

  const pdfContainer = document.createElement("div");
  pdfContainer.className = "pdf-temp-container";
pdfContainer.style.background = "#fff";

  facturaContainers.forEach((container, index) => {
    const clone = container.cloneNode(true);
    const wrapper = clone.querySelector(".factura-wrapper");
    if (wrapper) {
      const isLastPage = index === facturaContainers.length - 1;

      if (!isLastPage) {
        const totales = wrapper.querySelector(".totales-factura");
        const pago = wrapper.querySelector(".detalles-pago");
        if (totales) totales.style.display = "none";
        if (pago) pago.style.display = "none";
      } else {
        const totales = wrapper.querySelector(".totales-factura");
        const pago = wrapper.querySelector(".detalles-pago");
        if (totales) totales.style.display = "block";
        if (pago) pago.style.display = "block";
      }
    }

    pdfContainer.appendChild(clone);
  });
  document.body.appendChild(pdfContainer);

  await new Promise((resolve) => setTimeout(resolve, 400));

  const opt = {
    filename: `Factura_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 1.2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["css"],
    },
  };

  try {
    await html2pdf().set(opt).from(pdfContainer).save();
  } catch (e) {
    console.error("Error generating PDF:", e);
  } finally {
    pdfContainer.remove();
  }
}

/* ==============================
  6. EVENTOS DE CATEGORÍAS
============================== */
btnCategoriaMujer.classList.add("activado");

function toggleMujer() {
  btnCategoriaMujer.addEventListener("click", () => {
    btnCategoriaMujer.classList.add("activado");
    btnCategoriaHombre.classList.remove("activado");
    toggleBtnMujer.classList.remove("activadoMujer");
    toggleBtnHombre.classList.remove("activadoHombre");
    document
      .querySelectorAll(".producto-hombre-menu")
      .forEach((p) => (p.style.display = "none"));
    document
      .querySelectorAll(".producto-mujer-menu")
      .forEach((p) => (p.style.display = "flex"));
  });

  btnCategoriaMujer.addEventListener("mouseenter", () => {});
  btnCategoriaMujer.addEventListener("mouseleave", () => {});
}

function toggleHombre() {
  btnCategoriaHombre.addEventListener("click", () => {
    btnCategoriaHombre.classList.add("activado");
    btnCategoriaMujer.classList.remove("activado");
    toggleBtnHombre.classList.add("activadoHombre");
    toggleBtnMujer.classList.add("activadoMujer");
    document
      .querySelectorAll(".producto-mujer-menu")
      .forEach((p) => (p.style.display = "none"));
    document
      .querySelectorAll(".producto-hombre-menu")
      .forEach((p) => (p.style.display = "flex"));
  });

  btnCategoriaHombre.addEventListener("mouseenter", () => {});
  btnCategoriaHombre.addEventListener("mouseleave", () => {});
}

toggleMujer();
toggleHombre();
export function renderCategoria(categoria) {
  const container = document.querySelector(
    `.categoria-${categoria}-container[data-template="${categoria}"]`,
  );

  if (!container) return;

  const template = container.querySelector("template");

  if (!template) return;

  categorias[categoria].forEach((item) => {
    const clone = template.content.cloneNode(true);
    const productoMenu = clone.querySelector(`.producto-${categoria}-menu`);

    if (productoMenu) {
      productoMenu.querySelector("h3").textContent = item.nombre;

      const img = productoMenu.querySelector("img");
      const coleccion = categoria === "mujer" ? dataMujeres : dataHombres;
      const clave = item.nombre.toLowerCase();
      img.src = coleccion[clave]?.[3]?.src || "";
      img.alt = item.nombre;

      productoMenu.addEventListener("click", toggleGridLateral);

      container.appendChild(clone);
    }
  });
}
function toggleGridLateral(event) {
  const elementoClickeado = event.currentTarget;
  const titulo = elementoClickeado.querySelector("h3").textContent.trim();
  const contenedorPadre = elementoClickeado.closest("[data-template]");
  const genero = contenedorPadre ? contenedorPadre.dataset.template : null;
  const mapaMujerCategorias = {
    Vestidos: ".vestidos-container",
    Blusas: ".blusas-container",
    Pantalones: ".pantalones-mujer-container",
    Faldas: ".faldas-container",
    Conjuntos: ".conjuntos-mujer-container",
    Accesorios: ".accesorios-mujer-container",
  };

  const mapaHombreCategorias = {
    Camisas: ".camisas-container",
    Zapatos: ".zapatos-container",
    Gorras: ".gorras-container",
    Pantalones: ".pantalones-hombre-container",
    Conjuntos: ".conjuntos-hombre-container",
    Accesorios: ".accesorios-hombre-container",
  };

  const mapaCategorias =
    genero === "mujer" ? mapaMujerCategorias : mapaHombreCategorias;
  const selectorContenedor = mapaCategorias[titulo];
  containers.forEach((c) => c.classList.remove("activado"));

  sincronizarBotonCarrito();
  sincronizarBotonFavorito();

  const capaLateral = document.querySelector(".capaLateral");
  const contenedorActivar = document.querySelector(selectorContenedor);
  if (contenedorActivar) {
    contenedorActivar.classList.add("activado");

    favoritosContainer.classList.remove("activado");
    carritoContainer.classList.remove("activado");
    buscarContainer.classList.remove("activado");
  }
  body.style.overflowY = "hidden";
  contenedorActivar.style.zIndex = "9";

  menuCategorias.classList.remove("activado");
  if (width >= 768) {
    menuCategorias.classList.add("activado");
    menuCategoriasContainer.classList.add("activado");
  }
  if (capaLateral) capaLateral.remove();
}

/* ==============================
  7. EVENTOS DE PERFIL
============================== */
const formPerfil = document.querySelector(".perfil-info");

formPerfil.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = state.usuarioActivo;

  if (!usuario) {
    return;
  }

  usuario.nombre = document.getElementById("nombre-usuario-perfil").value;
  usuario.genero = document.getElementById("genero-usuario-perfil").value;
  usuario.telefono = document.getElementById("telefono-usuario-perfil").value;
  usuario.correo = document.getElementById("correo-usuario-perfil").value;
  usuario.direccion = document.getElementById("direccion-usuario-perfil").value;

  document.querySelector(".nombre-perfil-usuario").textContent = usuario.nombre;
});
const formCambiarContraseña = document.querySelector(
  ".form-cambiar-contraseña-usuario",
);

formCambiarContraseña.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = state.usuarioActivo;
  if (!usuario) {
    return;
  }
  const contraseñaActual = document.getElementById(
    "contraseña-guardada-usuario",
  ).value;
  const nuevaContraseña = document.getElementById(
    "nueva-contraseña-usuario",
  ).value;
  const confirmarContraseña = document.getElementById(
    "confirm-contraseña-usuario",
  ).value;
  if (!contraseñaActual || !nuevaContraseña || !confirmarContraseña) {
    return;
  }
  if (contraseñaActual !== usuario.contraseña) {
    return;
  }
  if (nuevaContraseña !== confirmarContraseña) {
    return;
  }
  if (nuevaContraseña === usuario.contraseña) {
    return;
  }
  if (nuevaContraseña.length < 9) {
    return;
  }

  usuario.contraseña = nuevaContraseña;

  formCambiarContraseña.reset();
});
btnsPerfil.forEach((boton) => {
  boton.addEventListener("click", () => {
    const target = boton.getAttribute("data-target");
    const contenidoActivo = document.getElementById(target);

    if (!contenidoActivo) return;
    contenedoresPerfil.forEach((contenido) => {
      contenido.classList.remove("activado");
    });
    contenidoActivo.classList.add("activado");
    if (width <= 767) {
      const algunoActivado = [...contenedoresPerfil].some((contenido) =>
        contenido.classList.contains("activado"),
      );
      imgVolver.classList.toggle("activado", algunoActivado);
    }

    if (contenidoActivo.id === "metodosPago") {
      setMetodoPago("tarjeta");
    }
    btnsPerfil.forEach((btn) => {
      btn.classList.remove("activado", "suave");
    });

    boton.classList.add("activado");
  });
  boton.addEventListener("mouseenter", () => {
    btnsPerfil.forEach((btn) => {
      if (btn.classList.contains("activado")) {
        btn.classList.add("suave");
      }
    });
  });

  boton.addEventListener("mouseleave", () => {
    btnsPerfil.forEach((btn) => {
      btn.classList.remove("suave");
    });
  });

  btnsPerfil.forEach((btn) => {
    btn.classList.remove("suave");
    btn.classList.add("activado");
  });
});
imgVolver.addEventListener("click", () => {
  contenedoresPerfil.forEach((contenido) =>
    contenido.classList.remove("activado"),
  );
  renderPerfilUsuario();
  const nombrePerfilUsario = document.querySelector(".nombre-perfil-usuario");
  aplicarAnimacionLetras(nombrePerfilUsario);
  const encabezadoPedidoContainer = document.querySelector(
    ".encabezado-pedido-container",
  );
  const tablaEstadosPedidosContainer = document.querySelector(
    ".tabla-estados-pedidos-container",
  );

  if (encabezadoPedidoContainer) {
    encabezadoPedidoContainer.classList.remove("activado");
  }

  if (tablaEstadosPedidosContainer?.classList.contains("activado")) {
    tablaEstadosPedidosContainer.classList.remove("activado");
  }

  btnsPerfil.forEach((btn) => btn.classList.remove("activado", "suave"));

  imgVolver.classList.remove("activado");
});

function setMetodoPago(tipo) {
  btnVisaMastercard.classList.remove("activado");
  btnPaypal.classList.remove("activado");

  formTarjeta.classList.remove("desactivado");
  formPaypal.classList.remove("activado");

  if (tipo === "tarjeta") {
    btnVisaMastercard.classList.add("activado");
    formTarjeta.classList.remove("desactivado");
    formPaypal.classList.remove("activado");
  }

  if (tipo === "paypal") {
    btnPaypal.classList.add("activado");
    formTarjeta.classList.add("desactivado");
    formPaypal.classList.add("activado");
  }
}
btnVisaMastercard.addEventListener("click", () => {
  setMetodoPago("tarjeta");
});
btnPaypal.addEventListener("click", () => {
  setMetodoPago("paypal");
});
btnHistorial.addEventListener("click", () => {
  if (historialPedidos == 0) {
    alert("No hay Historial");
  } else {
    tablaEstadosPedidosContainer.classList.remove("activado");
    encabezadoPedidoContainer.classList.toggle("activado");
    renderHistorialPedidos();
    renderEstadoTabla();
  }
});
btnTablaPedido.addEventListener("click", () => {
  if (estadosPedidosTabla == 0) {
    alert("No hay Pedidos en la Tabla");
  } else {
    encabezadoPedidoContainer.classList.remove("activado");
    tablaEstadosPedidosContainer.classList.toggle("activado");
    renderHistorialPedidos();
    renderEstadoTabla();
  }
});
const btnCerrarSeccion = document.querySelector(".btn-cerrar-seccion");

btnCerrarSeccion.addEventListener("click", () => {
  state.usuarioActivo = null;
  saveToLocalStorage();

  iconoLogin.style.display = "block";
  const userlogInActivoAll = document.querySelectorAll(".userlogInActivo");
  userlogInActivoAll.forEach((i) => {
    i.style.display = "none";
  });
  perfilContainer.classList.remove("activado");
  loginContainer.classList.remove("activado");
  opcionesLoginContainer.classList.remove("desactivado");
  formLogIn.classList.remove("desactivado");
  sincronizarLogoMarca();
  contenedoresPerfil.forEach((c) => {
    c.classList.remove("activado");
  });
  btnsPerfil.forEach((c) => {
    c.classList.remove("activado");
  });
  const algunoActivado = [...containers].some((container) =>
    container.classList.contains("activado"),
  );

  if (!algunoActivado) {
    body.style.overflowY = "";
  }

  cerrarPerfilLogin();
});
/* ==============================
  8. EVENTOS LATERALES
============================== */
logInLateral.addEventListener("click", () => {
  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  const nombrePerfilUsario = document.querySelector(".nombre-perfil-usuario");
  aplicarAnimacionLetras(nombrePerfilUsario);
  favoritosContainer.style.zIndex = "-9";
  carritoContainer.style.zIndex = "-9";
  containers.forEach((c) => (c.style.zIndex = "-9"));

  cerrarZoom();
  const usuarioLogueado = state.usuarioActivo;

  if (usuarioLogueado) {
    loginContainer.classList.add("activado");
    perfilContainer.classList.add("activado");
    sincronizarLogoMarca();

    renderHistorialPedidos();
    renderDashboard();
    renderPerfilUsuario();
    renderizarTarjetas();
    mostrarMensajeSinTarjetas();
    if (width >= 768) {
      if (!editarPerfil.classList.contains("activado")) {
        btnActivoFijo.classList.remove("activado");
      }

      editarPerfil.classList.add("activado");
      btnActivoFijo.classList.add("activado");
    } else {
      imgVolver.classList.remove("activado");
      btnActivoFijo.classList.remove("activado");
    }
    containers.forEach((c) => (c.style.zIndex = "-9"));
    body.style.overflowY = "hidden";
  } else {
    loginContainer.classList.add("activado");
    perfilContainer.classList.remove("activado");
    sincronizarLogoMarca();
    const todosContenedores = [
      ...containersTienda,
      favoritosContainer,
      carritoContainer,
    ];

    const algunoActivo = todosContenedores.some((c) =>
      c.classList.contains("activado"),
    );

    if (algunoActivo && width >= 768) {
      body.style.overflowY = "hidden";
    }

    body.style.overflowY = "hidden";
  }
  const capaLateral = document.querySelector(".capaLateral");

  if (capaLateral) {
    capaLateral.remove();
  }

  const exitLogInLateralExiste = document.querySelector(".exitLogInLateral");

  if (exitLogInLateralExiste) {
    exitLogInLateralExiste.remove();
  }
const exitLogInExiste = document.querySelector(".exitLogIn");

  if (!exitLogInExiste) {
    const exitLogIn = exitGenerico();
    exitLogIn.classList.add("exitLogIn");
    loginContainer.append(exitLogIn);

    exitLogIn.addEventListener("click", () => {
      cerrarPerfilLogin();
      exitLogIn.remove();
    });
  }
});
function cerrarPerfilLogin() {
  loginContainer.classList.remove("activado");
  perfilContainer.classList.remove("activado");
  editarPerfil.classList.remove("activado");
  btnActivoFijo.classList.remove("activado");

  btnsPerfil.forEach((btn) => btn.classList.remove("activado", "suave"));
  contenedoresPerfil.forEach((contenido) => {
    contenido.classList.remove("activado");
  });

  encabezadoPedidoContainer.classList.remove("activado");
  tablaEstadosPedidosContainer.classList.remove("activado");
  imgVolver.classList.remove("activado");
  sincronizarLogoMarca();
  if (
    !favoritosContainer.classList.contains("activado") &&
    !carritoContainer.classList.contains("activado") &&
    !Array.from(containers).some((c) => c.classList.contains("activado"))
  ) {
    body.style.overflowY = "";
  }

  favoritosContainer.style.zIndex = "";
  carritoContainer.style.zIndex = "";
  containers.forEach((c) => (c.style.zIndex = ""));
}
favoritoLateral.addEventListener("click", () => {
  favoritosContainer.classList.add("activado");
  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  buscarContainer.classList.remove("activado");
  body.style.overflow = "hidden";
  const capaLateral = document.querySelector(".capaLateral");
  if (capaLateral) {
    capaLateral.remove();
    menuCategorias.classList.remove("activado");
  }

  sincronizarContenedorVacio();
});
carritoLateral.addEventListener("click", () => {
  carritoContainer.classList.add("activado");
  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  buscarContainer.classList.remove("activado");
  body.style.overflow = "hidden";
  detallesCompra();
  sincronizarBotonCarrito();
  sincronizarContenedorVacio();

  if (miniModalCarrito.classList.contains("activado")) {
    miniModalCarrito.classList.remove("activado");
  }

  menuCategorias.classList.remove("activado");
  const capaLateral = document.querySelector(".capaLateral");
  if (capaLateral) {
    capaLateral.remove();
    menuCategorias.classList.remove("activado");
  }
});

/* ==============================
  9. EXPORTS
============================== */

export { menuBtn };
