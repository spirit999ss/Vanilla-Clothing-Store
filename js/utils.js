/* ==============================
    UTILS
============================== */

//Import Selectors
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
} from "/js/selectors.js";

//Import State
import { carrito } from "/js/state.js";

/* ==============================
  FUNCIONES DE UTILIDAD GENERAL
============================== */

//Exit Generico
function exitGenerico({ onClick, containerClass = "", imgClass = "" } = {}) {
  const exitContainer = document.createElement("div");
  if (containerClass) exitContainer.classList.add(containerClass);

  const img = document.createElement("img");
  img.src = "Assets/exit.png";
  img.alt = "exit";
  if (imgClass) img.classList.add(imgClass);

  img.addEventListener("click", () => {
    if (typeof onClick === "function") onClick();
  });

  exitContainer.appendChild(img);
  return exitContainer;
}

//Delete Producto
function deleteProducto() {
  const deleteProductos = document.createElement("span");
  deleteProductos.classList.add("deleteProductoContainer");

  const img = document.createElement("img");
  img.src = "Assets/delete.png";
  img.alt = "Delete Producto";

  deleteProductos.appendChild(img);
  return deleteProductos;
}

//Hidden Categorias
function hiddenCategorias() {
  //
  const categoriasContainers = document.querySelectorAll(
    ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, .camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
  );

  const ningunoActivado = Array.from(categoriasContainers).every(
    (categoria) => !categoria.classList.contains("activado"),
  );

  if (ningunoActivado) {
    document.body.style.overflowY = "";
  }
}

//Tallas
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

/* ==============================
  CONTADOR DEL CARRITO
============================== */

/*Contador*/
function actualizarContadorCarrito() {
  //
  if (!contadorCirculo || !spanContador) {
    return;
  }
  const cantidad = Array.isArray(carrito) ? carrito.length : 0;

  spanContador.textContent = cantidad;

  if (cantidad > 0) {
    contadorCirculo.classList.add("activado");
    miniModalCarrito.classList.add("activado");
    miniModalCarritoContainer.classList.add("activado");

    //
    slider.style.zIndex = "-9";
  } else {
    contadorCirculo.classList.remove("activado");
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
  }
}

/* ==============================
  FUNCIONES DE INTERACCIÓN
============================== */

//Verificacion de Formulario de Tarjeta
function verificarTarjeta() {
  const botonesPago = document.querySelectorAll(".btnPago");
  botonesPago.forEach((btn) => {
    btn.addEventListener("click", () => {
      botonesPago.forEach((b) => b.classList.remove("activado"));
      //
      btn.classList.add("activado");
    });
  });
}
verificarTarjeta();

//Header Hidden
let ultimaPosicion = 0;
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
  //
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
//Aviso que no se puede add 2 veces el Mismo Producto
const categoriasWrapper = document.querySelector(".categorias-wrapper");
function mostrarModalAviso() {
  // Crear modal
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

// Actualizar Carrito al cambiar cantidad
function mostrarActualizarCarrito(cantidadActual, nuevaCantidad) {
  return new Promise((resolve) => {
    // Overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlayActualizar");
    overlay.style.zIndex = "999";

    // Modal
    const actualizarCarrito = document.createElement("div");
    actualizarCarrito.classList.add("actualizarCarrito");

    const contenido = document.createElement("p");
    contenido.textContent = `¿Quieres actualizar la Cantidad de este Producto en  el carrito de ${cantidadActual} a ${nuevaCantidad}?`;

    // Botón actualizar
    const btnActualizar = document.createElement("button");
    btnActualizar.textContent = "Actualizar";
    btnActualizar.classList.add("btnActualizar");

    // Botón cancelar
    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btnCancelar");

    // Eventos
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
//Capa Lateral del Menu Hamburguesa
// ==================== CAPA LATERAL ====================
// Variable global para controlar la capa
let capaLateralActual = null;

export function abrirCapaLateral() {
  if (!capaLateralActual) {
    capaLateralActual = crearCapaLateralConExit(body, cerrarCapaLateral);
  }
  capaLateralActual.style.display = "block";
}
export function cerrarCapaLateral() {
  console.log("CLOSE EJECUTADO");

  menuCategorias.classList.remove("activado");
  categoriasMenuLateralWrapper.classList.remove("activado");
  hiddenCategorias();

  const menuBtnContainer = document.querySelector(".menu-btn-container");
  if (menuBtnContainer) menuBtnContainer.classList.remove("activado");

  if (capaLateralActual) {
    capaLateralActual.style.display = "none";
    // Si quieres eliminarla completamente al cerrar (recomendado):
    // capaLateralActual.remove();
    // capaLateralActual = null;
  }

  body.style.overflowY = "";
}

// ==================== CREAR CAPA LATERAL ====================
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
/* ==============================
  EXPORTACIONES
============================== */

export {
  exitGenerico,
  crearSelectorTallas,
  hiddenCategorias,
  deleteProducto,
  actualizarContadorCarrito,
  mostrarActualizarCarrito,
  mostrarModalAviso,
};
