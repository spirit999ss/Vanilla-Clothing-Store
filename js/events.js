/* ==============================
   EVENTOS - ORDENADO
============================== */

/* ==============================
  1. IMPORTS
============================== */

/* Import Utils */
import {
  exitGenerico,
  hiddenCategorias,
  deleteProducto,
  crearCapaLateralConExit,
  abrirCapaLateral,
  cerrarCapaLateral,
} from "/js/utils.js";

/* Import SELECTORES DOM */
import {
  width,
  body,
  favoritoLateral,
  carritoLateral,
  header,
  menuBtn,
  menuCategorias,
  categoriasMenuLateralWrapper,
  btnCategoriaMujer,
  btnCategoriaHombre,
  toggleBtnMujer,
  toggleBtnHombre,
  vestidosMujerContainer,
  blusasMujerContainer,
  pantalonesMujerContainer,
  faldasMujerContainer,
  conjuntosMujerContainer,
  accesoriosMujerContainer,
  camisasHombreContainer,
  pantalonesHombreContainer,
  gorrasHombreContainer,
  zapatosHombreContainer,
  conjuntosHombreContainer,
  accesoriosHombreContainer,
  slider,
  sliderContainer,
  btnPrev,
  btnNext,
  modalComprarContainer,
  mostrarMensajeVacio,
  favoritosLogo,
  favoritosContainer,
  carritoLogo,
  carritoContainer,
  loginContainer,
  opcionesLoginContainer,
  iconoLogin,
  perfilContainer,
  inputBuscar,
  buscarInputBtn,
  btnBuscarContainer,
  buscarContainer,
  logInLogo,
  logInLateral,
  btnDescargarFactura,
  btnHistorial,
  btnTablaPedido,
  btnsPerfil,
  imgVolver,
  contenedoresPerfil,
  encabezadoPedidoContainer,
  miniModalCarrito,
  miniModalCarritoContainer,
  btnTarjetasPago,
  tablaEstadosPedidosContainer,
  containers,
  editarPerfil,
  btnActivoFijo,
  btnVisaMastercard,
  btnPaypal,
  formTarjeta,
  formPaypal,
} from "/js/selectors.js";

/* Import Render */
import {
  sincronizarContenedorVacio,
  cerrarZoom,
  detallesCompra,
  sincronizarBotonCarrito,
  calcularSubtotal,
  renderMiniModalCarrito,
  renderCarrito,
  renderizarTarjetas,
  renderHistorialPedidos,
  renderEstadoTabla,
  renderDashboard,
  renderPerfilUsuario,
  renderFacturaPedido,
  aplicarAnimacionLetras,
  renderProductosFiltrados,
  renderPrincipalResize,
  calcularAnchoCapaLateral,
  mostrarMensajeSinTarjetas,
  renderImgUsuario,
  irAlProductoSlider,
} from "/js/render.js";

/* Import State */
import {
  carrito,
  state,
  historialPedidos,
  estadosPedidosTabla,
  generarNumeroPedido,
} from "/js/state.js";

/* Import Data */
import { categorias } from "/js/data.js";
/* ==============================
  2. VARIABLES GLOBALES
============================== */

// Variables para login
const formLogIn = document.querySelector(".login-form");
const mensaje = document.getElementById("mensajeLogin");

const logoMarca = document.querySelector(".logo-marca");

// Datos de usuario
const nombreUsuario = "Messi Ronaldo";
const correoUsuario = "messironaldo33663@gmail.com";
const dineroGastado = 3600.0;
let pedidosRealizados = 0;

// Containers de tienda
const containersTienda = document.querySelectorAll(
  ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, .camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
);

// Template factura
const template = document.querySelector("#factura-template");
export let facturaContainer = null;

// Otros elementos
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

    irAlProductoSlider({
      currentTarget: img,
    });
  });
}

/* ==============================
  3. EVENTOS DE NAVEGACIÓN
============================== */

/* MENÚ CATEGORÍAS */
menuBtn.addEventListener("click", () => {
  const estaAbierto = menuCategorias.classList.contains("activado");

  if (estaAbierto) {
    cerrarCapaLateral();
  } else {
    abrirCapaLateral();

    // Activar menú
    menuCategorias.classList.add("activado");
    categoriasMenuLateralWrapper.classList.add("activado");
    body.style.overflowY = "hidden";

    const menuBtnContainer = document.querySelector(".menu-btn-container");
    if (menuBtnContainer) menuBtnContainer.classList.add("activado");

    // Limpiar otros contenedores
    containers.forEach((c) => c.classList.remove("activado"));
    favoritosContainer.classList.remove("activado");
    carritoContainer.classList.remove("activado");
  }
  //

  let capaLateral = document.querySelector(".capaLateral");

  if (!capaLateral) {
    capaLateral = crearCapaLateralConExit(body, () => {
      menuCategorias.classList.remove("activado");
      categoriasMenuLateralWrapper.classList.remove("activado");
      hiddenCategorias();

      capaLateral.remove();

      const menuBtnContainer = document.querySelector(".menu-btn-container");

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

/* BUSCADOR */
btnBuscarContainer.addEventListener("click", () => {
  const buscarContainer = document.querySelector(".buscar-container");

  // Le quitamos el z-Index de las Categorias
  containers.forEach((c) => c.classList.remove("activado"));

  carritoContainer.classList.remove("activado");
  favoritosContainer.classList.remove("activado");

  buscarContainer.classList.add("activado");
  body.style.overflowY = "hidden";

  if (!buscarContainer.querySelector(".exitContainer")) {
    const exit = exitGenerico({
      onClick: () => {
        // Le add el z-Index de las Categorias
        containers.forEach((c) => (c.style.zIndex = ""));
        buscarContainer.classList.remove("activado");
        hiddenCategorias();
      },
      containerClass: "exitBuscarContainer",
      imgClass: "exitBuscar",
    });
    buscarContainer.appendChild(exit);
  }
});

/* BUSCADOR - INPUT */
inputBuscar.addEventListener("input", () => {
  renderProductosFiltrados(inputBuscar.value.trim().toLowerCase());
});
//btn para Buscar

buscarInputBtn.addEventListener("click", () => {
  const buscarContainer = document.querySelector(".buscar-container");

  // Le quitamos el z-Index de las Categorias

  containers.forEach((c) => (c.style.zIndex = "-9"));

  carritoContainer.classList.remove("activado");

  favoritosContainer.classList.remove("activado");

  buscarContainer.classList.add("activado");

  body.style.overflowY = "hidden";

  renderProductosFiltrados(inputBuscar.value.trim().toLowerCase());
});
/* ==============================
  4. EVENTOS DE USUARIO
============================== */
/* LOGIN - FORMULARIO */
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

  // LOGIN EXITOSO
  state.usuarioActivo = usuarioEncontrado;

  // Guardar imagen del usuario
  if (usuarioEncontrado.imagen) {
    iconoLogin.style.display = "none";

    const userlogInActivo = document.createElement("img");
    userlogInActivo.src = usuarioEncontrado.imagen;
    userlogInActivo.alt = "Usuario logueado";
    userlogInActivo.classList.add("userlogInActivo");

    // Evitar duplicados de imagen
    logInLogo
      .querySelectorAll(".userlogInActivo")
      .forEach((img) => img.remove());
    logInLogo.append(userlogInActivo);
  }

  // === LIMPIAR ANTES DE ABRIR ===
  cerrarPerfilLogin();

  // Activar perfil según tamaño de pantalla
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
  //

  formLogIn.classList.add("desactivado");
  opcionesLoginContainer.classList.add("desactivado");
  logoMarca.classList.add("desactivado");

  // Renderizar contenido del perfil
  renderPerfilUsuario();
  renderHistorialPedidos();
  renderDashboard();
  renderizarTarjetas();

  // Limpiar formulario
  formLogIn.reset();

  // Z-index
  containers.forEach((c) => (c.style.zIndex = ""));
  favoritosContainer.classList.remove("activado");
  carritoContainer.classList.remove("activado");
  mostrarMensajeVacio.classList.remove("activado");
  favoritosContainer.style.zIndex = "";
  carritoContainer.style.zIndex = "";
  mostrarMensajeVacio.style.zIndex = "";

  console.log("Usuario logueado correctamente:", state.usuarioActivo);
});
//Eventos de Diferentes tipos de Iniciar Seccion
document
  .querySelectorAll(".opcion-caja")
  .forEach((t) => t.addEventListener("click", () => alert("Próximamente :)")));
/* */
// Abrir modal
const btnCrearCuenta = document.getElementById("btn-crear-cuenta");
const modal = document.getElementById("modal-registro");
const cerrarModal = document.querySelector(".cerrar-modal");

btnCrearCuenta.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

// Cerrar modal
cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar al hacer clic fuera del contenido
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Manejar envío del formulario
const formRegistro = document.querySelector(".modal-registro");

// Formulario de registro
formRegistro.addEventListener("submit", (e) => {
  e.preventDefault();

  // Obtener valores
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

  // Validación básica
  if (
    !nombre ||
    !username ||
    !genero ||
    !correo ||
    !contraseña ||
    !confirmarContraseña ||
    !direccion
  ) {
    alert("Por favor, completa todos los campos obligatorios.");
    return;
  }

  // Validación de contraseñas
  if (contraseña !== confirmarContraseña) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // Crear usuario
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

  console.log("Usuarios en state:", state.usuarios);
  console.log("Nuevo usuario registrado con ID:", nuevoId);

  // Cerrar modal
  modal.style.display = "none";

  // Limpiar formulario

  alert("Usuario registrado correctamente ✔");
});

// Función para agregar usuario
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

/* */
/* LOGIN - HEADER */
logInLogo.addEventListener("click", () => {
  // ====================== PERFIL / LOGIN ======================
  const nombrePerfilUsario = document.querySelector(".nombre-perfil-usuario");
  aplicarAnimacionLetras(nombrePerfilUsario);

  cerrarPerfilLogin();

  renderHistorialPedidos();
  renderDashboard();
  renderPerfilUsuario();
  renderizarTarjetas();

  favoritosContainer.style.zIndex = "-9";
  carritoContainer.style.zIndex = "-9";
  containers.forEach((c) => (c.style.zIndex = "-9"));
  body.style.overflowY = "hidden";

  const capaLateral = document.querySelector(".capaLateral");
  if (capaLateral) {
    capaLateral.remove();
    menuCategorias.classList.remove("activado");
  }
  //Abrir los contenedores Principales

  loginContainer.classList.add("activado");
  //Verificar si esta Loguiado
  const usuarioLogueado = state.usuarioActivo;

  if (usuarioLogueado) {
    logoMarca.classList.add("desactivado");
    if (width >= 768) {
      editarPerfil.classList.add("activado");
      perfilContainer.classList.add("activado");
      btnActivoFijo.classList.add("activado");
      imgVolver.classList.remove("activado");
    } else {
      perfilContainer.classList.add("activado");
    }
  } else {
    loginContainer.classList.add("activado");
    logoMarca.classList.remove("desactivado");
    perfilContainer.classList.remove("activado");
  }

  /* ====================== EXIT LOGIN ====================== */
  const exitLogInExiste = document.querySelector(".exitLogIn");

  if (!exitLogInExiste) {
    const exitLogIn = exitGenerico();
    exitLogIn.classList.add("exitLogIn");
    loginContainer.append(exitLogIn);

    exitLogIn.addEventListener("click", () => {
      cerrarPerfilLogin();
      exitLogIn.remove();
      console.log("Perfil cerrado desde exit");
    });
  }
});
//Guardamos Datos en el Local Storage $$$999
//EL que eestaba antes
/*
function cargarUsuarioActivo() {
  const usuarioGuardado = localStorage.getItem("usuarioActivo");

  if (usuarioGuardado) {
    try {
      const usuario = JSON.parse(usuarioGuardado);
      state.usuarioActivo = usuario;

      // Actualizar interfaz
      iconoLogin.style.display = "none";

      const userlogInActivo = document.createElement("img");
      userlogInActivo.src = "Assets/userlogInActivo.png";
      userlogInActivo.alt = "Usuario logueado";
      userlogInActivo.classList.add("userlogInActivo");

      logInLogo.appendChild(userlogInActivo);

      //perfilContainer.classList.add("activado");
      opcionesLoginContainer.classList.add("desactivado");
      formLogIn.classList.add("desactivado");
      logoMarca.classList.add("desactivado");

      console.log("Usuario cargado desde localStorage:", usuario);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      localStorage.removeItem("usuarioActivo");
    }
  }
}*/
/*
export function cargarUsuarioActivo() {
  const usuarioGuardado = localStorage.getItem("usuarioActivo");

  if (usuarioGuardado) {
    try {
      const usuario = JSON.parse(usuarioGuardado);
      state.usuarioActivo = usuario;

      iconoLogin.style.display = "none";
      opcionesLoginContainer.classList.add("desactivado");
      formLogIn.classList.add("desactivado");
      logoMarca.classList.add("desactivado");

      renderImgUsuario();

      console.log("Usuario cargado:", usuario);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      localStorage.removeItem("usuarioActivo");
      renderImgUsuario();
    }
  } else {
    renderImgUsuario(); // CASO A
  }
}*/
/*
export function cargarUsuarioActivo() {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    iconoLogin.style.display = "block";
  }
  if (usuarioActivo) {
    try {
      const usuario = JSON.parse(usuarioActivo);
      state.usuarioActivo = usuario;

      opcionesLoginContainer.classList.add("desactivado");
      formLogIn.classList.add("desactivado");
      logoMarca.classList.add("desactivado");

      //renderImgUsuario();

      console.log("Usuario cargado:", usuario);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      localStorage.removeItem("usuarioActivo");
      state.usuarioActivo = null;
      //renderImgUsuario();
    }
  } else {
    state.usuarioActivo = null;
    //renderImgUsuario();
  }
}

cargarUsuarioActivo();*/
/* ==============================
  5. EVENTOS DE TIENDA
============================== */

/* FAVORITOS */
favoritosLogo.addEventListener("click", () => {
  favoritosContainer.classList.toggle("activado");
  carritoContainer.classList.remove("activado");
  //
  buscarContainer.classList.remove("activado");

  // Ocultar mini modal cuando se muestra Favoritos
  if (favoritosContainer.classList.contains("activado")) {
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
    body.style.overflowY = "hidden";
  } else {
    body.style.overflowY = "";
  }

  sincronizarContenedorVacio();
});

/* CARRITO */
carritoLogo.addEventListener("click", () => {
  carritoContainer.classList.toggle("activado");
  favoritosContainer.classList.remove("activado");
  //
  buscarContainer.classList.remove("activado");

  detallesCompra();
  sincronizarBotonCarrito();
  sincronizarContenedorVacio();

  // Ocultar mini modal cuando se muestra el Carrito
  if (carritoContainer.classList.contains("activado")) {
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
    body.style.overflowY = "hidden";
  } else {
    body.style.overflowY = "";
  }
});

/* MINI-MODAL CARRITO  */
carritoLogo.addEventListener("mouseenter", () => {
  if (!carritoContainer.classList.contains("activado")) {
    const cantidad = Array.isArray(carrito) ? carrito.length : 0;
    if (cantidad > 0) {
      miniModalCarrito.classList.add("activado");
      miniModalCarritoContainer.classList.add("activado");
    }
  }

  /* Ocultar el Mini Modal cuando esta en Favorito y carrito */
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

    /* Ocultar el Mini Modal cuando esta en Favorito y carrito */
    if (
      favoritosContainer.classList.contains("activado") ||
      carritoContainer.classList.contains("activado")
    ) {
      miniModalCarrito.classList.remove("activado");
      miniModalCarritoContainer.classList.remove("activado");
    }
  }
});

/* ELIMINAR TODOS LOS PRODUCTOS */
eliminarTodoLosProductos.addEventListener("click", () => {
  if (!Array.isArray(carrito) || carrito.length === 0) {
    alert("No hay nada que eliminar");
    return;
  }

  // Crear modal de confirmación
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

  // Si confirma "Sí"
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

  // Si cancela "No"
  btnNo.addEventListener("click", () => {
    document.body.removeChild(modalConfirm);
  });

  // Agregar elementos al modal
  modalContent.append(mensaje, btnSi, btnNo);
  modalConfirm.append(modalContent);
  document.body.appendChild(modalConfirm);
});
//Cambio de img del Usuario
document.getElementById("uploadImage").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!state.usuarioActivo) {
    alert("Debes iniciar sesión para subir una imagen.");
    return;
  }

  // Validacion de tamaño (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("La imagen es muy grande. Máximo 5MB.");
    return;
  }

  // Validacion tipo de archivo
  if (!file.type.startsWith("image/")) {
    alert("Por favor selecciona un archivo de imagen válido.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const nuevaImagen = event.target.result;

    // Actualizar usuario activo
    state.usuarioActivo.imagen = nuevaImagen;

    // Actualizar State
    const usuarioKey = Object.keys(state.usuarios).find(
      (key) => state.usuarios[key].username === state.usuarioActivo.username,
    );

    if (usuarioKey) {
      state.usuarios[usuarioKey].imagen = nuevaImagen;
    }

    // Actualizar la imagen en el perfil
    const imagenUsuario = document.getElementById("imagenUsuario");
    if (imagenUsuario) {
      imagenUsuario.src = nuevaImagen;
    }

    // Actualizar  la imagen del btn de login
    const imgLoginHeader = document.querySelector(".userlogInActivo");
    if (imgLoginHeader) {
      imgLoginHeader.src = nuevaImagen;
    }
  };

  reader.readAsDataURL(file);

  // Limpiar input
  e.target.value = "";
});
/*===============================================================*/
/* ==============Simulacion de Comprobar Tarjeta ============== */
/*===============================================================*/
/* 4. Guardar en localStorage
    localStorage.setItem("usuarioActivo", JSON.stringify(state.usuarioActivo));
    localStorage.setItem("usuarios", JSON.stringify(state.usuarios));*/
const verificacionTarjeta = document.querySelector(".form-tarjetas-pago");

let metodoPago = "";

// Selección de botones
const btnFormaPagoVisa = document.querySelector(".btn-forma-pago-visa");
const btnFormaPagoMastercard = document.querySelector(
  ".btn-forma-pago-mastercard",
);
const btnFormaPagoPaypal = document.querySelector(".btn-forma-pago-paypal");

// Icono dentro del input
const imgTarjetaIcon = document.getElementById("img-tarjeta-icon");
const imgPaypalIcon = document.getElementById("img-paypal-icon");
const imgPaypalIconConfirmar = document.getElementById(
  "img-paypal-icon-confirmar",
);

// Función para cambiar la imagen de la tarjeta
export function actualizarIconoTarjeta(metodo) {
  const imgTarjetas = {
    Visa: "Assets/Img-pagos/visa2.png",
    Mastercard: "Assets/Img-pagos/mastercard2.png",
    Paypal: "Assets/Img-pagos/paypal2.png",
  };

  // Ocultar
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

// Formularios
const formTarjetasPago = document.querySelector(".form-tarjetas-pago");
const formPaypalPago = document.querySelector(".form-paypal-pago");

// Eventos
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

// ==================== FUNCIÓN DE PROCESAMIENTO ====================
function procesarPagoConTarjeta() {
  // Obtener datos del formulario
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

  // ===================== VALIDACIONES =====================
  if (!nombre) {
    alert("Ingresa el nombre del titular.");
    verificacionTarjeta.nombre?.focus();
    return false;
  }

  const numeroSoloDigitos = numeroTarjeta.replace(/\D/g, "");
  if (numeroSoloDigitos.length !== 10) {
    alert("El número de tarjeta debe tener exactamente 10 dígitos.");
    numeroInput?.focus();
    return false;
  }

  if (!/^\d{3,4}$/.test(cvc)) {
    alert("CVC inválido. Debe tener 3 o 4 dígitos.");
    verificacionTarjeta.cvc?.focus();
    return false;
  }

  if (!/^\d{2}\/\d{2}$/.test(fecha)) {
    alert("Fecha de expiración inválida. Usa formato MM/AA.");
    fechaInput?.focus();
    return false;
  }

  const [mes, anio] = fecha.split("/").map(Number);
  if (mes < 1 || mes > 12) {
    alert("Mes de expiración inválido (1-12).");
    fechaInput?.focus();
    return false;
  }

  // Validar fecha no vencida
  const ahora = new Date();
  const anioActual = ahora.getFullYear() % 100;
  if (
    anio < anioActual ||
    (anio === anioActual && mes < ahora.getMonth() + 1)
  ) {
    alert("La tarjeta está expirada.");
    fechaInput?.focus();
    return false;
  }
  const metodoPagoFinal = metodoPago;

  // Validar que se haya seleccionado un método de pago
  if (!metodoPagoFinal) {
    alert(
      "Por favor selecciona un método de pago (Mastercard, Visa o Paypal).",
    );
    return false;
  }

  // ===================== PROCESAR PAGO =====================
  console.log("✅ Validaciones pasadas. Procesando pago con:", metodoPagoFinal);

  const cliente = state.usuarioActivo;
  if (!cliente) {
    alert("No hay usuario logueado. Por favor, inicia sesión.");
    return false;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return false;
  }

  console.log("Pago simulado exitoso ✔");
  // Generar factura
  const { numeroPedido, totalFinal } = generarFactura(
    cliente,
    carrito,
    numeroTarjeta,
    metodoPagoFinal,
  );

  // Add al estado de Pedidos de la tabla
  estadosPedidosTabla.push({
    numeroPedido: numeroPedido,
    fecha: new Date().toLocaleDateString("es-ES"),
    estado: "confirmado",
    total: parseFloat(totalFinal.toFixed(2)),
    usuario: cliente.nombre,
    metodoPago: metodoPagoFinal,
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
  console.log("Este es lo que envio a la tabla", estadosPedidosTabla);

  renderEstadoTabla();
  renderDashboard();

  // Mostrar factura
  facturaContainer.classList.add("activado");

  renderPrincipalResize();
  //Exit Factura Visa-MasterCard y Paypal
  const exitFactura = document.querySelector(".exit-factura");
  exitFactura.classList.add("activado");
  exitFactura.addEventListener("click", () => {
    renderCarrito();
    renderMiniModalCarrito();
    sincronizarBotonCarrito();
    sincronizarContenedorVacio();
    facturaContainer.classList.remove("activado");
    btnDescargarFacturaContainer.classList.remove("activado");
    exitFactura.classList.remove("activado");
  });
  //
  const btnDescargarFacturaContainer = document.querySelector(
    ".btn-descargar-factura-container",
  );
  const btnDescargarFactura = document.querySelector(".btn-descargar-factura");
  btnDescargarFacturaContainer.classList.add("activado");
  btnDescargarFactura.addEventListener("click", () => {
    descargarFacturaPDF();
  });
  descargarFacturaPDF();
  // Limpiar carrito
  carrito.length = 0;

  return true;
}

// ==================== SUBMIT DEL FORMULARIO ====================
verificacionTarjeta.addEventListener("submit", (e) => {
  e.preventDefault();

  const exito = procesarPagoConTarjeta();

  if (exito) {
    modalComprarContainer.classList.remove("activado");
  }
});
/*Pago con Paypal */
function procesarPagoConPaypal() {
  // Obtener datos del formulario de PayPal
  const titular =
    formPaypalPago.querySelector("#titular-paypal-pago")?.value.trim() || "";
  const email =
    formPaypalPago.querySelector("#email-paypal")?.value.trim() || "";
  const confirmEmail =
    formPaypalPago.querySelector("#confirm-email-paypall")?.value.trim() || "";

  // Validaciones
  if (!titular) {
    alert("Ingresa el nombre del titular de PayPal.");
    formPaypalPago.querySelector("#titular-paypal-pago")?.focus();
    return false;
  }

  if (!email) {
    alert("Ingresa el correo de PayPal.");
    formPaypalPago.querySelector("#email-paypal")?.focus();
    return false;
  }

  if (email !== confirmEmail) {
    alert("Los correos de PayPal no coinciden.");
    formPaypalPago.querySelector("#confirm-email-paypall")?.focus();
    return false;
  }

  // Snapshot del método de pago
  const metodoPagoFinal = "Paypal";

  // Validar usuario y carrito
  const cliente = state.usuarioActivo;
  if (!cliente) {
    alert("No hay usuario logueado. Por favor, inicia sesión.");
    return false;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return false;
  }
  // Generar factura
  const { numeroPedido, totalFinal } = generarFactura(
    cliente,
    carrito,
    email,
    metodoPagoFinal,
  );

  // Guardar en tabla
  estadosPedidosTabla.push({
    numeroPedido,
    fecha: new Date().toLocaleDateString("es-ES"),
    estado: "confirmado",
    total: parseFloat(totalFinal.toFixed(2)),
    usuario: cliente.nombre,
    metodoPago: metodoPagoFinal,
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

  // Mostrar factura
  facturaContainer.classList.add("activado");
  renderPrincipalResize();
  //Exit Factura
  const exitFactura = document.querySelector(".exit-factura");
  exitFactura.classList.add("activado");
  exitFactura.addEventListener("click", () => {
    renderCarrito();
    renderMiniModalCarrito();
    sincronizarBotonCarrito();
    sincronizarContenedorVacio();
    facturaContainer.classList.remove("activado");
    exitFactura.classList.remove("activado");
    btnDescargarFacturaContainer.classList.remove("activado");
  });

  //Exit Factura Paypal
  const btnDescargarFacturaContainer = document.querySelector(
    ".btn-descargar-factura-container",
  );
  const btnDescargarFactura = document.querySelector(".btn-descargar-factura");
  btnDescargarFacturaContainer.classList.add("activado");
  btnDescargarFactura.addEventListener("click", () => {
    descargarFacturaPDF();
  });

  // Limpiar carrito
  carrito.length = 0;

  return true;
}

// Evento submit de PayPal
formPaypalPago.addEventListener("submit", (e) => {
  e.preventDefault();

  const exito = procesarPagoConPaypal();

  if (exito) {
    modalComprarContainer.classList.remove("activado");
  }
});

//Generar factura
function generarFactura(cliente, carrito, numeroInputUsuario, metodoPago) {
  const numeroPedido = generarNumeroPedido();
  console.log("Pedido generado:", numeroPedido);

  const subtotal = calcularSubtotal();
  const descuento = carrito.length > 0 ? 9.36 : 0;
  const iva = carrito.length > 0 ? 0.15 : 0;
  const totalFinal = subtotal - descuento + iva;

  const template = document.getElementById("factura-template");
  const clone = template.content.cloneNode(true);

  // ==================== Rellenar Datos de factura====================
  clone.querySelector("#factura-pedido").textContent = numeroPedido;
  clone.getElementById("factura-fecha").textContent =
    new Date().toLocaleDateString();
  //
  const precioFinalSpan = clone.getElementById("factura-total");
  precioFinalSpan.textContent = `$${totalFinal.toFixed(2)}`;
  precioFinalSpan.classList.add("precioFinalPortada");

  // ====================  Datos del Cliente ====================
  clone.getElementById("cliente-nombre").textContent = cliente.nombre;
  clone.getElementById("cliente-direccion").textContent = cliente.direccion;
  clone.getElementById("cliente-correo").textContent = cliente.correo;
  clone.getElementById("cliente-telefono").textContent = cliente.telefono;

  // Totales
  clone.getElementById("factura-subtotal").textContent =
    `$${subtotal.toFixed(2)}`;
  clone.getElementById("factura-iva").textContent = `$${iva.toFixed(2)}`;
  clone.getElementById("factura-descuento").textContent =
    `$${descuento.toFixed(2)}`;
  clone.getElementById("factura-total-final").textContent =
    `$${totalFinal.toFixed(2)}`;

  //Detalles del Pago (Para que solo muestre 3 letras paypal y 4 ultimos visa y mastercard)
  const tipoFormaPagado = clone.querySelector("#tipo-forma-pago");
  tipoFormaPagado.textContent = metodoPago;

  const numeroCuenta = clone.querySelector("#numero-cuenta");

  let valorMostrado = "";

  if (metodoPago.toLowerCase() === "paypal") {
    const email = numeroInputUsuario.trim();

    if (email.includes("@")) {
      const [localPart, dominio] = email.split("@");

      let primeraParte = localPart.substring(0, 3);

      if (localPart.length <= 3) {
        primeraParte = localPart;
      }

      valorMostrado = `${primeraParte}****@${dominio}`;
    }
  } else {
    const soloNumeros = numeroInputUsuario.replace(/\D/g, "");
    if (soloNumeros.length >= 4) {
      valorMostrado = "******" + soloNumeros.slice(-4);
    }
  }
  numeroCuenta.textContent = valorMostrado;
  //
  const tbody = clone.getElementById("factura-productos");
  tbody.innerHTML = "";

  carrito.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
   <td>${((p.nombre || p.alt || "Producto") + (p.talla ? " - " + p.talla : "")).toUpperCase()}</td>
      <td>${p.cantidad}</td>
      <td>$${p.precio.toFixed(2)}</td></td>
      <td>$${(p.precio * p.cantidad).toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  // ==================== INSERTAR EN DOM ====================
  facturaContainer = clone.querySelector(".factura-container");

  // Remover cualquier factura anterior
  document.querySelectorAll(".factura-container").forEach((el) => el.remove());

  document.body.appendChild(clone);

  return { numeroPedido, totalFinal };
}
//

/*DESCARGAR FACTURA */
async function descargarFacturaPDF() {
  const facturaWrapper = document.querySelector(".factura-wrapper");

  if (!facturaWrapper) {
    throw new Error("Factura wrapper no encontrado en el DOM");
  }

  // Clonamos el contenido
  const facturaPDF = facturaWrapper.cloneNode(true);

  // Aplicamos padding al contenedor principal del clon
  const facturaContainer = facturaPDF.querySelector(".factura-container");

  if (facturaContainer) {
    facturaContainer.style.padding = "0px";
  }

  // También aplicamos padding al wrapper clonado
  facturaPDF.style.padding = "24px";

  // Contenedor temporal limpio para PDF
  const pdfContainer = document.createElement("div");
  pdfContainer.classList.add("pdf-temp-container");
  pdfContainer.appendChild(facturaPDF);
  document.body.appendChild(pdfContainer);

  // Esperar a que el navegador pinte bien
  await new Promise((resolve) => setTimeout(resolve, 300));

  const opt = {
    filename: `Factura_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: {
      type: "jpeg",
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: true,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
    },
  };

  try {
    await html2pdf().set(opt).from(facturaPDF).save();
  } finally {
    pdfContainer.remove();
  }
}

/* ==============================
  6. EVENTOS DE CATEGORÍAS
============================== */

/* TOGGLE CATEGORÍAS MUJER/HOMBRE */
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

/* RENDER CATEGORÍAS */
function renderCategoria(categoria) {
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

      // Img
      const img = productoMenu.querySelector("img");
      img.src = item.img;
      img.alt = item.nombre;

      productoMenu.addEventListener("click", toggleGridLateral);
      container.appendChild(clone);
    }
  });
}
renderCategoria("mujer");
renderCategoria("hombre");

/* TOGGLE GRID LATERAL */
function toggleGridLateral(event) {
  const elementoClickeado = event.currentTarget;
  const titulo = elementoClickeado.querySelector("h3").textContent.trim();
  const contenedorPadre = elementoClickeado.closest("[data-template]");
  const genero = contenedorPadre ? contenedorPadre.dataset.template : null;

  // Elegimos el mapa según el género
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

  // Desactivamos todos los contenedores
  containers.forEach((c) => c.classList.remove("activado"));

  // Activamos solo el contenedor correspondiente y eliminamos capa lateral

  const capaLateral = document.querySelector(".capaLateral");
  const contenedorActivar = document.querySelector(selectorContenedor);
  if (contenedorActivar) {
    contenedorActivar.classList.add("activado");

    favoritosContainer.classList.remove("activado");
    carritoContainer.classList.remove("activado");
    //
    buscarContainer.classList.remove("activado");
  }
  body.style.overflowY = "hidden";
  contenedorActivar.style.zIndex = "9";

  menuCategorias.classList.remove("activado");

  // Eliminamos capa lateral si existe
  if (capaLateral) capaLateral.remove();
}

/* ==============================
  7. EVENTOS DE PERFIL
============================== */

/* EDITAR PERFIL */

const formPerfil = document.querySelector(".perfil-info");

formPerfil.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = state.usuarioActivo;

  if (!usuario) {
    alert("No hay usuario activo para actualizar.");
    return;
  }

  usuario.nombre = document.getElementById("nombre-usuario-perfil").value;
  usuario.genero = document.getElementById("genero-usuario-perfil").value;
  usuario.telefono = document.getElementById("telefono-usuario-perfil").value;
  usuario.correo = document.getElementById("correo-usuario-perfil").value;
  usuario.direccion = document.getElementById("direccion-usuario-perfil").value;

  document.querySelector(".nombre-perfil-usuario").textContent = usuario.nombre;

  console.log("Usuario actualizado:", usuario);
  alert("Perfil actualizado correctamente!");
});
/*==================== */
//Cambio de Contraseña
/*==================== */
const formCambiarContraseña = document.querySelector(
  ".form-cambiar-contraseña-usuario",
);

formCambiarContraseña.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = state.usuarioActivo;

  // Verificar si hay usuario activo
  if (!usuario) {
    alert("No hay usuario activo para cambiar la contraseña.");
    return;
  }

  // Obtener valores del formulario
  const contraseñaActual = document.getElementById(
    "contraseña-guardada-usuario",
  ).value;
  const nuevaContraseña = document.getElementById(
    "nueva-contraseña-usuario",
  ).value;
  const confirmarContraseña = document.getElementById(
    "confirm-contraseña-usuario",
  ).value;

  // Validar que todos los campos estén completos
  if (!contraseñaActual || !nuevaContraseña || !confirmarContraseña) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validar que la contraseña actual sea correcta
  if (contraseñaActual !== usuario.contraseña) {
    alert("La contraseña actual es incorrecta.");
    return;
  }

  // Validar que las nuevas contraseñas coincidan
  if (nuevaContraseña !== confirmarContraseña) {
    alert("Las nuevas contraseñas no coinciden.");
    return;
  }

  // Validar que la nueva contraseña sea diferente a la actual
  if (nuevaContraseña === usuario.contraseña) {
    alert("La nueva contraseña debe ser diferente a la actual.");
    return;
  }

  // Validar longitud mínima de la contraseña
  if (nuevaContraseña.length < 9) {
    alert("La nueva contraseña debe tener al menos 9 caracteres.");
    return;
  }

  // Actualizar la contraseña del usuario
  usuario.contraseña = nuevaContraseña;

  // Limpiar el formulario
  formCambiarContraseña.reset();

  // Mostrar mensaje de éxito
  alert("¡Contraseña actualizada correctamente!");
});

/*   Btn PERFIL Usuario muestra el contenedor correspondiente de cada btn */
/*
btnsPerfil.forEach((boton) => {
  boton.addEventListener("click", () => {
    const target = boton.getAttribute("data-target");
    const contenidoActivo = document.getElementById(target);

    if (!contenidoActivo) return;

    // Cambiar contenido
    contenedoresPerfil.forEach((contenido) => {
      contenido.classList.remove("activado");
    });

    contenidoActivo.classList.add("activado");

    if (contenidoActivo.id === "metodosPago") {
      setMetodoPago("tarjeta");
    }

    imgVolver.classList.toggle("activado", width <= 767);
    //Visual de los Btn
    if (boton.classList.contains("suave")) {
      boton.classList.remove("suave");
    }
  });

  boton.addEventListener("mouseenter", () => {
    btnsPerfil.forEach((btn) => {
      if (!btn.classList.contains("activado")) {
        btn.classList.remove("activado");
      } else {
        btn.classList.add("suave");
      }
    });
  });
});*/
btnsPerfil.forEach((boton) => {
  boton.addEventListener("click", () => {
    const target = boton.getAttribute("data-target");
    const contenidoActivo = document.getElementById(target);

    if (!contenidoActivo) return;

    // Cambiar contenido
    contenedoresPerfil.forEach((contenido) => {
      contenido.classList.remove("activado");
    });
    contenidoActivo.classList.add("activado");
    //Solo
    if (width <= 767) {
      const algunoActivado = [...contenedoresPerfil].some((contenido) =>
        contenido.classList.contains("activado"),
      );
      imgVolver.classList.toggle("activado", algunoActivado);
    }

    //
    if (contenidoActivo.id === "metodosPago") {
      setMetodoPago("tarjeta");
    }

    // Remover todos los btn
    btnsPerfil.forEach((btn) => {
      btn.classList.remove("activado", "suave");
    });

    boton.classList.add("activado");
  });

  // Hover
  boton.addEventListener("mouseenter", () => {
    btnsPerfil.forEach((btn) => {
      if (!btn.classList.contains("activado")) {
        btn.classList.remove("activado");
      } else {
        btn.classList.add("suave");
      }
    });
  });
  boton.addEventListener("mouseleave", () => {
    btnsPerfil.forEach((btn) => {
      if (btn.classList.contains("suave")) {
        btn.classList.add("activado");
      } else {
        btn.classList.remove("suave");
      }
    });
  });

  btnsPerfil.forEach((btn) => {
    btn.classList.remove("suave");
    btn.classList.add("activado");
  });
});
//
// Evento del botón volver
imgVolver.addEventListener("click", () => {
  // Ocultar todos los contenedores del perfil
  contenedoresPerfil.forEach((contenido) =>
    contenido.classList.remove("activado"),
  );
  //Animacion del Nombre del Perfil del Usuario
  renderPerfilUsuario();
  const nombrePerfilUsario = document.querySelector(".nombre-perfil-usuario");
  aplicarAnimacionLetras(nombrePerfilUsario);
  // Ocultar otros contenedores si existen
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

  // Limpiar botones activados
  btnsPerfil.forEach((btn) => btn.classList.remove("activado", "suave"));

  // Ocultar el botón volver
  imgVolver.classList.remove("activado");
});

//Renderizar Btn  Visa / Mastercard y Paypal
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
// Visa / Mastercard
btnVisaMastercard.addEventListener("click", () => {
  setMetodoPago("tarjeta");
});

// PayPal
btnPaypal.addEventListener("click", () => {
  setMetodoPago("paypal");
});
/*====HISTORIAL DE PEDIDOS===== */
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

/* TABLA PEDIDOS */
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

/*Btn Cerrar Seccion  */
const btnCerrarSeccion = document.querySelector(".btn-cerrar-seccion");

btnCerrarSeccion.addEventListener("click", () => {
  // Limpiar estado
  state.usuarioActivo = null;

  // Restaurar icono de login

  iconoLogin.style.display = "block";
  const userlogInActivoAll = document.querySelectorAll(".userlogInActivo");
  userlogInActivoAll.forEach((i) => {
    i.style.display = "none";
  });

  // Ocultar icono del usuario logueado
  /*const userLogActivo = logInLogo.querySelector(".userlogInActivo");
  if (userLogActivo) userLogActivo.style.display = "none";*/

  //
  // Ocultamos el perfil logueado y restauramos el login  ---
  perfilContainer.classList.remove("activado");
  loginContainer.classList.remove("activado");
  opcionesLoginContainer.classList.remove("desactivado");
  formLogIn.classList.remove("desactivado");
  logoMarca.classList.remove("desactivado");

  //Remover Todos las Clases de los Contenedores delPerfil
  contenedoresPerfil.forEach((c) => {
    c.classList.remove("activado");
  });
  btnsPerfil.forEach((c) => {
    c.classList.remove("activado");
  });

  body.style.overflowY = "";

  console.log("Sesión cerrada:", state);
});
/* ==============================
  8. EVENTOS LATERALES
============================== */

/* LOGIN - LATERAL */
logInLateral.addEventListener("click", () => {
  perfilContainer.classList.add("activado");
  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  //Animacion del Nombre del Perfil del Usuario
  const nombrePerfilUsario = document.querySelector(".nombre-perfil-usuario");
  aplicarAnimacionLetras(nombrePerfilUsario);
  // Renderizar contenido
  renderHistorialPedidos();
  renderDashboard();
  renderPerfilUsuario();
  mostrarMensajeSinTarjetas();

  // Para escritorio
  if (width >= 768) {
    //Si esta abierto otro contenedor se quita
    if (!editarPerfil.classList.contains("activado")) {
      btnActivoFijo.classList.remove("activado");
    }
    editarPerfil.classList.add("activado");
    btnActivoFijo.classList.add("activado");
  } else {
    imgVolver.classList.remove("activado");
    btnActivoFijo.classList.remove("activado");
  }

  // Le quitamos el Z-Index a Favoritos y Carrito
  favoritosContainer.style.zIndex = "-9";
  carritoContainer.style.zIndex = "-9";
  containers.forEach((c) => (c.style.zIndex = "-9"));

  renderizarTarjetas();

  // Manejo según si hay usuario logueado o no

  const usuarioLogueado = state.usuarioActivo;
  if (usuarioLogueado) {
    loginContainer.classList.add("activado");
    perfilContainer.classList.add("activado");
    logoMarca.classList.add("desactivado");

    // Le Devolvemos el Z-Indez
    favoritosContainer.style.zIndex = "-9";
    carritoContainer.style.zIndex = "-9";

    // Le quitamos el z-Index de las Categorias
    containers.forEach((c) => (c.style.zIndex = "-9"));
    body.style.overflowY = "hidden";
  } else {
    loginContainer.classList.add("activado");

    // Si los Container no Tienen la Class activado
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

  // Eliminar Capa lateral específica para logInLateral

  const capaLateral = document.querySelector(".capaLateral");
  if (capaLateral) {
    capaLateral.remove();
  }
  // Crear exitLogInLateral
  const exitLogInLateralExiste = document.querySelector(".exitLogInLateral");
  if (exitLogInLateralExiste) {
    exitLogInLateralExiste.remove();
  }
  /* ====================== EXIT LOGIN ====================== */
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
// Función centralizada para cerrar todo el perfil/login
function cerrarPerfilLogin() {
  // Limpiar TODO siempre
  loginContainer.classList.remove("activado");
  perfilContainer.classList.remove("activado");
  editarPerfil.classList.remove("activado");
  btnActivoFijo.classList.remove("activado");

  // Limpiar botones y contenidos internos
  btnsPerfil.forEach((btn) => btn.classList.remove("activado", "suave"));
  contenedoresPerfil.forEach((contenido) => {
    contenido.classList.remove("activado");
  });

  encabezadoPedidoContainer.classList.remove("activado");
  tablaEstadosPedidosContainer.classList.remove("activado");
  imgVolver.classList.remove("activado");

  // Restaurar visual y z-index
  logoMarca.classList.remove("desactivado");
  if (
    !favoritosContainer.classList.contains("activado") &&
    !carritoContainer.classList.contains("activado")
  ) {
    body.style.overflowY = "";
  }

  favoritosContainer.style.zIndex = "";
  carritoContainer.style.zIndex = "";
  containers.forEach((c) => (c.style.zIndex = ""));

  console.log("✅ Perfil cerrado completamente");
}

/*
  // Limpiar todas las clases activadas del perfil
  loginContainer.classList.remove("activado");
  perfilContainer.classList.remove("activado");
  editarPerfil.classList.remove("activado");

  // Limpiar botones del perfil
  btnsPerfil.forEach((btn) => btn.classList.remove("activado", "suave"));

  // Limpiar contenedores internos del perfil
  contenedoresPerfil.forEach((contenido) => {
    contenido.classList.remove("activado");
  });

  // Limpiar otros contenedores relacionados
  encabezadoPedidoContainer.classList.remove("activado");
  tablaEstadosPedidosContainer.classList.remove("activado");
  btnActivoFijo.classList.remove("activado");

  // Restaurar z-index
  favoritosContainer.style.zIndex = "";
  carritoContainer.style.zIndex = "";
  containers.forEach((c) => (c.style.zIndex = ""));

  // Restaurar overflow
  body.style.overflowY = "";

  // Remover logo desactivado si aplica
  logoMarca.classList.remove("desactivado");

  console.log("Perfil/Login cerrado completamente");*/
/* FAVORITOS LATERAL */
favoritoLateral.addEventListener("click", () => {
  favoritosContainer.classList.add("activado");
  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  //
  buscarContainer.classList.remove("activado");
  body.style.overflow = "hidden";
  // Eliminar Capa lateral
  const capaLateral = document.querySelector(".capaLateral");
  if (capaLateral) {
    capaLateral.remove();
    menuCategorias.classList.remove("activado");
  }

  sincronizarContenedorVacio();
});

/* CARRITO LATERAL */
carritoLateral.addEventListener("click", () => {
  carritoContainer.classList.add("activado");
  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  //
  buscarContainer.classList.remove("activado");
  body.style.overflow = "hidden";
  //
  detallesCompra();
  sincronizarBotonCarrito();
  sincronizarContenedorVacio();

  // Ocultar cuando se Muestra Carrito
  if (miniModalCarrito.classList.contains("activado")) {
    miniModalCarrito.classList.remove("activado");
  }

  menuCategorias.classList.remove("activado");

  // Eliminar Capa lateral
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
