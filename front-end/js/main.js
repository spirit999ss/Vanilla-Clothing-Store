// main.js

// Import Assets
import { assets } from "./assets.js";

// Import Render
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
//Import State
import {
  state,
  carrito,
  favoritos,
  estadosPedidosTabla,
  historialPedidos,
  actualizarContadorPedidos,
} from "./state.js";

// Import Products
import { loadProducts, dataMujeres, dataHombres } from "./products.js";

// Import Storage
import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";

//Import Events
import { initSliderClicks, renderCategoria } from "./events.js";
/* Inicializar Slider */
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

/* Cargar assets */
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
/* Cargar portadas de categorías */
function loadCategoryImages() {
  setTimeout(() => {
    console.log(" Cargando portadas de los Productos");
    //Img Rando
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
/* Slider dinámico */
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

    // Necesario para que irAlProductoSlider encuentre el producto
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

/* Renderizar grids */
function renderAllProducts() {
  console.log(" Renderizando productos");
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

  // Carrito y Favoritos (ya lo tenías)
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

  //
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

  console.log(" Auto-Guardado  activado con pedidos)");
}
/* ==================== INICIALIZACIÓN ==================== */
async function initApp() {
  await loadProducts();

  //Cargar Local Storage

  loadFromLocalStorage();
  // Cargar assets generales
  loadAssets();
  //Render dashboard
  renderDashboard();
  actualizarContadorPedidos();
  // Renderizar categorías laterales después de cargar productos
  renderCategoria("mujer");
  renderCategoria("hombre");

  // Cargar portadas de categorías
  loadCategoryImages();

  // Crear slider dinámico
  initDynamicSlider();

  // Activar clicks del slider
  initSliderClicks();

  // Renderizar todos los productos en los grids
  renderAllProducts();

  renderFavoritos();
  renderCarrito();
  renderMiniModalCarrito();
  renderHistorialPedidos();
  renderEstadoTabla();

  setupAutoSave();

  console.log(" Tienda cargada completamente con LocalStorage");
}

document.addEventListener("DOMContentLoaded", initApp);
