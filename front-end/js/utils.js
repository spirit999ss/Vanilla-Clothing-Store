/* ============================================
   UTILS - FUNCIONES UTILITARIAS
   ============================================ */

/**
 * Módulo: utils.js
 * Descripción: Funciones de utilidad general reutilizables
 * Exporta: exitGenerico, crearSelectorTallas, hiddenCategorias,
 *          deleteProducto, actualizarContadorCarrito,
 *          mostrarActualizarCarrito, mostrarModalAviso,
 *          abrirCapaLateral, cerrarCapaLateral, crearCapaLateralConExit
 */

/* ============================================
   IMPORTACIONES
   ============================================ */
import {
  header,
  body,
  contadorCirculo,
  spanContador,
  miniModalCarritoContainer,
  miniModalCarrito,
  slider,
  menuCategorias,
  categoriasMenuLateralWrapper,
  favoritosContainer,
  carritoContainer,
  containers,
  perfilContainer,
  modalComprarContainer,
  width,
} from "./selectors.js";

import { carrito } from "./state.js";
//Import Assets
import { assets } from "./assets.js";
/* ============================================
   SECCIÓN 1: FUNCIONES DE UTILIDAD GENERAL
   ============================================ */

/**
 * Crea un botón de salida genérico con imagen
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.onClick - Callback al hacer click
 * @param {string} options.containerClass - Clase CSS del contenedor
 * @param {string} options.imgClass - Clase CSS de la imagen
 * @returns {HTMLElement} Elemento contenedor del botón exit
 */
function exitGenerico({ onClick, containerClass = "", imgClass = "" } = {}) {
  const exitContainer = document.createElement("div");
  if (containerClass) exitContainer.classList.add(containerClass);

  const img = document.createElement("img");
  img.src = assets.exit.src;
  img.alt = assets.exit.alt;

  if (imgClass) img.classList.add(imgClass);

  img.addEventListener("click", () => {
    if (typeof onClick === "function") onClick();
  });

  exitContainer.appendChild(img);
  return exitContainer;
}

/**
 * Crea el botón de eliminar producto
 * @returns {HTMLElement} Contenedor del botón delete
 */
function deleteProducto() {
  const deleteProductos = document.createElement("span");
  deleteProductos.classList.add("deleteProductoContainer");

  const img = document.createElement("img");

  img.src = assets.delete.src;
  img.alt = assets.delete.alt;

  deleteProductos.appendChild(img);
  return deleteProductos;
}

/**
 * Oculta las categorías si ninguna está activa
 * Restaura el overflow del body
 */
function hiddenCategorias() {
  const categoriasContainers = document.querySelectorAll(
    ".vestidos-container, .blusas-container, .pantalones-mujer-container, " +
      ".faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, " +
      ".camisas-container, .pantalones-hombre-container, .gorras-container, " +
      ".zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
  );

  const ningunoActivado = Array.from(categoriasContainers).every(
    (categoria) => !categoria.classList.contains("activado"),
  );

  if (ningunoActivado) {
    document.body.style.overflowY = "";
  }
}

/**
 * Crea un selector de tallas (S, M, XL)
 * @returns {HTMLElement} Elemento select con opciones de talla
 */
function crearSelectorTallas() {
  const tallas = ["S", "M", "XL"];
  const select = document.createElement("select");
  select.name = "tallas";
  select.required = true;

  const optionDefault = document.createElement("option");
  optionDefault.textContent = "Seleccionar Talla";
  optionDefault.value = "";
  optionDefault.disabled = true;
  optionDefault.selected = true;
  select.appendChild(optionDefault);

  tallas.forEach((talla) => {
    const option = document.createElement("option");
    option.value = talla;
    option.textContent = talla;
    select.appendChild(option);
  });

  return select;
}

/* ============================================
   SECCIÓN 2: CONTADOR DEL CARRITO
   ============================================ */

/**
 * Actualiza el contador visual del carrito
 * Muestra/oculta el mini modal según haya productos
 */
function actualizarContadorCarrito() {
  if (!contadorCirculo || !spanContador) {
    return;
  }

  const cantidad = Array.isArray(carrito) ? carrito.length : 0;
  spanContador.textContent = cantidad;

  if (cantidad > 0) {
    contadorCirculo.classList.add("activado");
    miniModalCarrito.classList.add("activado");
    miniModalCarritoContainer.classList.add("activado");
    //slider.style.zIndex = "-9";
  } else {
    contadorCirculo.classList.remove("activado");
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
  }
}

/* ============================================
   SECCIÓN 3: FUNCIONES DE INTERACCIÓN
   ============================================ */

/**
 * Verifica y marca el método de pago seleccionado
 */
function verificarTarjeta() {
  const botonesPago = document.querySelectorAll(".btnPago");
  botonesPago.forEach((btn) => {
    btn.addEventListener("click", () => {
      botonesPago.forEach((b) => b.classList.remove("activado"));
      btn.classList.add("activado");
    });
  });
}
// Inicializar
verificarTarjeta();

/** Última posición de scroll para header hidden */
let ultimaPosicion = 0;

/**
 * Oculta/muestra el header al hacer scroll
 * Solo cuando no hay modales abiertos
 */
function headerHidden() {
  if (
    favoritosContainer.classList.contains("activado") ||
    carritoContainer.classList.contains("activado") ||
    perfilContainer.classList.contains("activado") ||
    modalComprarContainer.classList.contains("activado")
  ) {
    return;
  }

  let posicionActual = window.scrollY;
  const algunContainerActivo = Array.from(containers).some((el) =>
    el.classList.contains("activado"),
  );

  if (!algunContainerActivo && posicionActual >= 9) {
    if (posicionActual > ultimaPosicion) {
      header.classList.add("desactivado");
    } else if (posicionActual < ultimaPosicion) {
      header.classList.remove("desactivado");
    }
  }

  ultimaPosicion = posicionActual;
}

window.addEventListener("scroll", headerHidden);

/**
 * Muestra modal de aviso cuando se intenta agregar producto duplicado
 */
function mostrarModalAviso() {
  const noAgregarDosVecesContainer = document.createElement("div");
  noAgregarDosVecesContainer.classList.add("noAgregarDosVecesContainer");
  noAgregarDosVecesContainer.style.zIndex = "999";

  const contenido = document.createElement("p");
  contenido.textContent = "No podemos agregar el mismo producto dos veces";
  noAgregarDosVecesContainer.append(contenido);

  body.appendChild(noAgregarDosVecesContainer);

  setTimeout(() => {
    noAgregarDosVecesContainer.remove();
  }, 3000);
}

/**
 * Muestra modal de confirmación para actualizar cantidad
 * @param {number} cantidadActual - Cantidad actual en carrito
 * @param {number} nuevaCantidad - Nueva cantidad seleccionada
 * @returns {Promise<boolean>} true si confirma, false si cancela
 */
function mostrarActualizarCarrito(cantidadActual, nuevaCantidad) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.classList.add("overlayActualizar");
    overlay.style.zIndex = "999";

    const actualizarCarrito = document.createElement("div");
    actualizarCarrito.classList.add("actualizarCarrito");

    const contenido = document.createElement("p");
    contenido.textContent = `¿Quieres actualizar la Cantidad de este Producto en el carrito de ${cantidadActual} a ${nuevaCantidad}?`;

    const btnActualizar = document.createElement("button");
    btnActualizar.textContent = "Actualizar";
    btnActualizar.classList.add("btnActualizar");

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btnCancelar");

    btnActualizar.onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };

    btnCancelar.onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };

    actualizarCarrito.appendChild(contenido);
    actualizarCarrito.appendChild(btnActualizar);
    actualizarCarrito.appendChild(btnCancelar);
    overlay.appendChild(actualizarCarrito);

    document.body.appendChild(overlay);
  });
}

/* ============================================
   SECCIÓN 4: CAPA LATERAL (BACKDROP)
   ============================================ */

/** Referencia global a la capa lateral actual */
let capaLateralActual = null;

/**
 * Abre la capa lateral (backdrop oscuro)
 */
export function abrirCapaLateral() {
  if (!capaLateralActual) {
    capaLateralActual = crearCapaLateralConExit(body, cerrarCapaLateral);
  }
  capaLateralActual.style.display = "block";
}

/**
 * Cierra la capa lateral y limpia estados
 */
export function cerrarCapaLateral() {
  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  hiddenCategorias();

  const menuBtnContainer = document.querySelector(".menu-btn-container");
  if (menuBtnContainer) menuBtnContainer.classList.remove("activado");

  if (capaLateralActual) {
    capaLateralActual.style.display = "none";
  }

  body.style.overflowY = "";
}

/**
 * Crea el elemento de capa lateral con botón de salida
 * @param {HTMLElement} body - Elemento body del documento
 * @param {Function} onClose - Callback al cerrar
 * @returns {HTMLElement} Elemento capa lateral creado
 */
export function crearCapaLateralConExit(body, onClose) {
  let capaLateral = document.querySelector(".capaLateral");

  if (!capaLateral) {
    capaLateral = document.createElement("div");
    capaLateral.classList.add("capaLateral");
    capaLateral.style.zIndex = "18";
    body.appendChild(capaLateral);
  }

  capaLateral.innerHTML = "";

  const exit = exitGenerico({
    onClick: () => {
      if (typeof onClose === "function") onClose();
    },
    containerClass: "exitMenuContainer",
    imgClass: "exitMenu",
  });

  capaLateral.appendChild(exit);
  capaLateral.style.display = "block";

  return capaLateral;
}

/* ============================================
   EXPORTACIONES
   ============================================ */
export {
  exitGenerico,
  crearSelectorTallas,
  hiddenCategorias,
  deleteProducto,
  actualizarContadorCarrito,
  mostrarActualizarCarrito,
  mostrarModalAviso,
};
