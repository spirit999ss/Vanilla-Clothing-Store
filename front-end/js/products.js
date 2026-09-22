// products.js

const API_URL =
  "https://vanilla-clothing-store-backend.vercel.app/api/products-with-images";

//
export let products = [];

export let dataMujeres = {
  vestidos: [],
  blusas: [],
  pantalones: [],
  faldas: [],
  conjuntos: [],
  accesorios: [],
};

export let dataHombres = {
  camisas: [],
  pantalones: [],
  gorras: [],
  zapatos: [],
  conjuntos: [],
  accesorios: [],
};

export const categorias = {
  mujer: [
    { nombre: "Vestidos" },
    { nombre: "Blusas" },
    { nombre: "Faldas" },
    { nombre: "Pantalones" },
    { nombre: "Conjuntos" },
    { nombre: "Accesorios" },
  ],
  hombre: [
    { nombre: "Camisas" },
    { nombre: "Gorras" },
    { nombre: "Zapatos" },
    { nombre: "Pantalones" },
    { nombre: "Conjuntos" },
    { nombre: "Accesorios" },
  ],
};

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
}

export async function loadProducts() {
  const CACHE_KEY = "products_cache";
  const CACHE_TIME_KEY = "products_cache_time";

  // 1 año
  const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000;

  const cachedProducts = localStorage.getItem(CACHE_KEY);
  const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

  if (
    cachedProducts &&
    cacheTime &&
    Date.now() - Number(cacheTime) < CACHE_DURATION
  ) {
    products = JSON.parse(cachedProducts);

    procesarProductos(products);

    return products;
  }

  const response = await fetch(API_URL);
  const data = await response.json();

  products = data.products || [];

  localStorage.setItem(CACHE_KEY, JSON.stringify(products));

  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

  procesarProductos(products);

  return products;
}
