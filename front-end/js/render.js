/* ==============================
  RENDER
============================== */

//Import Selectors
import {
  body,
  header,
  favoritosContainer,
  carritoContainer,
  width,
  miniModalCarrito,
  miniModalCarritoContainer,
  modalComprarContainer,
  containers,
  formTarjeta,
  formPaypal,
  btnVisaMastercard,
  btnPaypal,
  btnsPerfil,
  btnActivoFijo,
  logInLogo,
  imgVolver,
  encabezadoPedidoContainer,
  historialPedidosContainer,
  perfilContainer,
  contenedoresPerfil,
  menuCategorias,
  categoriasMenuLateralWrapper,
  loginContainer,
  containerInput,
  buscarContainer,
  inputBuscar,
  iconoLogin,
} from "./selectors.js";

//Import State
import {
  historialPedidos,
  estadosPedidosTabla,
  favoritos,
  carrito,
  state,
  imgTarjetas,
} from "./state.js";

//Import Data
import { dataMujeres, dataHombres } from "./products.js";

//Import utils
import {
  crearSelectorTallas,
  deleteProducto,
  actualizarContadorCarrito,
  exitGenerico,
  mostrarActualizarCarrito,
  mostrarModalAviso,
  crearCapaLateralConExit,
  hiddenCategorias,
} from "./utils.js";
//Import Events
import {
  facturaContainer,
  descargarFacturaPDF,
  generarFactura,
  cerrarFactura,
} from "./events.js";

//Import Assets

import { assets } from "./assets.js";
/* ==============================
  FUNCIONES DE UTILIDAD GENERAL
============================== */

/*Favoritos y Carrito Vacío */
function sincronizarContenedorVacio() {
  const cantidadFavoritos = Array.isArray(favoritos) ? favoritos.length : 0;
  const cantidadCarrito = Array.isArray(carrito) ? carrito.length : 0;

  const mensajes = document.querySelectorAll(".mostrar-mensaje-vacio");

  mensajes.forEach((mensaje) => {
    // Si ninguno está abierto, ocultar siempre
    if (
      !favoritosContainer.classList.contains("activado") &&
      !carritoContainer.classList.contains("activado")
    ) {
      mensaje.classList.remove("activado");
      return;
    }

    if (
      favoritosContainer.classList.contains("activado") &&
      cantidadFavoritos === 0
    ) {
      mensaje.textContent = "No tienes productos en favoritos";
      mensaje.classList.add("activado");
    } else if (
      carritoContainer.classList.contains("activado") &&
      cantidadCarrito === 0
    ) {
      mensaje.textContent = "No tienes productos en el carrito";
      mensaje.classList.add("activado");
    } else {
      mensaje.classList.remove("activado");
    }
  });
}

//Detalles de Compra
function detallesCompra() {
  const contenedor = document.querySelector(".detalles-compra-container");
  //
  let subtotal = calcularSubtotal();

  contenedor.innerHTML = `
    <h4>Total a pagar</h4>
    <p class="subtotal">
    Subtotal: <span>$${parseFloat(subtotal).toFixed(2)}</span>
    </p>

    <h5>Aceptamos</h5>
    <div class="metodos-pago"></div>
  `;

  // Botón de pagar
  const btnPagar = document.createElement("button");
  btnPagar.classList.add("btnPagar");
  btnPagar.textContent = "PAGAR AHORA";
  contenedor.appendChild(btnPagar);
  //
  btnPagar.addEventListener("click", () => {
    comprarProducto();
    renderModalCompra();
  });

  const metodos = [assets.visa.src, assets.mastercard.src, assets.paypal.src];

  const pagosDiv = contenedor.querySelector(".metodos-pago");

  metodos.forEach((pago) => {
    const img = document.createElement("img");
    img.classList.add("imgPago");
    img.src = pago;
    img.alt = pago.split("/").pop().replace(".png", "");
    pagosDiv.appendChild(img);
  });
}

/*Calcular Subtotal */
export function calcularSubtotal() {
  let subtotal = 0;

  carrito.forEach((producto) => {
    const cantidad = producto.cantidad || 1;
    subtotal += producto.precio * cantidad;
  });

  return subtotal;
}

/* ==============================
  FUNCIONES DE MODALES
============================== */

//Funcion de Modal de Compra
function comprarProducto() {
  //
  modalComprarContainer.classList.add("activado");

  //
  carritoContainer.classList.remove("activado");
  //
  const exitModalCompra = exitGenerico();
  exitModalCompra.classList.add("exitModalCompra");
  exitModalCompra.addEventListener("click", () => {
    modalComprarContainer.classList.remove("activado");
    renderCarrito();
    if (width >= 768) {
      renderMiniModalCarrito();
    }
  });

  modalComprarContainer.append(exitModalCompra);
}

/* ==============================
  FUNCIONES DE RENDERIZADO DE PRODUCTOS
============================== */

// Renderizar Categorias
function populateGrid(gridSelector, items) {
  const grid = document.querySelector(gridSelector);
  if (!grid || !items.length) return;

  const fragment = document.createDocumentFragment();

  //Crear backdrop oscuro del Zoom de las img

  items.forEach((item) => {
    //
    const productoItem = document.createElement("div");
    productoItem.classList.add("productoItem");

    // Creamos el Contenedor del Zoom de las img y
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("imgContainer");

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.classList.add("imgZoom");
    img.loading = "lazy";
    img.dataset.idProducto = item.id;

    img.onclick = function () {
      imgZoom(this);
    };

    // Add a Favoritos
    const btnFavorito = crearBtnfavorito(item.id);

    btnFavorito.addEventListener("click", () => {
      //
      const imgFav = btnFavorito.querySelector("img:not(.imgRellenoFavorito)");
      const imgRellenoFavorito = btnFavorito.querySelector(
        ".imgRellenoFavorito",
      );
      // Evitar Duplicar productos  en favoritos
      const productoExiste = favoritos.some(
        (producto) => producto.id === item.id,
      );
      if (!imgRellenoFavorito.classList.contains("activado")) {
        imgRellenoFavorito.classList.add("activado");
        imgFav.classList.add("desactivado");
        if (!productoExiste) {
          favoritos.push({
            id: item.id,
            src: item.src,
            alt: item.alt,
            descripcion: item.descripcion,
            precio: item.precio,
          });
          console.log("Esto es de Favoritos:", favoritos);
          renderFavoritos();
          sincronizarContenedorVacio();
        }
      } else {
        imgRellenoFavorito.classList.remove("activado");
        imgFav.classList.remove("desactivado");
        /*Eliminamos el Producto de Favorito cuando se Desmarca */
        if (productoExiste) {
          // Buscar el índice del producto
          const index = favoritos.findIndex((p) => p.id === item.id);

          // Eliminar del array
          if (index !== -1) {
            favoritos.splice(index, 1);
            renderFavoritos();
          }
        }
      }
    });
    imgContainer.append(btnFavorito);

    imgContainer.appendChild(img);

    productoItem.appendChild(imgContainer);

    fragment.appendChild(productoItem);
    //Add Btn  Producto:   Favorito,Carrito, Descripcion y Comprar
    const botones = crearBtnProducto(item);
    const descripcionProductos = crearDescripcionProducto(item);
    productoItem.appendChild(descripcionProductos);
    productoItem.appendChild(botones);
    //
  });

  grid.appendChild(fragment);
  crearBtnProducto(items);
}

/* ==============================
  FUNCIONES DE ZOOM DE IMAGEN
============================== */

//Funcion de Zoom de Img
const backdropZoomImg = document.createElement("div");
backdropZoomImg.classList.add("backdropZoomImg");
body.appendChild(backdropZoomImg);
//
function imgZoom(imgElement, initialIndex = 0) {
  //
  const backdropZoomImg = document.querySelector(".backdropZoomImg");
  backdropZoomImg.classList.add("activado");

  //Contenedor de las Img Zoom
  const imgZoomContainer = document.createElement("div");
  imgZoomContainer.classList.add("imgZoomContainer");
  //
  const productoItem = imgElement.closest(".productoItem");
  const originalSrc = imgElement.src;
  const zoomImgClone = imgElement.cloneNode(true);
  zoomImgClone.classList.add("zoomImgClone");

  imgZoomContainer.appendChild(zoomImgClone);

  //
  // Mover las Imágenes
  const gridContainer = imgElement.closest(
    `.vestidos-grid,
  .blusas-grid,
  .pantalones-mujer-grid,
  .faldas-grid,
  .conjuntos-mujer-grid,
  .accesorios-mujer-grid,
  .camisas-grid,
  .pantalones-hombre-grid,
  .gorras-grid,
  .zapatos-grid,
  .conjuntos-hombre-grid,
  .accesorios-hombre-grid`,
  );

  // Construir array de fuentes de imágenes para la navegación
  const imagenesPrincipales = gridContainer
    ? gridContainer.querySelectorAll(".imgZoom")
    : [];
  const arrayImagenes = Array.from(imagenesPrincipales);
  let currentIndex = isNaN(initialIndex) ? 0 : initialIndex;
  zoomImgClone.src = originalSrc;
  /* */
  // Cambiar Izquierda
  const izquierdaContainer = document.createElement("button");
  izquierdaContainer.classList.add("izquierdaContainer");

  const imgIzquierda = document.createElement("img");
  imgIzquierda.src = assets.left.src;
  imgIzquierda.alt = assets.left.alt;

  izquierdaContainer.appendChild(imgIzquierda);

  // Cambiar Derecha
  const derechaContainer = document.createElement("button");
  derechaContainer.classList.add("derechaContainer");
  const imgDerecha = document.createElement("img");
  imgDerecha.src = assets.right.src;
  imgDerecha.alt = assets.right.alt;

  derechaContainer.appendChild(imgDerecha);
  //
  izquierdaContainer.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + arrayImagenes.length) % arrayImagenes.length;
    zoomImgClone.src = arrayImagenes[currentIndex].src;
  });
  derechaContainer.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % arrayImagenes.length;
    zoomImgClone.src = arrayImagenes[currentIndex].src;
  });
  //

  imgZoomContainer.appendChild(izquierdaContainer);
  imgZoomContainer.appendChild(derechaContainer);
  backdropZoomImg.appendChild(imgZoomContainer);
  // Listeners para cerrar el Zoom
  zoomImgClone.addEventListener("click", () => {
    cerrarZoom();
  });
}
// Función para cerrar el zoom
function cerrarZoom() {
  const backdropZoomImg = document.querySelector(".backdropZoomImg");
  const imgZoomContainer = document.querySelector(".imgZoomContainer");
  const izquierdaContainer = document.querySelector(".izquierdaContainer");
  const derechaContainer = document.querySelector(".derechaContainer");
  const productoItem = document.querySelector(".productoItem.ZoomImg");

  if (imgZoomContainer) imgZoomContainer.remove();
  if (izquierdaContainer) izquierdaContainer.remove();
  if (derechaContainer) derechaContainer.remove();

  if (backdropZoomImg) backdropZoomImg.classList.remove("activado");
  if (productoItem) productoItem.classList.remove("ZoomImg");
}

/* ==============================
  FUNCIONES DE PRODUCTOS Y BOTONES
============================== */

/* Function - Btn Favorito,Carrito, Descripcion y Comprar 369*/
function crearBtnProducto(item) {
  // Precio a Comprar
  const precioAComprar = document.createElement("p");
  precioAComprar.classList.add("precioAComprar");
  precioAComprar.textContent = `$${item.precio}`;

  // Talla a Comprar
  const selectTallasContainer = document.createElement("div");
  selectTallasContainer.classList.add("selectTallasContainer");

  const tallasAComprar = crearSelectorTallas();
  selectTallasContainer.appendChild(tallasAComprar);
  //

  // Add a Carrito
  const btnCarrito = crearBtnCarrito(item.id);
  btnCarrito.classList.add("btnCarrito");
  btnCarrito.disabled = true;
  btnCarrito.classList.add("desactivado");
  tallasAComprar.addEventListener("change", () => {
    sincronizarBotonCarrito();
    if (tallasAComprar.value) {
      btnCarrito.disabled = false;
      btnCarrito.classList.remove("desactivado");
    }
  });

  btnCarrito.addEventListener("click", () => {
    sincronizarBotonCarrito();
    //
    const tallaSeleccionada = tallasAComprar.value;
    // Evitar duplicar productos en carrito
    const productoExiste = carrito.some(
      (producto) =>
        producto.id === item.id && producto.talla === tallaSeleccionada,
    );
    /*Si el producto No Existe */

    if (!productoExiste) {
      carrito.push({
        id: item.id,
        src: item.src,
        alt: item.alt,
        descripcion: item.descripcion,
        precio: item.precio,
        talla: tallaSeleccionada,
        cantidad: 1,
      });
      console.log("Estos datos los envio a Carrito", carrito);
      sincronizarBotonCarrito();
      sincronizarContenedorVacio();

      renderCarrito();
      renderModalCompra();
      actualizarContadorCarrito();
      sincronizarBotonFavorito();

      if (width >= 768) {
        renderMiniModalCarrito();
        sincronizarBotonCarrito();
      }
    } else {
      mostrarModalAviso();
    }
  });

  // Contenedor de Botones
  const botonesContainer = document.createElement("div");
  botonesContainer.classList.add("botonesProducto");

  botonesContainer.append(precioAComprar, selectTallasContainer, btnCarrito);

  return botonesContainer;
}

// Contador de Cuantos Productos va a Comprar usando select
function contadorProducto(productoId, talla, cantidadInicial = 1) {
  const cantidad = Number(cantidadInicial) || 1;

  const container = document.createElement("div");
  container.classList.add("contadorContainer");

  const select = document.createElement("select");
  select.classList.add("cantidad-select");

  // Crear opciones
  for (let i = 1; i <= 9; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = i;
    select.appendChild(option);
  }

  // valor requerido  después de que existan las opciones
  select.value = String(cantidad);

  select.onchange = async () => {
    const nuevaCantidad = Number(select.value);

    const producto = carrito.find(
      (p) => p.id === productoId && p.talla === talla,
    );

    if (!producto) return;

    const confirmar = await mostrarActualizarCarrito(
      producto.cantidad,
      nuevaCantidad,
    );

    if (!confirmar) {
      select.value = String(producto.cantidad);
      return;
    }

    producto.cantidad = nuevaCantidad;

    renderMiniModalCarrito();
    renderCarrito();
  };

  container.appendChild(select);
  return container;
}
//Crear Btn de Favorito
function crearBtnfavorito(idProducto) {
  const container = document.createElement("div");
  container.classList.add("btnFavoritoContainer");
  //
  const btnFavorito = document.createElement("button");
  btnFavorito.classList.add("btnFavorito");
  btnFavorito.dataset.idProducto = idProducto;

  const imgFav = document.createElement("img");
  imgFav.classList.add("imgFav");
  imgFav.src = assets.wishlistOutline.src;
  imgFav.alt = assets.wishlistOutline.alt;
  btnFavorito.appendChild(imgFav);
  //Le add el relleno
  const imgRellenoFavorito = document.createElement("img");
  imgRellenoFavorito.classList.add("imgRellenoFavorito");

  imgRellenoFavorito.src = assets.wishlistFilled.src;
  imgRellenoFavorito.alt = assets.wishlistFilled.alt;

  btnFavorito.appendChild(imgRellenoFavorito);

  container.append(btnFavorito);
  return container;
}
// Crear Btn Carrito
function crearBtnCarrito(idProducto) {
  const btnCarrito = document.createElement("button");
  btnCarrito.dataset.idProducto = idProducto;
  btnCarrito.textContent = "Agregar al Carrito";
  return btnCarrito;
}

//Descripcion
function crearDescripcionProducto(item) {
  const descripcionContainer = document.createElement("div");
  descripcionContainer.classList.add("descripcionContainer");

  const descripcion = document.createElement("p");
  descripcion.textContent = item.descripcion;

  descripcionContainer.appendChild(descripcion);

  return descripcionContainer;
}

/* ==============================
  FUNCIONES DE FAVORITOS
============================== */

//Redenrizar favorito
function renderFavoritos() {
  const contenedor = document.querySelector(".favoritos-productos");
  contenedor.innerHTML = "";
  //Contenedor del Producto Item de Favorito
  const productoFavoritosContainer = document.createElement("div");
  productoFavoritosContainer.classList.add("productoFavoritosContainer");

  favoritos.forEach((item) => {
    const productoItem = document.createElement("div");
    productoItem.classList.add("productoFavoritos");

    const detallesProducto = document.createElement("div");
    detallesProducto.classList.add("detallesProducto");

    // Delete botón
    const deleteBtn = deleteProducto();
    deleteBtn.addEventListener("click", () => {
      //

      sincronizarBotonFavorito();

      eliminarFavorito(item.id);
      //
      sincronizarContenedorVacio();
    });
    productoItem.append(deleteBtn);

    // Imagen
    const img = document.createElement("img");
    img.classList.add("imgFavoritos");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    productoItem.appendChild(img);

    // Descripción
    const descripcion = crearDescripcionProducto(item);
    descripcion.classList.add("descripcionFavoritos");
    productoItem.appendChild(descripcion);

    // Precio
    const btnComprarFavorito = document.createElement("p");
    btnComprarFavorito.textContent = `$${item.precio}`;
    btnComprarFavorito.classList.add("btnComprarFavorito");
    detallesProducto.appendChild(btnComprarFavorito);

    // Tallas Contenedor
    const selectTallasContainer = document.createElement("div");
    selectTallasContainer.classList.add("selectTallasContainer");

    const tallas = crearSelectorTallas();
    selectTallasContainer.appendChild(tallas);
    detallesProducto.appendChild(selectTallasContainer);

    // Botón agregar de Favorito al carrito
    const favoritoAgregarCarrito = crearBtnCarrito(item.id);
    favoritoAgregarCarrito.classList.add("favoritoAgregarCarrito");

    favoritoAgregarCarrito.disabled = true;
    favoritoAgregarCarrito.classList.add("desactivado");

    tallas.addEventListener("change", () => {
      sincronizarBotonCarrito();
      if (tallas.value) {
        favoritoAgregarCarrito.disabled = false;
        favoritoAgregarCarrito.classList.remove("desactivado");
      }
    });

    favoritoAgregarCarrito.addEventListener("click", () => {
      const tallaSeleccionada = tallas.value;

      if (!tallaSeleccionada) {
        return;
      }

      agregarFavoritoAlCarrito(item, tallaSeleccionada);
      sincronizarBotonFavorito();
      actualizarContadorCarrito();
      sincronizarBotonCarrito();
      /*Ocultar el Mini Modal cuando esta en Favorito*/
      if (favoritosContainer.classList.contains("activado")) {
        miniModalCarrito.classList.remove("activado");
        miniModalCarritoContainer.classList.remove("activado");
      }
    });

    detallesProducto.appendChild(favoritoAgregarCarrito);
    productoItem.appendChild(detallesProducto);

    productoFavoritosContainer.appendChild(productoItem);

    // Agregar al contenedor del Favoritos
    contenedor.appendChild(productoFavoritosContainer);
  });
}

function agregarFavoritoAlCarrito(item, tallaSeleccionada) {
  // Validar si ya existe
  const productoExiste = carrito.some(
    (p) => p.id === item.id && p.talla === tallaSeleccionada,
  );
  if (productoExiste) {
    mostrarModalAviso();
    return;
  }

  // Agregar al carrito
  carrito.push({
    id: item.id,
    src: item.src,
    alt: item.alt,
    descripcion: item.descripcion,
    precio: item.precio,
    talla: tallaSeleccionada,
    cantidad: 1,
  });

  // Actualizar UI
  renderCarrito();
  if (width >= 768) renderMiniModalCarrito();
  actualizarContadorCarrito();
}

//
function eliminarFavorito(idProducto) {
  // Encontrar el índice del producto
  const index = favoritos.findIndex((p) => p.id === idProducto);

  if (index !== -1) {
    // Eliminar del array usando splice
    favoritos.splice(index, 1);

    // Renderizar favoritos
    renderFavoritos();

    // Sincronizar el botón
    sincronizarBotonFavorito();
  }
}

/*Sincronizar Btn de Favorito */
function sincronizarBotonFavorito() {
  const btnFavorito = document.querySelectorAll(".btnFavorito");

  btnFavorito.forEach((btn) => {
    const idBtn = btn.dataset.idProducto;
    const producto = favoritos.find((p) => p.id === idBtn);

    //
    const imgRelleno = btn.querySelector(".imgRellenoFavorito");
    const imgFav = btn.querySelector(".imgFav");

    if (producto) {
      if (imgRelleno) {
        imgRelleno.classList.add("activado");
      }
      if (imgFav) {
        imgFav.classList.add("desactivado");
      }
    } else {
      if (imgRelleno) {
        imgRelleno.classList.remove("activado");
      }
      if (imgFav) {
        imgFav.classList.remove("desactivado");
      }
    }
  });
}

/*Sincronizar Btn de Carrito */
function sincronizarBotonCarrito() {
  const btnCarrito = document.querySelectorAll(".btnCarrito");

  btnCarrito.forEach((btn) => {
    const idBtn = btn.dataset.idProducto;
    //
    const contenedorProducto = btn.closest(".botonesProducto");
    const select = contenedorProducto.querySelector("select");
    const tallaSeleccionada = select.value;

    const productoExiste = carrito.some(
      (p) => p.id === idBtn && p.talla === tallaSeleccionada,
    );

    // Cambiar el texto según si está en el carrito o no
    if (productoExiste) {
      btn.textContent = "Producto agregado :)";
      btn.classList.add("activado");
    } else {
      btn.textContent = "Agregar al Carrito";

      btn.classList.remove("activado");
      btn.classList.add("desactivado");
    }
  });

  //Btn del Contenedor de Favoritos
  const favoritoAgregarCarrito = document.querySelectorAll(
    ".favoritoAgregarCarrito",
  );

  favoritoAgregarCarrito.forEach((btn) => {
    const idBtn = btn.dataset.idProducto;
    //
    const contenedorProducto = btn.closest(".detallesProducto");
    const select = contenedorProducto.querySelector("select");
    const tallaSeleccionada = select.value;

    const productoExiste = carrito.some(
      (p) => p.id === idBtn && p.talla === tallaSeleccionada,
    );

    // Cambiar el texto según si está en el carrito o no
    if (productoExiste) {
      btn.textContent = "Producto agregado :)";
      btn.classList.add("activado");
    } else {
      btn.textContent = "Agregar al Carrito";

      btn.classList.remove("activado");
      btn.classList.add("desactivado");
    }
  });
}

/* ==============================
  FUNCIONES DE CARRITO
============================== */

//Redenrizar Carrito
function renderCarrito() {
  const contenedor = document.querySelector(".carrito-productos");

  contenedor.innerHTML = "";

  //Actualizar contador del carrito
  actualizarContadorCarrito();
  //Contenedor de Producto Item de Carrito
  const productoCarritoContainer = document.createElement("div");
  productoCarritoContainer.classList.add("productoCarritoContainer");
  console.log("Asi esta Carrito", carrito);
  carrito.forEach((item, index) => {
    // Crear contenedor del producto en carrito
    const productoItem = document.createElement("div");
    productoItem.classList.add("productoCarrito");

    // Crear contenedor de detalles del producto
    const detallesProducto = document.createElement("div");
    detallesProducto.classList.add("detallesCarrito");

    //Delete producto Carrito
    const deleteBtn = deleteProducto();
    deleteBtn.classList.add("deleteBtnCarrito");
    productoItem.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      const idProductoAEliminar = item.id;

      // Eliminar del array del carrito
      const index = carrito.findIndex((p) => p.id === idProductoAEliminar);

      if (index !== -1) {
        carrito.splice(index, 1);
      }
      // Eliminar del DOM
      productoItem.remove();
      sincronizarBotonCarrito();
      sincronizarContenedorVacio();

      // Sincronizar botón original del producto
      const botonesProducto = document.querySelectorAll(".botonesProducto");
      botonesProducto.forEach((element) => {
        const btnCarrito = element.querySelector(".btnCarrito");

        if (
          btnCarrito &&
          btnCarrito.dataset.idProducto === idProductoAEliminar
        ) {
          const imgCarrito = btnCarrito.querySelector(".imgCarrito");
          const imgRellenoCarrito =
            btnCarrito.querySelector(".imgRellenoCarrito");

          //
          if (imgCarrito) imgCarrito.classList.remove("desactivado");
          if (imgRellenoCarrito) imgRellenoCarrito.classList.remove("activado");
        }
      });
      sincronizarBotonCarrito();
      renderCarrito();
      renderFavoritos();
      //
      if (
        (width >= 768 && favoritosContainer.classList.contains("activado")) ||
        carritoContainer.classList.contains("activado")
      ) {
        renderMiniModalCarrito();
      }

      detallesCompra();
      console.log("estos son los datos del carrito", carrito);
    });

    // Imagen del producto
    const img = document.createElement("img");
    img.classList.add("imgCarrito");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    productoItem.appendChild(img);

    // Descripción del Producto Carrito
    const descripcion = crearDescripcionProducto(item);
    detallesProducto.appendChild(descripcion);
    descripcion.classList.add("descripcionCarrito");

    /*Contenedor de Precio , Talla y Cantidad  */
    const infoCompraCarrito = document.createElement("div");
    infoCompraCarrito.classList.add("infoCompraCarrito");

    // Precio
    const precioProducto = document.createElement("p");
    precioProducto.textContent = `$${item.precio}`;

    // Talla seleccionada
    const tallaSeleccionada = document.createElement("p");
    tallaSeleccionada.textContent = `Talla: ${item.talla}`;
    // Selector de cantidad
    const cantidadContenedor = contadorProducto(
      item.id,
      item.talla,
      item.cantidad,
    );

    infoCompraCarrito.append(
      precioProducto,
      tallaSeleccionada,
      cantidadContenedor,
    );

    detallesProducto.appendChild(infoCompraCarrito);
    /* */
    //Add a Favoritos desde Carrito
    const carritoAgregarFavorito = document.createElement("div");
    carritoAgregarFavorito.classList.add("carritoAgregarFavorito");
    const btnFavorito = document.createElement("span");
    btnFavorito.textContent = "Agregar a Favoritos";

    carritoAgregarFavorito.appendChild(btnFavorito);
    detallesProducto.appendChild(carritoAgregarFavorito);
    carritoAgregarFavorito.addEventListener("click", () => {
      const productoExiste = favoritos.some(
        (producto) => producto.id === item.id,
      );
      //
      if (productoExiste) {
        mostrarModalAviso();
        return;
      }
      //
      if (!productoExiste) {
        favoritos.push({
          id: item.id,
          src: item.src,
          alt: item.alt,
          descripcion: item.descripcion,
          precio: item.precio,
        });

        //
        const idProductoAEliminar = item.id;

        // Eliminar del array de carrito
        const index = carrito.findIndex((p) => p.id === idProductoAEliminar);
        if (index !== -1) {
          carrito.splice(index, 1);
        }

        // Eliminar del DOM
        productoItem.remove();
        detallesCompra();
      }

      renderFavoritos();
      actualizarContadorCarrito();
      sincronizarBotonFavorito();
      sincronizarBotonCarrito();
      sincronizarContenedorVacio();
    });

    // Agregar detalles al producto
    productoItem.appendChild(detallesProducto);

    productoCarritoContainer.appendChild(productoItem);

    // Agregar al contenedor del carrito
    contenedor.appendChild(productoCarritoContainer);
    detallesCompra();
  });
}

/* ==============================
  FUNCIONES DE MINI MODAL CARRITO
============================== */

//Redenrizar Mini Modal de Carrito
function renderMiniModalCarrito() {
  //Contendor principal
  miniModalCarrito.innerHTML = "";
  //exit de Mini Modal
  const exitMiniModal = exitGenerico();
  exitMiniModal.classList.add("exitMiniModal");
  exitMiniModal.addEventListener("click", () => {
    miniModalCarrito.classList.remove("activado");
    miniModalCarritoContainer.classList.remove("activado");
  });

  //Contenedor del Titulo y el contador de Articulo
  const tituloMiniModalContainer = document.createElement("div");
  tituloMiniModalContainer.classList.add("tituloMiniModalContainer");
  const h3MiniModal = document.createElement("h3");
  h3MiniModal.textContent = "Productos a Comprar";

  tituloMiniModalContainer.append(h3MiniModal);
  tituloMiniModalContainer.append(exitMiniModal);

  const contadorArticulosMiniModal = document.createElement("span");

  const cantidad = Array.isArray(carrito) ? carrito.length : 0;
  contadorArticulosMiniModal.textContent = cantidad;
  ///
  contadorArticulosMiniModal.textContent = `${cantidad} ${cantidad === 1 ? "artículo" : "artículos"}`;
  //
  tituloMiniModalContainer.appendChild(contadorArticulosMiniModal);

  miniModalCarrito.appendChild(tituloMiniModalContainer);

  //Alert de que solo se va a estar los articulos x 1 Hora
  const avisoDelTiempoArticuloContainer = document.createElement("div");

  avisoDelTiempoArticuloContainer.classList.add(
    "avisoDelTiempoArticuloContainer",
  );
  const aviso = document.createElement("p");
  aviso.textContent = " Solo Vamos a Guardar tus Productos  por 1 hora :)";
  //
  avisoDelTiempoArticuloContainer.appendChild(aviso);
  miniModalCarrito.appendChild(avisoDelTiempoArticuloContainer);

  // Crear contenedor del producto en mini modal
  const productoMiniModalContainer = document.createElement("div");
  productoMiniModalContainer.classList.add("productoMiniModalContainer");

  // Mostrar productos del carrito en el mini modal
  carrito.forEach((item) => {
    const productoItemMiniModal = document.createElement("div");
    productoItemMiniModal.classList.add("productoItemMiniModal");
    //Eliminar Producto de MinModal
    const deleteProductoMiniModal = deleteProducto();
    deleteProductoMiniModal.classList.add("deleteProductoMiniModal");
    deleteProductoMiniModal.addEventListener("click", () => {
      const idProductoAEliminar = item.id;

      // Eliminar del array del carrito
      const index = carrito.findIndex((p) => p.id === idProductoAEliminar);

      if (index !== -1) {
        carrito.splice(index, 1);
      }
      // Eliminar del DOM
      productoItemMiniModal.remove();

      // Sincronizar botón original del producto
      const botonesProducto = document.querySelectorAll(".botonesProducto");
      botonesProducto.forEach((element) => {
        const btnCarrito = element.querySelector(".btnCarrito");

        if (
          btnCarrito &&
          btnCarrito.dataset.idProducto === idProductoAEliminar
        ) {
          const imgCarrito = btnCarrito.querySelector(".imgCarrito");
          const imgRellenoCarrito =
            btnCarrito.querySelector(".imgRellenoCarrito");

          //
          if (imgCarrito) imgCarrito.classList.remove("desactivado");
          if (imgRellenoCarrito) imgRellenoCarrito.classList.remove("activado");
        }
      });
      sincronizarBotonCarrito();
      renderCarrito();
      //
      if (width >= 768) {
        renderMiniModalCarrito();
      }
      sincronizarBotonCarrito();
      detallesCompra();
    });

    //Detalles del Producto -Mini Modal
    const detallesMiniModal = document.createElement("detallesMiniModal");
    detallesMiniModal.classList.add("detallesMiniModal");

    // Imagen
    const img = document.createElement("img");
    img.id = "imgMiniModal";
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    productoItemMiniModal.appendChild(img);

    // Precio
    const precio = document.createElement("p");
    precio.textContent = `$${item.precio}`;
    precio.classList.add("precioMiniModal");
    detallesMiniModal.appendChild(precio);

    // Descripción
    const descripcion = crearDescripcionProducto(item);
    descripcion.classList.add("descripcionMiniModal");
    detallesMiniModal.appendChild(descripcion);

    //
    const tallaSeleccionada = document.createElement("p");

    tallaSeleccionada.classList.add("tallaCarrito");
    detallesMiniModal.appendChild(tallaSeleccionada);

    //Cantidad de Producto Mini Modal
    const cantidadProductoMiniModal = document.createElement("span");
    cantidadProductoMiniModal.classList.add("cantidadProductoMiniModal");

    const cantidad = Array.isArray(carrito) ? carrito.length : 0;
    cantidadProductoMiniModal.textContent = cantidad;
    // Cantidad del Producto
    cantidadProductoMiniModal.textContent = `Cantidad: ${cantidad}`;

    //Concatenar
    tallaSeleccionada.innerHTML = `Talla: ${item.talla} <span style="margin-left:18px;">Cantidad: ${item.cantidad}</span>`;

    //
    detallesMiniModal.appendChild(deleteProductoMiniModal);
    productoItemMiniModal.append(detallesMiniModal);
    productoMiniModalContainer.appendChild(productoItemMiniModal);

    miniModalCarrito.append(productoMiniModalContainer);
  });
  //Subtotal del Mini Modal
  const subtotalContainer = document.createElement("div");
  subtotalContainer.classList.add("subtotalContainer");

  // Agregar total del carrito de Mini Modal
  const totalPrecio = document.createElement("span");
  let subtotal = calcularSubtotal();

  subtotalContainer.innerHTML = `
  <p class="subtotal">Subtotal:</p>
  <p >$${parseFloat(subtotal).toFixed(2)}</p>
`;

  miniModalCarrito.append(subtotalContainer);
  totalPrecio.classList.add("totalPrecioMiniModal");

  // Btnl del Mini Modal de Compra
  const btnMiniModalContainer = document.createElement("div");
  btnMiniModalContainer.classList.add("btnMiniModalContainer");

  const btnVerCarrito = document.createElement("button");
  btnVerCarrito.textContent = "Ver Carrito";
  //
  btnVerCarrito.addEventListener("click", () => {
    carritoContainer.classList.add("activado");
    miniModalCarrito.classList.remove("activado");
  });

  const btnComprarMiniModalCarrito = document.createElement("button");
  btnComprarMiniModalCarrito.textContent = "Pagar Ahora";
  //
  btnComprarMiniModalCarrito.addEventListener("click", () => {
    renderModalCompra();
    comprarProducto();
  });

  //
  btnMiniModalContainer.append(btnVerCarrito);
  btnMiniModalContainer.append(btnComprarMiniModalCarrito);
  miniModalCarrito.append(btnMiniModalContainer);

  //Envios y Pedidios
  const envioYPedidosContainer = document.createElement("div");
  envioYPedidosContainer.classList.add("envioYPedidosContainer");

  const envioYPedidos = document.createElement("h3");
  envioYPedidos.textContent = "Envio y Devoluciones Gratis";

  envioYPedidosContainer.append(envioYPedidos);

  const masInf = document.createElement("p");
  masInf.textContent = "Mas Informacion ";

  const linkAqui = document.createElement("a");
  linkAqui.href = "#";
  linkAqui.textContent = "aqui";
  masInf.append(linkAqui);

  envioYPedidosContainer.append(masInf);

  miniModalCarrito.append(envioYPedidosContainer);
}

/* ==============================
  FUNCIONES DE MODAL DE COMPRA
============================== */

//Redenrizar Modal de Compra
function renderModalCompra() {
  // Contenedor principal de productos
  const contenedorProductos = document.querySelector(".productos-modal-compra");
  //Exit Modal de Compra
  const exitModalCompra = exitGenerico();
  exitModalCompra.classList.add("exitModalCompra");

  // Totales
  const subtotalSpan = document.getElementById("subtotal");
  const descuentoSpan = document.getElementById("descuento");
  const ivaSpan = document.getElementById("iva");
  const totalSpan = document.getElementById("total");

  // Limpiar contenido anterior
  contenedorProductos.innerHTML = "";
  // Contador de artículos
  const tituloH3 = document.querySelector(
    ".productos-modal-compra-container h3",
  );

  const contadorArticulos = document.querySelector(
    ".productos-modal-compra-container h3 span",
  );
  const cantidad = Array.isArray(carrito) ? carrito.length : 0;
  contadorArticulos.textContent = cantidad;
  contadorArticulos.textContent = `${cantidad} ${cantidad === 1 ? "artículo" : "artículos"}`;

  tituloH3.firstChild.textContent = cantidad === 1 ? "Producto " : "Productos ";

  // Renderizar productos
  carrito.forEach((item) => {
    const productoModalCompra = document.createElement("div");
    productoModalCompra.classList.add("productoModalCompra");
    //Delete Producto del Modal de Compra
    const deleteModalCompra = deleteProducto();
    deleteModalCompra.classList.add("deleteModalCompra");
    deleteModalCompra.addEventListener("click", () => {
      const idProductoAEliminar = item.id;
      // Eliminar del array del carrito
      const index = carrito.findIndex((p) => p.id === idProductoAEliminar);

      if (index !== -1) {
        carrito.splice(index, 1);
      }
      // Eliminar del DOM
      productoModalCompra.remove();

      // Sincronizar botón original del producto
      const botonesProducto = document.querySelectorAll(".botonesProducto");
      botonesProducto.forEach((element) => {
        const btnCarrito = element.querySelector(".btnCarrito");

        if (
          btnCarrito &&
          btnCarrito.dataset.idProducto === idProductoAEliminar
        ) {
          const imgCarrito = btnCarrito.querySelector(".imgCarrito");
          const imgRellenoCarrito =
            btnCarrito.querySelector(".imgRellenoCarrito");

          //
          if (imgCarrito) imgCarrito.classList.remove("desactivado");
          if (imgRellenoCarrito) imgRellenoCarrito.classList.remove("activado");
        }
      });
      sincronizarBotonCarrito();
      renderModalCompra();
      renderCarrito();
      renderMiniModalCarrito();

      detallesCompra();
    });

    productoModalCompra.appendChild(deleteModalCompra);

    // Imagen
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    img.classList.add("imgModalCompra");

    // Detalles
    const detalles = document.createElement("div");
    detalles.classList.add("detallesModalCompra");

    // Descripción
    const descripcion = crearDescripcionProducto(item);
    descripcion.classList.add("descripcionModalCompra");

    /*Contenedor de Precio , Talla y Cantidad  */
    const infoCompra = document.createElement("div");
    infoCompra.classList.add("infoCompraModalCompra");
    // Precio
    const precio = document.createElement("p");
    precio.textContent = `$${item.precio}`;
    precio.classList.add("precioModalCompra");

    // Talla
    const talla = document.createElement("p");
    talla.textContent = `Talla: ${item.talla}`;

    //Cantidad
    const cantidad = document.createElement("p");
    cantidad.textContent = `Cantidad: ${item.cantidad} `;

    infoCompra.append(precio, talla, cantidad);

    detalles.append(descripcion, infoCompra);
    productoModalCompra.append(img, detalles);
    contenedorProductos.appendChild(productoModalCompra);

    contenedorProductos.append(exitModalCompra);
    console.log("Hola Mundo");
  });

  // Cálculos
  const subtotal = calcularSubtotal();
  let descuento = 9.36;
  let iva = 0.15;
  //

  //Para que Muestre solo 0
  if (cantidad === 0) {
    descuento = 0;
    iva = 0;
    //
  }

  const total = subtotal - descuento + iva;

  // Mostrar totales
  subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  descuentoSpan.textContent = `$${descuento.toFixed(2)}`;
  ivaSpan.textContent = `$${iva.toFixed(2)}`;
  totalSpan.textContent = `$${total.toFixed(2)}`;
}
/* ==============================
  FUNCIONES DE HISTORIAL DE PEDIDOS
============================== */

function getPedidoTotal(pedido) {
  if (!pedido) return 0;
  const raw = pedido.totalFinal ?? pedido.total ?? 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = parseFloat(raw.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  if (raw && typeof raw === "object") {
    const nested = raw.totalFinal ?? raw.total ?? raw.amount ?? raw.value;
    const n = parseFloat(nested);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}
console.log(historialPedidos);
/*Render el Historial de Pedidos */
function renderHistorialPedidos() {
  encabezadoPedidoContainer.innerHTML = "";
  historialPedidosContainer.innerHTML = "";

  historialPedidos.forEach((pedido) => {
    const encabezadoPedido = document.createElement("h3");
    encabezadoPedido.classList.add("encabezadoPedido");
    encabezadoPedido.addEventListener("click", () => {
      renderFacturaPedido(pedido);
    });

    const totalNum = getPedidoTotal(pedido);

    const p1 = document.createElement("p");
    p1.textContent = `Pedido #${pedido.numeroPedido}`;

    const p2 = document.createElement("p");
    p2.textContent = `Usuario: ${pedido.usuario}`;

    const p3 = document.createElement("p");
    p3.textContent = `Total: $${totalNum.toFixed(2)}`;

    const p4 = document.createElement("p");
    p4.textContent = `Fecha: ${pedido.fecha}`;

    const p5 = document.createElement("p");
    p5.textContent = `Estado: ${(pedido.estado || "entregado").toUpperCase()}`;

    encabezadoPedido.append(p1, p2, p3, p4, p5);
    encabezadoPedido.dataset.pedido = pedido.numeroPedido;
    encabezadoPedidoContainer.appendChild(encabezadoPedido);

    (pedido.productos || []).forEach((item) => {
      const productoHistorialPedidos = document.createElement("div");
      productoHistorialPedidos.classList.add("productoHistorialPedidos");
      productoHistorialPedidos.dataset.pedido = pedido.numeroPedido;

      const img = document.createElement("img");
      img.id = "imgHistorialPedidos";
      img.src = item.imagen || item.src || "";
      img.alt = item.alt || item.nombre || item.descripcion || "Producto";
      img.loading = "lazy";
      productoHistorialPedidos.appendChild(img);

      const descripcion = crearDescripcionProducto({
        ...item,
        descripcion: item.descripcion || item.nombre || item.alt || "Producto",
      });
      productoHistorialPedidos.appendChild(descripcion);

      const detallesProductoHistorial = document.createElement("div");
      detallesProductoHistorial.classList.add("detallesProductoHistorial");

      const precioUnit = parseFloat(item.precio || 0) || 0;
      const precio = document.createElement("p");
      precio.textContent = `Precio(Unitario): $${precioUnit.toFixed(2)}`;

      const talla = document.createElement("p");
      talla.textContent = `Talla: ${item.talla || "-"}`;

      const cantidadP = document.createElement("p");
      cantidadP.textContent = `Cantidad: ${item.cantidad || 1}`;

      detallesProductoHistorial.append(precio, talla, cantidadP);
      productoHistorialPedidos.appendChild(detallesProductoHistorial);
      historialPedidosContainer.appendChild(productoHistorialPedidos);
    });
  });
}
// Función para generar talla y Cantidad aleatoria
function tallaRandom() {
  const tallas = ["S", "M", "XL"];
  const indice = Math.floor(Math.random() * tallas.length);
  return tallas[indice];
}
function cantidadRandom() {
  return Math.floor(Math.random() * 9) + 1;
}
function fechaRandom() {
  const inicio = new Date(2025, 0, 1);
  const hoy = new Date();

  const fecha = new Date(
    inicio.getTime() + Math.random() * (hoy.getTime() - inicio.getTime()),
  );

  return fecha.toLocaleDateString();
}
// Llamamos a la función
renderHistorialPedidos();

/* ==============================
  RENDER MUJER
============================== */

const productosMujer = {
  vestidos: [],
  blusas: [],
  pantalones: [],
  faldas: [],
  conjuntos: [],
  accesorios: [],
};

const productosHombre = {
  camisas: [],
  pantalones: [],
  gorras: [],
  zapatos: [],
  conjuntos: [],
  accesorios: [],
};
// Para hacer el Z-Indez
const containersTienda = document.querySelectorAll(
  ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, .camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
);
//Cargar data en productos

// Mujer
productosMujer.vestidos = dataMujeres.vestidos;
productosMujer.blusas = dataMujeres.blusas;
productosMujer.pantalones = dataMujeres.pantalones;
productosMujer.faldas = dataMujeres.faldas;
productosMujer.conjuntos = dataMujeres.conjuntos;
productosMujer.accesorios = dataMujeres.accesorios;

// Hombre
productosHombre.camisas = dataHombres.camisas;
productosHombre.pantalones = dataHombres.pantalones;
productosHombre.gorras = dataHombres.gorras;
productosHombre.zapatos = dataHombres.zapatos;
productosHombre.conjuntos = dataHombres.conjuntos;
productosHombre.accesorios = dataHombres.accesorios;

//

//

populateGrid(".vestidos-grid", productosMujer.vestidos);
populateGrid(".blusas-grid", productosMujer.blusas);
populateGrid(".pantalones-mujer-grid", productosMujer.pantalones);
populateGrid(".faldas-grid", productosMujer.faldas);
populateGrid(".conjuntos-mujer-grid", productosMujer.conjuntos);
populateGrid(".accesorios-mujer-grid", productosMujer.accesorios);

/* ==============================
  RENDER HOMBRE
============================== */
populateGrid(".camisas-grid", productosHombre.camisas);
populateGrid(".pantalones-hombre-grid", productosHombre.pantalones);
populateGrid(".gorras-grid", productosHombre.gorras);
populateGrid(".zapatos-grid", productosHombre.zapatos);
populateGrid(".conjuntos-hombre-grid", productosHombre.conjuntos);
populateGrid(".accesorios-hombre-grid", productosHombre.accesorios);

//
//Mostramos el Grid Correspodinte
const toggleGrids = document.querySelectorAll(
  ".productos-mujer , .productos-hombre",
);
toggleGrids.forEach((e) => {
  e.addEventListener("click", function (event) {
    toggleGrid.call(this, event);
    //Header Visible
    if (width <= 768) {
      header.classList.remove("desactivado");
    }
  });
});

//Producto Grid Visible

function toggleGrid() {
  const containers = this.querySelectorAll(
    ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, .camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
  );
  containers.forEach((c) => {
    c.classList.add("activado");
    body.style.overflowY = "hidden";
  });
}
/*Render Perfil del Usuario */
export function renderPerfilUsuario() {
  const usuario = state.usuarioActivo;

  if (!usuario || typeof usuario !== "object") {
    console.warn("No hay usuario activo o el dato no es un objeto:", usuario);
    return;
  }

  const nombre = document.getElementById("nombre-usuario-perfil");
  const genero = document.getElementById("genero-usuario-perfil");
  const telefono = document.getElementById("telefono-usuario-perfil");
  const correo = document.getElementById("correo-usuario-perfil");
  const direccion = document.getElementById("direccion-usuario-perfil");
  const nombreHeader = document.querySelector(".nombre-perfil-usuario");

  if (nombre) nombre.value = usuario.nombre || "";
  if (genero) genero.value = usuario.genero || "";
  if (telefono) telefono.value = usuario.telefono || "";
  if (correo) correo.value = usuario.correo || "";
  if (direccion) direccion.value = usuario.direccion || "";
  //

  if (nombreHeader) {
    nombreHeader.textContent = usuario.nombre || "Usuario";
    aplicarAnimacionLetras(nombreHeader);
  }

  console.log("Perfil renderizado correctamente:", usuario.nombre);
}

//Actualizar la Img add del Usuario
export function renderImgUsuario() {
  const logInLogo = document.querySelector(".log-in-logo");

  // Limpiamos el contenido del botón
  logInLogo.innerHTML = "";

  const img = document.createElement("img");
  //

  const usuarioActivo = localStorage.getItem("usuarioActivo");
  // Si el Usuario se Logueo
  if (usuarioActivo) {
    console.log("El Usuario se Logueo");
  }

  // CASO C: Hay usuario logueado y sí tiene foto personalizada
  else {
    img.src = state.usuarioActivo.imagen;
    img.alt = state.usuarioActivo.nombre;
    img.classList.add("userlogInActivo");
  }

  logInLogo.appendChild(img);
}

// Función para animar las letras en hover
export function aplicarAnimacionLetras(elemento) {
  const texto = elemento.textContent.trim();

  // Si el texto está vacío, no hacer nada
  if (!texto) return;

  elemento.innerHTML = "";

  // Dividir el texto en caracteres
  const caracteres = texto.split("");

  caracteres.forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "letra-hover";
    span.textContent = char === " " ? "\u00A0" : char;

    span.style.transitionDelay = `${index * 0.06}s`;

    elemento.appendChild(span);
  });

  // Eventos de hover
  elemento.addEventListener("mouseenter", function () {
    this.classList.add("letras-activas");
  });

  elemento.addEventListener("mouseleave", function () {
    this.classList.remove("letras-activas");
  });
}
/* ==============================
  FUNCIONES DE TABLA DE ESTADOS
============================== */
function renderEstadoTabla() {
  const tbody = document.querySelector(".tabla-pedidos-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  estadosPedidosTabla.forEach((pedido) => {
    const fila = document.createElement("tr");

    const celdaNumero = document.createElement("td");
    celdaNumero.textContent = `#${pedido.numeroPedido}`;

    const celdaFecha = document.createElement("td");
    celdaFecha.textContent = pedido.fecha;

    // Total
    const totalNum = (function (p) {
      if (!p) return 0;
      const raw = p.totalFinal ?? p.total ?? 0;
      if (typeof raw === "number" && Number.isFinite(raw)) return raw;
      if (typeof raw === "string") {
        const n = parseFloat(raw.replace(/[^0-9.-]/g, ""));
        return Number.isFinite(n) ? n : 0;
      }
      if (raw && typeof raw === "object") {
        const nested = raw.totalFinal ?? raw.total ?? raw.amount ?? raw.value;
        const n = parseFloat(nested);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    })(pedido);

    const celdaTotal = document.createElement("td");
    celdaTotal.textContent = `$${totalNum.toFixed(2)}`;

    const celdaEstado = document.createElement("td");
    celdaEstado.textContent = (pedido.estado || "confirmado").toUpperCase();
    celdaEstado.classList.add("estado-" + (pedido.estado || "confirmado"));

    const celdaAccion = document.createElement("td");

    const btnVer = document.createElement("button");
    btnVer.textContent = " 👁️ Ver";
    btnVer.classList.add("btn-ver");
    btnVer.addEventListener("click", () => {
      renderPedidoDetalle(pedido);
    });

    celdaAccion.appendChild(btnVer);

    fila.append(celdaNumero, celdaFecha, celdaTotal, celdaEstado, celdaAccion);
    tbody.appendChild(fila);
  });
}
renderEstadoTabla();
//Render Pedidos

function renderPedidoDetalle(pedido) {
  const template = document.getElementById("pedido-detalle-template");
  if (!template) {
    console.error("Template #pedido-detalle-template no encontrado");
    return;
  }

  // Clonamos el template
  const clone = template.content.cloneNode(true);

  // ====================== HEADER ======================
  const header = clone.querySelector(".pedido-detalle-header");
  header.innerHTML = `
        <h2>Pedido #${pedido.numeroPedido}</h2>
        <p><strong>Cliente:</strong> ${pedido.usuario}</p>
        <p><strong>Fecha:</strong> ${pedido.fecha}</p>
    `;

  // ====================== INFO ======================
  const info = clone.querySelector(".pedido-detalle-info");

  const totalPedido = parseFloat(pedido.totalFinal || pedido.total || 0);

  info.innerHTML = `
    <div class="info-item">
        <strong>Estado:</strong> 
        <span class="estado-${pedido.estado}">${pedido.estado.toUpperCase()}</span>
    </div>
    <div class="info-item">
        <strong>Pagado con:</strong> ${pedido.metodoPago}
    </div>
    <div class="info-item">
        <strong>Total:</strong> $${totalPedido.toFixed(2)}
    </div>
`;

  // ====================== PRODUCTOS ======================
  const productosContainer = clone.querySelector(".pedido-detalle-productos");
  productosContainer.innerHTML = `<h3>Productos (${pedido.productos.length})</h3>`;

  pedido.productos.forEach((prod) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("pedido-producto-item");

    productoDiv.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.alt || prod.nombre}" class="producto-img">
            <div class="producto-info">
                <h4>${prod.nombre}</h4>
                <p><strong>Talla:</strong> ${prod.talla}</p>
                <p><strong>Cantidad:</strong> ${prod.cantidad || prod._cantidad || 1}</p>
                <p><strong>Precio unit.:</strong> $${parseFloat(prod.precio || 0).toFixed(2)}</p>
            </div>
        `;

    productosContainer.appendChild(productoDiv);
  });

  // ====================== MOSTRAR ======================
  mostrarModal(clone);
}
function mostrarModal(contenido) {
  let modal = document.getElementById("pedido-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "pedido-modal";
    modal.classList.add("pedido-modal");
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <button class="modal-close-btn">✕</button>
    </div>
  `;

  const contentBox = modal.querySelector(".modal-content");
  contentBox.appendChild(contenido);

  modal.querySelector(".modal-close-btn").addEventListener("click", () => {
    modal.remove();
  });
}
//Seguridad Cambiar Contraseña , Verificacion de Pasos y Dispositivos Conectados
// Mostrar/ocultar seguridad

/* ==============================
  RENDER FACTURA
============================== */

/*Renderizar Factura */
function renderFacturaPedido(pedido) {
  if (!pedido) return;

  generarFactura(
    {
      nombre: pedido.usuario,
      direccion: pedido.direccion || "",
      correo: pedido.correo || "",
      telefono: pedido.telefono || "",
    },
    pedido.productos,
    pedido.numeroCuenta || "",
    pedido.metodoPago || "",
    pedido,
  );
}

//Renderizar Tarjetas Guardadas
function crearTarjeta(tarjeta) {
  const template = document.getElementById("tarjeta-template");
  const clone = template.content.cloneNode(true);

  const imgTarjeta = clone.querySelector(".tarjeta-logo");
  const tipoText = clone.querySelector(".tarjeta-tipo");
  const numeroText = clone.querySelector(".tarjeta-numero");
  const titularText = clone.querySelector(".tarjeta-titular");
  const fechaText = clone.querySelector(".tarjeta-fecha");

  // Imagen
  imgTarjeta.src = imgTarjetas[tarjeta.imagen] || imgTarjetas.visa;
  imgTarjeta.alt = tarjeta.tipo;

  // Tipo
  tipoText.textContent =
    tarjeta.tipo === "Visa"
      ? "Credit Card"
      : tarjeta.tipo === "Mastercard"
        ? "Debit Card"
        : "Connected Account";

  numeroText.textContent = tarjeta.numero;
  titularText.textContent = tarjeta.titular;
  fechaText.textContent = tarjeta.expiracion;

  return clone.querySelector(".tarjeta-guardada");
}

// Renderizar tarjetas Guardadas
export function renderizarTarjetas() {
  const container = document.querySelector(".tarjeta-guardada-container");
  if (!container) return;

  container.innerHTML = "";

  //
  //Mostramos un mensaje si no hay Tarjetas Guardadas
  const usuarioActivo = state.usuarioActivo;
  btnsPerfil.forEach((btn) => {
    const target = btn.dataset.target;
    const mensaje = document.createElement("p");
    mensaje.textContent = "No tienes tarjetas guardadas";

    if (target === "metodosPago" && !usuarioActivo?.metodosPago?.length) {
      container.append(mensaje);
    }
  });

  //

  const template = document.getElementById("tarjeta-template");
  //Si el Usuario no esta Loguiado
  if (!usuarioActivo) {
    console.warn("No hay usuario activo o no tiene métodos de pago");
    return;
  }
  usuarioActivo.metodosPago.forEach((tarjeta, index) => {
    const tarjetaElement = template.content.cloneNode(true);
    const esPaypal = tarjeta.tipo.toLowerCase() === "paypal";

    // === TIPO ===
    let tipoTitulo = "";
    switch (tarjeta.tipo.toLowerCase()) {
      case "visa":
        tipoTitulo = "Credit Card";
        break;
      case "mastercard":
        tipoTitulo = "Debit Card";
        break;
      case "paypal":
        tipoTitulo = "Connected Account";
        break;
      default:
        tipoTitulo = tarjeta.tipo;
    }

    tarjetaElement.querySelector(".tarjeta-tipo").textContent = tipoTitulo;
    tarjetaElement.querySelector(".tarjeta-titular").textContent =
      tarjeta.titular || "";

    // === EXPIRACIÓN ===
    const expiracionContainer = tarjetaElement.querySelector(".expiracion");
    if (esPaypal) {
      if (expiracionContainer) expiracionContainer.style.display = "none";
    } else {
      if (expiracionContainer) expiracionContainer.style.display = "block";
      tarjetaElement.querySelector(".tarjeta-fecha").textContent =
        tarjeta.expiracion || "N/A";
    }

    // === IMAGEN ===
    if (tarjeta.imagen && imgTarjetas[tarjeta.imagen]) {
      tarjetaElement.querySelector(".tarjeta-logo").src =
        imgTarjetas[tarjeta.imagen];
    }

    // === NÚMERO / EMAIL ===
    const numeroElement = tarjetaElement.querySelector(".tarjeta-numero");
    if (esPaypal) {
      const email = tarjeta.numero || tarjeta.email;
      if (email) {
        const primeras3 = email.substring(0, 3);
        const ultimos6 = email.slice(-6);
        numeroElement.textContent = `${primeras3}••••••${ultimos6}`;
      } else {
        numeroElement.textContent = "—";
      }
    } else {
      const numero = tarjeta.numero || "";
      if (numero.length >= 4) {
        const ultimos4 = numero.slice(-4);
        numeroElement.textContent = `•••• •••• •••• ${ultimos4}`;
      } else {
        numeroElement.textContent = "—";
      }
    }

    // === BOTONES ===
    const btnActualizar = tarjetaElement.querySelector(
      ".btn-actualizar-tarjetas-guardadas",
    );
    const btnEliminar = tarjetaElement.querySelector(
      ".btn-eliminar-tarjetas-guardadas",
    );

    btnActualizar.addEventListener("click", () => {
      console.log(`Actualizar: ${tarjeta.tipo}`);
      const tipoPago = tarjeta.tipo.toLowerCase();

      if (tipoPago === "visa" || tipoPago === "mastercard") {
        limpiarForm(formPaypal);
        // Mostrar formulario de tarjeta, ocultar PayPal
        formTarjeta.classList.remove("desactivado");
        formPaypal.classList.remove("activado");

        // Actualizar botones
        btnVisaMastercard.classList.add("activado");
        btnPaypal.classList.remove("activado");
      } else if (tipoPago === "paypal") {
        limpiarForm(formTarjeta);
        // Mostrar formulario de PayPal, ocultar tarjeta
        formTarjeta.classList.add("desactivado");
        formPaypal.classList.add("activado");

        // Actualizar botones
        btnPaypal.classList.add("activado");
        btnVisaMastercard.classList.remove("activado");
      }

      //  Eliminar tarjeta del array
      state.usuarioActivo.metodosPago.splice(index, 1);

      //  Actualizar el form con los datos de la tarjeta
      actualizarForm(tarjeta);
      //
      //
      const username = state.usuarioActivo.username;
      Object.keys(state.usuarios).forEach((key) => {
        if (state.usuarios[key].username === username) {
          state.usuarios[key].metodosPago = state.usuarioActivo.metodosPago;
        }
      });

      renderizarTarjetas();
    });

    btnEliminar.addEventListener("click", () => {
      if (confirm(`¿Eliminar esta ${tarjeta.tipo}?`)) {
        state.usuarioActivo.metodosPago.splice(index, 1);

        const username = state.usuarioActivo.username;
        Object.keys(state.usuarios).forEach((key) => {
          if (state.usuarios[key].username === username) {
            state.usuarios[key].metodosPago = state.usuarioActivo.metodosPago;
          }
        });

        renderizarTarjetas();
      }
    });

    container.appendChild(tarjetaElement);
  });
}
//

export function mostrarMensajeSinTarjetas() {
  const container = document.querySelector(".tarjeta-guardada-container");

  const usuario = state.usuarios[state.usuarioActivo];

  if (!usuario) return;

  const metodosPago = usuario.metodosPago;

  // limpiar antes de renderizar mensaje
  container.innerHTML = "";

  if (!metodosPago || metodosPago.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No tienes tarjetas guardadas";
    mensaje.classList.add("mensaje-sin-tarjetas");

    container.appendChild(mensaje);
  }
}
/* */
// ==================== CAMBIAR ICONO SEGÚN SELECT ====================

const selectTipoTarjeta = document.getElementById("tipo-tarjeta");
const imgTipoVisaMastercard = document.querySelector(
  ".img-tipo-visa-mastercard",
);
selectTipoTarjeta?.addEventListener("change", () => {
  const metodoSeleccionado = selectTipoTarjeta.value;

  if (metodoSeleccionado === "Visa") {
    // Cambiamos la imagen al logo de Visa
    imgTipoVisaMastercard.src = assets.visa.src;
  } else if (metodoSeleccionado === "Mastercard") {
    // Cambiamos la imagen al logo de Mastercard
    imgTipoVisaMastercard.src = assets.mastercard.src;
  }
});

// Actualizar la Tarjeta - Función para rellenar el form según tipo de tarjeta
function limpiarForm(form) {
  form.reset();
}
function actualizarForm(tarjeta) {
  let form;

  if (tarjeta.tipo === "Visa" || tarjeta.tipo === "Mastercard") {
    form = document.getElementById("form-tarjeta");
  } else if (tarjeta.tipo === "PayPal") {
    form = document.getElementById("form-paypal");
  }

  if (!form) return;

  // Limpiar form
  limpiarForm(form);

  // Rellenar campos según tarjeta
  if (tarjeta.tipo === "Visa" || tarjeta.tipo === "Mastercard") {
    form.querySelector("#tipo-tarjeta").value = tarjeta.tipo;
    form.querySelector("#numero-tarjeta").value = tarjeta.numero;
    form.querySelector("#titular-tarjeta").value = tarjeta.titular;
    form.querySelector("#expiracion-tarjeta").value = tarjeta.expiracion;
  } else if (tarjeta.tipo === "PayPal") {
    form.querySelector("#titular-paypal").value = tarjeta.titular;
    form.querySelector("#email-paypal").value = tarjeta.numero.replace(
      /\*/g,
      "",
    );
    form.querySelector("#confirm-email-paypal").value = tarjeta.numero.replace(
      /\*/g,
      "",
    );
  }
}

///
/* ======================================== */
/* Guardar Tarjeta Cuando se ingrese una Nueva tarjeta */
/* ======================================== */
const btnGuardarTarjeta = document.getElementById("guardar-tarjeta");

btnGuardarTarjeta.addEventListener("click", (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipo-tarjeta").value.trim();
  const numero = document.getElementById("numero-tarjeta").value.trim();
  const titular = document.getElementById("titular-tarjeta").value.trim();
  const expiracion = document.getElementById("expiracion-tarjeta").value.trim();

  // Validar que todos los campos estén completos
  if (!tipo || !numero || !titular || !expiracion) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Validar longitud del número de tarjeta
  if (numero.length !== 10) {
    alert("El número de tarjeta debe tener 10 dígitos.");
    return;
  }

  const nuevaTarjeta = {
    id: `p${Date.now()}`,
    tipo: tipo,
    numero: numero,
    titular: titular,
    imagen: tipo.toLowerCase(),
    expiracion: expiracion,
    activa: true,
  };

  if (!state.usuarioActivo) {
    alert("No hay usuario activo. Inicia sesión primero.");
    return;
  }

  if (!state.usuarioActivo.metodosPago) {
    state.usuarioActivo.metodosPago = [];
  }

  state.usuarioActivo.metodosPago.push(nuevaTarjeta);

  // Actualizar el usuario dentro de state.usuarios
  const usernameActivo = state.usuarioActivo.username;
  Object.keys(state.usuarios).forEach((key) => {
    if (state.usuarios[key].username === usernameActivo) {
      state.usuarios[key].metodosPago = state.usuarioActivo.metodosPago;
    }
  });

  formTarjeta.reset();
  renderizarTarjetas();

  console.log("✅ Tarjeta guardada:", state.usuarioActivo.metodosPago);
});
/* ======================================== */
/*Guarddar Paypal cuando se ingresa  */
/* ======================================== */ const guardarPaypal =
  document.getElementById("guardar-paypal");

guardarPaypal.addEventListener("click", (e) => {
  e.preventDefault();

  const titular = document.getElementById("titular-paypal").value.trim();
  const email = document.getElementById("email-paypal").value.trim();
  const confirm = document.getElementById("confirm-email-paypal").value.trim();

  // Validaciones simples
  if (!titular || !email || !confirm) {
    alert("Completa todos los campos de PayPal.");
    return;
  }

  if (email !== confirm) {
    alert("Los correos no coinciden.");
    return;
  }

  // Crear objeto PayPal
  const nuevoPaypal = {
    id: `p${Date.now()}`,
    tipo: "paypal",
    titular,
    numero: email,
    imagen: "paypal",
    expiracion: "N/A",
    activa: true,
  };

  if (!state.usuarioActivo) {
    alert("No hay usuario activo. Inicia sesión primero.");
    return;
  }

  // Inicializar métodos de pago si no existen
  if (!state.usuarioActivo.metodosPago) {
    state.usuarioActivo.metodosPago = [];
  }

  state.usuarioActivo.metodosPago.push(nuevoPaypal);

  // Actualizar también en state.usuarios
  const username = state.usuarioActivo.username;
  Object.values(state.usuarios).forEach((usuario) => {
    if (usuario.username === username) {
      usuario.metodosPago = state.usuarioActivo.metodosPago;
    }
  });

  formPaypal.reset();
  renderizarTarjetas();

  console.log("✅ PayPal guardado correctamente:", nuevoPaypal);
});
//
// Mover elemento de búsqueda según el tamaño de pantalla

function moverBuscar() {
  const width = window.innerWidth;
  //Esta aqui xq necesita mover segun el width para poder que sirva

  const containerInput = document.querySelector(".container-input");
  const buscarContainer = document.querySelector(".buscar-container");
  const buscarWrapper = document.querySelector(".buscar-wrapper");
  const buscarInput = document.getElementById("buscar-input");
  const buscarInputContainer = document.querySelector(".buscar-input-btn");
  const btnBuscarContainer = document.querySelector(".buscar-btn-container");

  if (width >= 768) {
    containerInput.append(buscarWrapper);
    buscarWrapper.append(buscarInput, buscarInputContainer);
    btnBuscarContainer.style.display = "none";

    renderMiniModalCarrito();
    actualizarContadorCarrito();
  } else {
    containerInput.append(buscarContainer);
    buscarContainer.append(buscarWrapper);
    buscarWrapper.append(buscarInput, buscarInputContainer);
    btnBuscarContainer.style.display = "block";
  }
}
// function MENÚ CATEGORÍAS
function moverBtnCategorias() {
  const btnContainer = document.querySelector(".menu-btn-container");
  const categoriasContainer = document.querySelector(
    ".menu-categorias-container",
  );

  if (width >= 768) {
    header.appendChild(btnContainer);

    //
  } else {
    categoriasContainer.appendChild(btnContainer);
  }
}
moverBtnCategorias();
//
//escuchar el Cambio de Tamaño de la Pantalla
export function renderPrincipalResize() {
  moverBtnCategorias();
  sincronizarContenedorVacio();
  moverBuscar();

  const facturaModal = document.querySelector(".facturas-modal");
  /*
  if (facturaModal?.classList.contains("activado")) {
    facturaModal.style.padding = width >= 344 ? "24px" : "0px";
  }*/
  if (window.innerWidth <= 366) {
    document
      .querySelectorAll(".fecha-expiracion-container label")
      .forEach((label) => {
        label.style.fontSize = "0.85em";
      });
  }

  if (width >= 768) {
    // ====================== DESKTOP ======================
    if (loginContainer.classList.contains("activado")) {
      contenedoresPerfil.forEach((c) => {
        if (c.classList.contains("activado")) {
          imgVolver.classList.remove("activado");
          body.style.overflowY = "hidden";
        }
      });
      //
      if (
        contenedoresPerfil.length > 0 &&
        btnsPerfil.length > 0 &&
        !Array.from(btnsPerfil).some((btn) =>
          btn.classList.contains("activado"),
        )
      ) {
        btnActivoFijo.classList.add("activado");
        editarPerfil.classList.add("activado");
      }
    }
  } else {
    // ====================== MOBILE ======================
    contenedoresPerfil.forEach((c) => {
      if (c.classList.contains("activado")) {
        imgVolver.classList.add("activado");
        body.style.overflowY = "hidden";
      }
    });

    if (!editarPerfil.classList.contains("activado")) {
      btnActivoFijo.classList.remove("activado");
    }

    if (menuCategorias.classList.contains("activado")) {
      loginContainer.classList.remove("activado");
    }
  }
  //
  if (
    !menuCategorias ||
    !containers ||
    !buscarContainer ||
    !loginContainer ||
    !favoritosContainer ||
    !carritoContainer
  ) {
    return;
  }
  const algunContainerActivo = Array.from(containers).some((c) =>
    c.classList.contains("activado"),
  );

  const algunoActivo =
    algunContainerActivo ||
    menuCategorias?.classList.contains("activado") ||
    buscarContainer?.classList.contains("activado") ||
    loginContainer?.classList.contains("activado") ||
    favoritosContainer?.classList.contains("activado") ||
    carritoContainer?.classList.contains("activado");

  if (!algunoActivo) document.body.style.overflowY = "";
}
renderPrincipalResize();
window.addEventListener("resize", renderPrincipalResize);

//
export function calcularAnchoCapaLateral(wrapperElement) {
  if (!wrapperElement) {
    console.error("Elemento wrapper no proporcionado");
    return { capaWidth: 0, windowWidth: 0, wrapperWidth: 0 };
  }

  const wrapperRect = wrapperElement.getBoundingClientRect();
  const wrapperWidth = wrapperRect.width;
  const windowWidth = window.innerWidth;
  const capaWidth = windowWidth - wrapperWidth;

  return {
    capaWidth,
    windowWidth,
    wrapperWidth,
  };
}
//Render Productos Filtrados
export function renderProductosFiltrados(valorBusqueda) {
  const contenedor = document.getElementById("contenedor-productos-filtrados");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (!valorBusqueda) {
    return;
  }

  const termino = valorBusqueda.toLowerCase().trim();

  let resultados = [];
  let buscarMujeres = true;
  let buscarHombres = true;

  // Detectar género
  if (termino.includes("mujer") || termino.includes("mujeres")) {
    buscarHombres = false;
  } else if (
    termino.includes("hombre") ||
    termino.includes("hombres") ||
    termino.includes("caballero")
  ) {
    buscarMujeres = false;
  }

  // Función auxiliar para buscar
  const buscarEnCatalogo = (catalogo) => {
    Object.keys(catalogo).forEach((categoria) => {
      const productos = catalogo[categoria];

      // Buscar por nombre de categoría
      if (categoria.toLowerCase().includes(termino)) {
        resultados = resultados.concat(productos);
        return;
      }

      // Buscar dentro de productos (alt y descripcion)
      const encontrados = productos.filter((producto) => {
        const altMatch =
          producto.alt && producto.alt.toLowerCase().includes(termino);
        const descMatch =
          producto.descripcion &&
          producto.descripcion.toLowerCase().includes(termino);
        return altMatch || descMatch;
      });

      if (encontrados.length > 0) {
        resultados = resultados.concat(encontrados);
      }
    });
  };

  if (buscarMujeres) buscarEnCatalogo(dataMujeres);
  if (buscarHombres) buscarEnCatalogo(dataHombres);

  // === RENDERIZAR ===
  if (resultados.length === 0) {
    contenedor.innerHTML = `<p>No se encontraron productos para "${valorBusqueda}"</p>`;
    return;
  }

  const template = document.getElementById("producto-filtrado-template");

  resultados.forEach((producto) => {
    const clone = template.content.cloneNode(true);

    // Imagen
    const img = clone.querySelector(".producto-filtrado-img");
    img.src = producto.src;
    img.alt = producto.alt;

    // Título
    const titulo = clone.querySelector(".producto-filtrado-titulo");
    titulo.textContent = producto.alt.toUpperCase();

    // Descripción
    const descripcion = clone.querySelector(".producto-filtrado-descripcion");
    descripcion.textContent = producto.descripcion;

    // Precio
    const precio = clone.querySelector(".producto-filtrado-precio");
    precio.textContent = `$${producto.precio.toFixed(2)}`;
    //

    const card = clone.querySelector(".producto-filtrado-card");
    // Actualiza el evento click dentro de renderProductosFiltrados
    card.addEventListener("click", () => {
      irAlProducto(producto);
    });
    //
    contenedor.appendChild(clone);
  });
}

//Ir Al Producto Seleccionado
export function irAlProducto(producto) {
  console.log("Este es el Producto:", producto);

  const idBuscado = producto.id;

  const imgPrincipal = document.querySelector(
    `.imgZoom[data-id-producto="${idBuscado}"]`,
  );

  if (imgPrincipal) {
    const productoItem = imgPrincipal.closest(".productoItem");

    const gridAbuelo = imgPrincipal.closest(
      ".vestidos-grid, .blusas-grid, .pantalones-mujer-grid, .faldas-grid, .conjuntos-mujer-grid, .accesorios-mujer-grid, " +
        ".camisas-grid, .pantalones-hombre-grid, .gorras-grid, .zapatos-grid, .conjuntos-hombre-grid, .accesorios-hombre-grid",
    );

    const seccionContainer = imgPrincipal.closest(
      ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, " +
        ".camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
    );

    console.log("Producto Item:", productoItem);
    console.log("Grid Abuelo:", gridAbuelo?.className);
    console.log("Sección Container:", seccionContainer?.className);

    if (seccionContainer) {
      seccionContainer.classList.add("activado");
      seccionContainer.style.zIndex = "9";

      const inputBuscar = document.getElementById("inputBuscar");
      const contenedor = document.getElementById(
        "contenedor-productos-filtrados",
      );

      if (inputBuscar) inputBuscar.value = "";
      if (contenedor) contenedor.innerHTML = "";

      if (typeof buscarContainer !== "undefined") {
        buscarContainer.classList.remove("activado");
      }

      console.log(
        "✅ Se añadió 'activado' a la sección:",
        seccionContainer.className,
      );
    }

    if (productoItem) {
      productoItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      productoItem.style.transition = "all 0.4s ease";
      productoItem.style.boxShadow = "0 0 0 6px #ff4757";
      productoItem.style.transform = "scale(1.04)";

      setTimeout(() => {
        productoItem.style.boxShadow = "";
        productoItem.style.transform = "";
      }, 3000);
    }
  } else {
    console.log("❌ No se encontró el producto con ID:", idBuscado);
  }
}
/* =================================
    Slider Funcion
   ================================*/
export function irAlProductoSlider(event) {
  console.log("🎯 irAlProductoSlider ejecutada");

  const idBuscado = event.currentTarget.dataset.idProducto;
  console.log("ID del producto desde slider:", idBuscado);

  if (!idBuscado) {
    console.log("❌ No se encontró data-id-producto");
    return;
  }

  // Buscar la imagen principal
  const imgPrincipal = document.querySelector(
    `.imgZoom[data-id-producto="${idBuscado}"]`,
  );

  if (!imgPrincipal) {
    console.log("❌ No se encontró .imgZoom con ID:", idBuscado);
    return;
  }

  const productoItem = imgPrincipal.closest(".productoItem");

  const gridAbuelo = imgPrincipal.closest(
    ".vestidos-grid, .blusas-grid, .pantalones-mujer-grid, .faldas-grid, .conjuntos-mujer-grid, .accesorios-mujer-grid, " +
      ".camisas-grid, .pantalones-hombre-grid, .gorras-grid, .zapatos-grid, .conjuntos-hombre-grid, .accesorios-hombre-grid",
  );

  const seccionContainer = imgPrincipal.closest(
    ".vestidos-container, .blusas-container, .pantalones-mujer-container, .faldas-container, .conjuntos-mujer-container, .accesorios-mujer-container, " +
      ".camisas-container, .pantalones-hombre-container, .gorras-container, .zapatos-container, .conjuntos-hombre-container, .accesorios-hombre-container",
  );

  console.log("Producto Item:", productoItem);
  console.log("Grid Abuelo:", gridAbuelo?.className);
  console.log("Sección Container:", seccionContainer?.className);

  // === Activar sección (lo que te funciona) ===
  if (seccionContainer) {
    seccionContainer.classList.add("activado");
    seccionContainer.style.zIndex = "9";

    // Limpiar búsqueda si existe
    const inputBuscar = document.getElementById("inputBuscar");
    const contenedor = document.getElementById(
      "contenedor-productos-filtrados",
    );

    if (inputBuscar) inputBuscar.value = "";
    if (contenedor) contenedor.innerHTML = "";

    if (typeof buscarContainer !== "undefined") {
      buscarContainer.classList.remove("activado");
    }

    console.log("✅ Sección activada:", seccionContainer.className);
  }

  // === Scroll + Highlight ===
  if (productoItem) {
    productoItem.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    productoItem.style.transition = "all 0.4s ease";
    productoItem.style.boxShadow = "0 0 0 6px #ff4757";
    productoItem.style.transform = "scale(1.04)";

    setTimeout(() => {
      productoItem.style.boxShadow = "";
      productoItem.style.transform = "";
    }, 3000);

    console.log("✅ Scroll y efecto visual aplicados");
  } else {
    console.log("⚠️ No se encontró .productoItem");
  }
}
//
export {
  sincronizarContenedorVacio,
  cerrarZoom,
  detallesCompra,
  sincronizarBotonCarrito,
  renderMiniModalCarrito,
  renderFavoritos,
  renderCarrito,
  renderHistorialPedidos,
  renderEstadoTabla,
};

/*=========================== */
/*======Dashboard========= */
/*=========================== */

export function renderDashboard() {
  const dashboardBody = document.getElementById("dashboard-body");
  if (!dashboardBody) return;

  dashboardBody.innerHTML = "";

  const pedidosActivos = estadosPedidosTabla.filter(
    (pedido) => pedido.estado !== "entregado",
  );

  pedidosActivos.forEach((pedido) => {
    const tr = document.createElement("tr");

    const tdNumero = createCell(`<strong>#${pedido.numeroPedido}</strong>`);
    const tdCliente = createCell(pedido.usuario);

    // Columna Productos + Botón Ver
    const tdProductos = document.createElement("td");
    const cantidad = pedido.productos?.length || 0;

    tdProductos.innerHTML = `
      <div class="productos-resumen">
        <span class="productos-cantidad">${cantidad} producto${cantidad !== 1 ? "s" : ""}</span>
      </div>
    `;

    const btnVer = document.createElement("button");
    btnVer.textContent = " 👁️ Ver";
    btnVer.classList.add("btn-ver");
    btnVer.addEventListener("click", () => renderPedidoDetalle(pedido));
    tdProductos.appendChild(btnVer);

    const tdFecha = createCell(pedido.fecha);
    const tdTotal = createCell(
      `$${parseFloat(pedido.totalFinal || pedido.total || 0).toFixed(2)}`,
    );

    const tdEstado = createCell(`
      <span class="estado-badge estado-${pedido.estado}">
        ${pedido.estado.toUpperCase()}
      </span>
    `);

    // Columna Acciones
    const tdAcciones = document.createElement("td");
    tdAcciones.classList.add("acciones-estado");

    let botonesAccionesHTML = "";

    if (pedido.estado === "confirmado") {
      botonesAccionesHTML = `
        <button class="btn-estado btn-enviado" 
                data-estado="enviado" 
                data-id="${pedido.numeroPedido}">
          🚚 Enviar
        </button>
      `;
    } else if (pedido.estado === "enviado") {
      botonesAccionesHTML = `
        <button class="btn-estado btn-entregado" 
                data-estado="entregado" 
                data-id="${pedido.numeroPedido}">
          ✅ Entregar
        </button>
      `;
    }

    if (botonesAccionesHTML) {
      const temp = document.createElement("div");
      temp.innerHTML = botonesAccionesHTML;
      tdAcciones.appendChild(temp.firstElementChild);
    }

    tr.append(
      tdNumero,
      tdCliente,
      tdProductos,
      tdFecha,
      tdTotal,
      tdEstado,
      tdAcciones,
    );
    dashboardBody.appendChild(tr);
  });

  calcularEstadisticas();

  agregarEventosBotones();
}

// Función auxiliar
function createCell(content) {
  const td = document.createElement("td");
  td.innerHTML = content;
  return td;
}
//
function calcularEstadisticas() {
  const totalPedidos = estadosPedidosTabla.length + historialPedidos.length;
  const pedidosProceso = estadosPedidosTabla.length;

  const hoy = new Date();
  const hoyStr = hoy.toLocaleDateString("es-ES");

  //
  const calcularIngresos = (filtro) => {
    const todosLosPedidos = [...estadosPedidosTabla, ...historialPedidos];
    return todosLosPedidos
      .filter(filtro)
      .reduce((sum, p) => sum + parseFloat(p.totalFinal || p.total || 0), 0);
  };

  // Ingresos Hoy
  const ingresosHoy = calcularIngresos((p) => p.fecha === hoyStr);

  // Ingresos Semana
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - 7);
  const ingresosSemana = calcularIngresos((p) => {
    const fechaPedido = new Date(p.fecha.split("/").reverse().join("-"));
    return !isNaN(fechaPedido.getTime()) && fechaPedido >= inicioSemana;
  });

  // Ingresos Año
  const ingresosAño = calcularIngresos((p) => {
    const fechaPedido = new Date(p.fecha.split("/").reverse().join("-"));
    return (
      !isNaN(fechaPedido.getTime()) &&
      fechaPedido.getFullYear() === hoy.getFullYear()
    );
  });
  // Tasa de completados
  const tasaCompletados =
    totalPedidos > 0
      ? Math.round((historialPedidos.length / totalPedidos) * 100)
      : 0;

  // Actualizar DOM
  document.getElementById("total-pedidos").textContent = totalPedidos;
  document.getElementById("pedidos-proceso").textContent = pedidosProceso;
  document.getElementById("ingresos-hoy").textContent =
    `$${ingresosHoy.toFixed(2)}`;
  document.getElementById("ingresos-semana").textContent =
    `$${ingresosSemana.toFixed(2)}`;
  document.getElementById("ingresos-año").textContent =
    `$${ingresosAño.toFixed(2)}`;
  document.getElementById("tasa-completados").textContent =
    `${tasaCompletados}%`;
}

function cambiarEstadoPedido(numeroPedido, nuevoEstado) {
  const pedidoIndex = estadosPedidosTabla.findIndex(
    (p) => p.numeroPedido === numeroPedido,
  );
  if (pedidoIndex === -1) return;

  estadosPedidosTabla[pedidoIndex].estado = nuevoEstado;

  if (nuevoEstado === "entregado") {
    const pedido = estadosPedidosTabla[pedidoIndex];
    console.log(pedido);
    const pedidoParaHistorial = {
      ...pedido,
      fechaEntrega: new Date().toLocaleDateString(),
      productos: pedido.productos.map((item) => ({
        id: item.id,
        nombre: item.nombre || item.descripcion || item.alt,
        precio: item.precio,
        cantidad: item.cantidad,
        talla: item.talla,
        imagen: item.imagen || item.src,
        alt: item.alt,
      })),
    };

    historialPedidos.push(pedidoParaHistorial);
    estadosPedidosTabla.splice(pedidoIndex, 1);
    mostrarNotificacion(`✅ Pedido #${numeroPedido} entregado`, "success");
  } else {
    mostrarNotificacion(
      `📦 Pedido #${numeroPedido} actualizado a ${nuevoEstado}`,
      "info",
    );
  }

  console.log(
    "Aqui LOL ",
    estadosPedidosTabla,
    "y esto es Historial ",
    historialPedidos,
  );
  renderDashboard();
}
function agregarEventosBotones() {
  document.querySelectorAll(".btn-estado").forEach((btn) => {
    btn.removeEventListener("click", btn._handler);
  });

  document.querySelectorAll(".btn-estado").forEach((btn) => {
    const handler = () => {
      const numeroPedido = parseInt(btn.dataset.id);
      const nuevoEstado = btn.dataset.estado;

      if (
        confirm(
          `¿Seguro que deseas cambiar a "${getEstadoTexto(nuevoEstado)}" el pedido #${numeroPedido}?`,
        )
      ) {
        cambiarEstadoPedido(numeroPedido, nuevoEstado);
      }
    };

    btn.addEventListener("click", handler);
    btn._handler = handler;
  });
}
function mostrarNotificacion(mensaje, tipo = "info") {
  alert(mensaje);
}
function getEstadoTexto(estado) {
  switch (estado) {
    case "confirmado":
      return "Confirmado";
    case "enviado":
      return "Enviado";
    case "entregado":
      return "Entregado";
    default:
      return estado;
  }
}
//
export { populateGrid };

export async function loadProducts() {
  const CACHE_KEY = "products_cache";
  const CACHE_TIME_KEY = "products_cache_time";
  const CACHE_DURATION = 5 * 60 * 1000;

  // Revisar caché
  const cachedProducts = localStorage.getItem(CACHE_KEY);
  const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

  if (
    cachedProducts &&
    cacheTime &&
    Date.now() - Number(cacheTime) < CACHE_DURATION
  ) {
    console.log("✅ Productos cargados desde caché");

    products = JSON.parse(cachedProducts);

    procesarProductos(products);

    return products;
  }

  // Consultar API
  console.log("🔥 Consultando Firebase");

  const response = await fetch(API_URL);
  const data = await response.json();

  products = data.products || [];

  // Guardar en caché
  localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  localStorage.setItem(CACHE_TIME_KEY, Date.now());

  procesarProductos(products);

  return products;
}

function procesarProductos(products) {
  const CLOUD_NAME = "vz7kcusz";

  // Limpiar arrays para evitar duplicados
  Object.keys(dataMujeres).forEach((key) => {
    dataMujeres[key] = [];
  });

  Object.keys(dataHombres).forEach((key) => {
    dataHombres[key] = [];
  });

  products.forEach((producto) => {
    const image = producto.image;

    const item = {
      id: producto.id,
      src: image
        ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${image.publicId}.${image.format || "jpg"}`
        : "",
      alt: producto.alt || producto.descripcion || "Producto",
      descripcion: producto.descripcion,
      precio: producto.precio,
    };

    if (producto.gender === "mujer" && dataMujeres[producto.category]) {
      dataMujeres[producto.category].push(item);
    }

    if (producto.gender === "hombre" && dataHombres[producto.category]) {
      dataHombres[producto.category].push(item);
    }
  });

  console.log("Mujeres cargadas:", Object.keys(dataMujeres));
  console.log("Hombres cargadas:", Object.keys(dataHombres));
}
