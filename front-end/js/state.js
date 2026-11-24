/* ============================================
   STATE - APPLICATION STATE
   ============================================ */

/**
 * Module: state.js
 * Description: Manages the application's global state.
 * Exports: historialPedidos, estadosPedidosTabla, contadorPedidos,
 *          generarNumeroPedido, dataGeneralBusqueda, favoritos,
 *          carrito, state, imgTarjetas
 */

import { products } from "./products.js";
import { assets } from "./assets.js";
/* ============================================
   SECTION 2: ORDER STATUS TABLE
   ============================================ */

export let estadosPedidosTabla = [];
export let historialPedidos = [];

export let contadorPedidos = 0;

export function actualizarContadorPedidos() {
  const maximo = Math.max(
    0,
    ...estadosPedidosTabla.map((p) => p.numeroPedido || 0),
    ...historialPedidos.map((p) => p.numeroPedido || 0),
  );
  contadorPedidos = maximo;
}

export function generarNumeroPedido() {
  contadorPedidos += 1;
  return contadorPedidos;
}

/* ============================================
   SECTION 3: GLOBAL SEARCH
   ============================================ */

/**
 * Flat list of all products used for search
 * Combines all women's and men's products
 * @type {Array}
 */
export const dataGeneralBusqueda = [];

/* ============================================
   SECTION 4: FAVORITES AND CART
   ============================================ */

/**
 * Products marked as favorites by the user
 * @type {Array}
 */
export let favoritos = [];

/**
 * Products added to the shopping cart
 * @type {Array}
 */
export let carrito = [];

/* ============================================
   SECTION 5: USERS AND STATE
   ============================================ */

/**
 * Global application state
 * Contains registered users and the active user
 * @type {Object}
 */
export const state = {
  /** Registered users */
  usuarios: {
    u1: {
      nombre: "Messi Ronaldo",
      username: "messironaldo1212",
      genero: "Masculino",
      telefono: "987-654-321",
      correo: "messironaldo333@ejemplo.com",
      direccion: "Av. Siempre Viva",
      contraseña: "golazo123",
      imagen: assets.userActive.src,
      metodosPago: [
        {
          id: "p1",
          tipo: "Visa",
          numero: "******4567",
          titular: "Messi Ronaldo",
          imagen: "visa",
          expiracion: "12/28",
          activa: true,
        },
        {
          id: "p2",
          tipo: "Mastercard",
          numero: "******9321",
          titular: "Messi Ronaldo",
          imagen: "mastercard",
          expiracion: "05/24",
          activa: false,
        },
        {
          id: "p3",
          tipo: "PayPal",
          numero: "mes***@gmail.com",
          titular: "Messi Ronaldo",
          imagen: "paypal",
          expiracion: "09/27",
          activa: false,
        },
      ],
    },
    u2: {
      nombre: "Sakamoto Tanjiro",
      username: "sakagenaro99",
      genero: "Masculino",
      telefono: "987-654-3210",
      correo: "sakagenaro99@ejemplo.com",
      direccion: "Calle Sakura 12",
      contraseña: "shinobi2030",
      imagen: assets.userActive.src,
      metodosPago: [
        {
          id: "p1",
          tipo: "Visa",
          numero: "******1122",
          titular: "Sakamoto Tanjiro",
          imagen: "visa",
          expiracion: "08/27",
          activa: true,
        },
        {
          id: "p2",
          tipo: "Mastercard",
          numero: "******3344",
          titular: "Sakamoto Tanjiro",
          imagen: "mastercard",
          expiracion: "12/33",
          activa: false,
        },
        {
          id: "p3",
          tipo: "PayPal",
          numero: "saka***@gmail.com",
          titular: "Sakamoto Tanjiro",
          imagen: "paypal",
          expiracion: "12/36",
          activa: false,
        },
      ],
    },
    u3: {
      nombre: "Akasa Tanjiro",
      username: "akasatanjiro",
      genero: "Masculino",
      telefono: "555-666-7777",
      correo: "akasatanjiro@ejemplo.com",
      direccion: "Barrio Demon Slayer",
      contraseña: "respira_agua3000",
      imagen: assets.userActive.src,
      metodosPago: [
        {
          id: "p1",
          tipo: "Visa",
          numero: "******7788",
          titular: "Akasa Tanjiro",
          imagen: "visa",
          expiracion: "12/29",
          activa: true,
        },
        {
          id: "p2",
          tipo: "Mastercard",
          numero: "******5566",
          titular: "Akasa Tanjiro",
          imagen: "mastercard",
          expiracion: "07/27",
          activa: true,
        },
        {
          id: "p3",
          tipo: "PayPal",
          numero: "aka***@gmail.com",
          titular: "Akasa Tanjiro",
          imagen: "paypal",
          expiracion: "07/33",
          activa: true,
        },
      ],
    },
  },

  /** Currently logged-in user (null when no session exists) */
  usuarioActivo: null,
};

/* ============================================
   SECTION 6: PAYMENT CARD IMAGES
   ============================================ */

/**
 * Image paths for the different card types
 * @type {Object}
 */
export const imgTarjetas = {
  visa: assets.visa.src,
  mastercard: assets.mastercard.src,
  paypal: assets.paypal.src,
  delete: assets.delete.src,
};
