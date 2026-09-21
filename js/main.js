// js/main.js

// Import Events
import { initSliderClicks } from "./events.js";

// Import Render
import {
  renderFavoritos,
  renderCarrito,
  renderHistorialPedidos,
  renderEstadoTabla,
} from "./render.js";

import { state } from "./state.js";

/* Inicializar el Slider*/
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

/* Inicializar renders */
function initRenders() {
  renderFavoritos();
  renderCarrito();
  renderHistorialPedidos();
  renderEstadoTabla();
  console.log("Estado actual: ", state);
}

/* Inicializa la Aplicacion */
function initApp() {
  console.log(
    "%c🚀 Iniciando aplicación...",
    "color: #c026d3; font-weight: bold;",
  );

  initSlider();
  initRenders();
  initSliderClicks();

  console.log(
    "%c✅ Aplicación cargada correctamente",
    "color: #22c55e; font-weight: bold;",
  );
}

document.addEventListener("DOMContentLoaded", initApp);
