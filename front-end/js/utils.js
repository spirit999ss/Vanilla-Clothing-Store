/* ============================================
   UTILS - FUNCIONES UTILITARIAS
   ============================================ */

/**
 * Module: utils.js
 * Description: Reusable general-purpose utility functions.
 * Exports: exitGenerico, crearSelectorTallas, hiddenCategorias,
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
  menuCategoriasContainer,
  categoriasMenuLateralWrapper,
  favoritosContainer,
  carritoContainer,
  containers,
  perfilContainer,
  modalComprarContainer,
  width,
  buscarBtnContainer,
} from "./selectors.js";

import { carrito } from "./state.js";
import { assets } from "./assets.js";
import { renderMiniModalCarrito } from "./render.js";
/* ============================================
   SECTION 1: GENERAL UTILITY FUNCTIONS
   ============================================ */

/**
 * Creates a generic image-based exit button.
 * @param {Object} options - Configuration options
 * @param {Function} options.onClick - Click callback
 * @param {string} options.containerClass - Container CSS class
 * @param {string} options.imgClass - Image CSS class
 * @returns {HTMLElement} Exit button container
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
 * Creates the product removal button.
 * @returns {HTMLElement} Delete button container
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
 * Hides categories when none is active.
 * Restores the document body overflow.
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
 * Creates a size selector (S, M, XL).
 * @returns {HTMLElement} Select element with size options
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
   SECTION 2: CART COUNTER
   ============================================ */

/**
 * Updates the visible cart counter.
 * Shows or hides the mini-modal according to cart contents.
 */
function actualizarContadorCarrito() {
  if (!contadorCirculo || !spanContador) {
    return;
  }
  // Keep the counter hidden while these containers are open.
  if (width >= 768) {
    if (
      perfilContainer.classList.contains("activado") ||
      favoritosContainer.classList.contains("activado") ||
      buscarBtnContainer.classList.contains("activado")
    ) {
      return;
    }
  }

  const cantidad = Array.isArray(carrito) ? carrito.length : 0;
  spanContador.textContent = cantidad;

  if (cantidad > 0) {
    contadorCirculo.classList.add("activado");
    renderMiniModalCarrito();
  } else {
    contadorCirculo.classList.remove("activado");
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
  }

  if (carritoContainer.classList.contains("activado")) {
    miniModalCarritoContainer.classList.remove("activado");
  }
}
/* ============================================
   SECTION 3: INTERACTION FUNCTIONS
   ============================================ */

/**
 * Verifies and marks the selected payment method.
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
verificarTarjeta();

/** Last scroll position used to hide the header */
let ultimaPosicion = 0;

/**
 * Hides or shows the header while scrolling.
 * Only when no modals are open.
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
 * Shows a warning modal when a duplicate product is added.
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
 * Shows a confirmation modal for quantity updates.
 * @param {number} currentQuantity - Current cart quantity
 * @param {number} newQuantity - Newly selected quantity
 * @returns {Promise<boolean>} True when confirmed, false when cancelled
 */
function mostrarActualizarCarrito(currentQuantity, newQuantity) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.classList.add("overlayActualizar");
    overlay.style.zIndex = "999";

    const actualizarCarrito = document.createElement("div");
    actualizarCarrito.classList.add("actualizarCarrito");

    const contenido = document.createElement("p");
    contenido.textContent = `¿Quieres actualizar la cantidad de este producto en el carrito de ${currentQuantity} a ${newQuantity}?`;

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
   SECTION 4: SIDE BACKDROP
   ============================================ */

/** Global reference to the current side backdrop */
let capaLateralActual = null;

/**
 * Opens the side backdrop.
 */
export function abrirCapaLateral() {
  if (!capaLateralActual) {
    capaLateralActual = crearCapaLateralConExit(body, cerrarCapaLateral);
  }
  capaLateralActual.style.display = "block";
}

/**
 * Closes the side backdrop and clears its state.
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
 * Creates the side-backdrop element with an exit button.
 * @param {HTMLElement} body - Document body element
 * @param {Function} onClose - Close callback
 * @returns {HTMLElement} Created side-backdrop element
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
