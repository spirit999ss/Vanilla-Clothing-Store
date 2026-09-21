/*=== State ===*/

// Importa data base del catálogo
import { dataMujeres, dataHombres } from "/js/data.js";

/* ==============================
    HISTORIAL DE PEDIDOS
============================== */
// Pedidos realizados
export let historialPedidos = [
  /*{
    numeroPedido: 1,
    usuario: "Messi Ronaldo",
    total: 33.29,
    fecha: "5/6/2026",
    estado: "ENTREGADO",
  },*/
];

/* ==============================
   ESTADO DE PEDIDOS (TABLA)
============================== */
export let estadosPedidosTabla = [];

// Contador de Pedido
export let contadorPedidos = Math.max(
  ...historialPedidos.map((p) => p.numeroPedido),
  ...estadosPedidosTabla.map((p) => p.numeroPedido),
  0,
);

export function generarNumeroPedido() {
  contadorPedidos += 1;
  return contadorPedidos;
}
/* ==============================
   BÚSQUEDA GLOBAL
============================== */

// Lista  de todos los productos (para búsquedas)
export const dataGeneralBusqueda = [
  ...Object.values(dataMujeres).flat(),
  ...Object.values(dataHombres).flat(),
];

/* ==============================
   FAVORITOS Y CARRITO
============================== */

// Productos marcados como favoritos
export let favoritos = [];

// Productos agregados al carrito
export let carrito = [];

//
/* Usuarios y estado */
export const state = {
  usuarios: {
    u1: {
      nombre: "Messi Ronaldo",
      username: "messironaldo1212",
      genero: "Masculino",
      telefono: "987-654-321",
      correo: "messironaldo333@ejemplo.com",
      direccion: "Av. Siempre Viva",
      contraseña: "golazo123",
      imagen: "Assets/userlogInActivo.png",
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
      imagen: "Assets/userlogInActivo.png",
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
      imagen: "Assets/userlogInActivo.png",
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
  usuarioActivo: null,
};

export const imgTarjetas = {
  visa: "Assets/Img-pagos/visa2.png",
  mastercard: "Assets/Img-pagos/mastercard2.png",
  paypal: "Assets/Img-pagos/paypal2.png",
  delete: "Assets/delete.png",
};
