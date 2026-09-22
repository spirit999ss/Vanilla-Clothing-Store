// storage.js
import {
  carrito,
  favoritos,
  historialPedidos,
  estadosPedidosTabla,
  state,
} from "./state.js";

const STORAGE_KEYS = {
  carrito: "tienda_carrito",
  favoritos: "tienda_favoritos",
  historialPedidos: "tienda_historial",
  estadosPedidos: "tienda_estados_pedidos",
  usuarioActivo: "tienda_usuario_activo",
};
export function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.carrito, JSON.stringify(carrito));
    localStorage.setItem(STORAGE_KEYS.favoritos, JSON.stringify(favoritos));
    localStorage.setItem(
      STORAGE_KEYS.historialPedidos,
      JSON.stringify(historialPedidos),
    );
    localStorage.setItem(
      STORAGE_KEYS.estadosPedidos,
      JSON.stringify(estadosPedidosTabla),
    );

    if (state.usuarioActivo) {
      localStorage.setItem(
        STORAGE_KEYS.usuarioActivo,
        JSON.stringify(state.usuarioActivo),
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.usuarioActivo);
    }
  } catch (e) {
    console.error("❌ Error guardando en localStorage:", e);
  }
}
//
export function loadFromLocalStorage() {
  try {
    const carritoGuardado = localStorage.getItem(STORAGE_KEYS.carrito);
    const favoritosGuardados = localStorage.getItem(STORAGE_KEYS.favoritos);
    const historialGuardado = localStorage.getItem(
      STORAGE_KEYS.historialPedidos,
    );
    const estadosGuardados = localStorage.getItem(STORAGE_KEYS.estadosPedidos);
    const usuarioGuardado = localStorage.getItem(STORAGE_KEYS.usuarioActivo);

    if (carritoGuardado) {
      carrito.length = 0;
      carrito.push(...JSON.parse(carritoGuardado));
    }

    if (favoritosGuardados) {
      favoritos.length = 0;
      favoritos.push(...JSON.parse(favoritosGuardados));
    }

    if (historialGuardado) {
      historialPedidos.length = 0;
      historialPedidos.push(...JSON.parse(historialGuardado));
    }

    if (estadosGuardados) {
      estadosPedidosTabla.length = 0;
      estadosPedidosTabla.push(...JSON.parse(estadosGuardados));
    }

    if (usuarioGuardado) {
      state.usuarioActivo = JSON.parse(usuarioGuardado);
    } else {
      state.usuarioActivo = null;
    }
  } catch (e) {
    console.error("❌ Error cargando localStorage:", e);
  }
}

export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
