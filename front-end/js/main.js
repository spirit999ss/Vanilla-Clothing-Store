// main.js

import { assets } from "./assets.js";
// DOM selectors
import {
  width,
  body,
  menuCategoriasContainer,
  menuCategorias,
  miniModalCarritoContainer,
} from "./selectors.js";
// Rendering functions
import {
  renderCarrito,
  renderEstadoTabla,
  renderFavoritos,
  renderHistorialPedidos,
  populateGrid,
  sincronizarContenedorVacio,
  renderDashboard,
  renderMiniModalCarrito,
} from "./render.js";
// Application state
import {
  state,
  carrito,
  favoritos,
  estadosPedidosTabla,
  historialPedidos,
  actualizarContadorPedidos,
} from "./state.js";

// Product data
import { loadProducts, dataMujeres, dataHombres } from "./products.js";

// Local persistence
import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";

// Event handlers
import { initSliderClicks, renderCategoria } from "./events.js";
/* Initialize the slider */
function initSlider() {
  const sliderContainer = document.querySelector(".swiper");
  if (!sliderContainer) return;
  new Swiper(".swiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}

/* Load assets */
export function loadAssets() {
  document.querySelectorAll("[data-asset]").forEach((el) => {
    const key = el.dataset.asset;
    const asset = assets[key];

    if (asset && el.tagName === "IMG") {
      el.src = asset.src;
      el.alt = asset.alt || key;
    }
  });
}
/* Load category cover images */
function loadCategoryImages() {
  setTimeout(() => {
    // Select a random source for the category cover
    const getMiddleSrc = (arr) => {
      if (!arr?.length) return "";
      return arr[Math.floor(Math.random() * arr.length)]?.src || "";
    };

    const maps = {
      blusas: getMiddleSrc(dataMujeres.blusas),
      "pantalones-mujer": getMiddleSrc(dataMujeres.pantalones),
      faldas: getMiddleSrc(dataMujeres.faldas),
      vestidos: getMiddleSrc(dataMujeres.vestidos),
      "conjuntos-mujer": getMiddleSrc(dataMujeres.conjuntos),
      "accesorios-mujer": getMiddleSrc(dataMujeres.accesorios),

      camisas: getMiddleSrc(dataHombres.camisas),
      "pantalones-hombre": getMiddleSrc(dataHombres.pantalones),
      gorras: getMiddleSrc(dataHombres.gorras),
      zapatos: getMiddleSrc(dataHombres.zapatos),
      "conjuntos-hombre": getMiddleSrc(dataHombres.conjuntos),
      "accesorios-hombre": getMiddleSrc(dataHombres.accesorios),
    };

    Object.entries(maps).forEach(([key, src]) => {
      const img = document.querySelector(`[data-category="${key}"]`);
      if (img && src) {
        img.src = src;
      }
    });
  }, 1000);
}
/* Dynamic slider */
function initDynamicSlider() {
  const wrapper = document.querySelector(".swiper-wrapper");

  if (!wrapper) return;

  wrapper.innerHTML = "";

  const destacados = [
    ...dataMujeres.vestidos.slice(0, 3),
    ...dataHombres.camisas.slice(0, 3),
    ...dataMujeres.faldas.slice(0, 3),
    ...dataHombres.gorras.slice(0, 3),
    ...dataMujeres.blusas.slice(0, 3),
    ...dataHombres.accesorios.slice(0, 3),
  ];

  destacados.forEach((p) => {
    if (!p?.src) return;

    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const img = document.createElement("img");
    img.src = p.src;
    img.alt = p.alt || "Producto";
    img.loading = "lazy";
    img.classList.add("slider-producto");

    // Required for irAlProductoSlider to identify the product
    img.dataset.idProducto = p.id;

    slide.appendChild(img);
    wrapper.appendChild(slide);
  });

  new Swiper(".swiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}

/* Render product grids */
function renderAllProducts() {
  populateGrid(".vestidos-grid", dataMujeres.vestidos);
  populateGrid(".blusas-grid", dataMujeres.blusas);
  populateGrid(".pantalones-mujer-grid", dataMujeres.pantalones);
  populateGrid(".faldas-grid", dataMujeres.faldas);
  populateGrid(".conjuntos-mujer-grid", dataMujeres.conjuntos);
  populateGrid(".accesorios-mujer-grid", dataMujeres.accesorios);

  populateGrid(".camisas-grid", dataHombres.camisas);
  populateGrid(".pantalones-hombre-grid", dataHombres.pantalones);
  populateGrid(".gorras-grid", dataHombres.gorras);
  populateGrid(".zapatos-grid", dataHombres.zapatos);
  populateGrid(".conjuntos-hombre-grid", dataHombres.conjuntos);
  populateGrid(".accesorios-hombre-grid", dataHombres.accesorios);
}

/* ==================== AUTO SAVE ==================== */
function setupAutoSave() {
  const save = () => saveToLocalStorage();

  const originalPush = Array.prototype.push;
  const originalSplice = Array.prototype.splice;

  // Persist cart and favorites mutations
  carrito.push = function (...items) {
    const result = originalPush.apply(this, items);
    save();
    return result;
  };
  carrito.splice = function (...args) {
    const result = originalSplice.apply(this, args);
    save();
    return result;
  };

  favoritos.push = function (...items) {
    const result = originalPush.apply(this, items);
    save();
    return result;
  };
  favoritos.splice = function (...args) {
    const result = originalSplice.apply(this, args);
    save();
    return result;
  };

  estadosPedidosTabla.push = function (...items) {
    const result = originalPush.apply(this, items);
    save();
    return result;
  };
  estadosPedidosTabla.splice = function (...args) {
    const result = originalSplice.apply(this, args);
    save();
    return result;
  };

  historialPedidos.push = function (...items) {
    const result = originalPush.apply(this, items);
    save();
    return result;
  };
  historialPedidos.splice = function (...args) {
    const result = originalSplice.apply(this, args);
    save();
    return result;
  };
}
/* ==================== INITIALIZATION ==================== */
async function initApp() {
  await loadProducts();

  if (carrito.length > 0) {
    renderMiniModalCarrito();
  } else {
    miniModalCarritoContainer.style.display = "none";
  }
  // Load persisted state

  loadFromLocalStorage();
  // Load shared assets
  loadAssets();
  // Render the dashboard
  renderDashboard();
  actualizarContadorPedidos();
  // Render side categories after product loading
  renderCategoria("mujer");
  renderCategoria("hombre");

  // Load category cover images
  loadCategoryImages();

  // Create the dynamic slider
  initDynamicSlider();

  // Activate slider controls
  initSliderClicks();

  // Render all products in their grids
  renderAllProducts();

  renderFavoritos();
  renderCarrito();
  renderHistorialPedidos();
  renderEstadoTabla();

  setupAutoSave();
}

document.addEventListener("DOMContentLoaded", initApp);
