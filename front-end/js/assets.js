//Img de App para funcionamiento
const CLOUD_NAME = "vz7kcusz";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// Función para obtener imagen redimensionada
export function getResizedImage(assetKey, width = null, height = null) {
  if (!assets[assetKey]) {
    console.error(`Asset "${assetKey}" no encontrado`);
    return "";
  }

  let url = assets[assetKey].src;

  if (width && height) {
    // Reemplazar la URL base con parámetros de redimensionamiento
    url = url.replace(
      CLOUDINARY_URL,
      `${CLOUDINARY_URL}/w_${width},h_${height},c_fill`,
    );
  }

  return url;
}

// Función para obtener imagen de fallback si la principal falla
export function getFallbackImage(assetKey) {
  const fallbacks = {
    brandLogo: `${CLOUDINARY_URL}/assets/branding/fallback-logo`,
    userActive: `${CLOUDINARY_URL}/assets/users/fallback-user`,
  };

  return fallbacks[assetKey] || `${CLOUDINARY_URL}/assets/system/fallback`;
}

export const assets = {
  // BRANDING
  brandLogo: {
    src: `${CLOUDINARY_URL}/assets/branding/brand-logo`,
    alt: "Logo de la tienda",
  },
  // AUTH
  apple: {
    src: `${CLOUDINARY_URL}/assets/auth/apple`,
    alt: "Iniciar sesión con Apple",
  },

  google: {
    src: `${CLOUDINARY_URL}/assets/auth/google`,
    alt: "Iniciar sesión con Google",
  },

  facebook: {
    src: `${CLOUDINARY_URL}/assets/auth/facebook`,
    alt: "Iniciar sesión con Facebook",
  },

  // USERS
  login: {
    src: `${CLOUDINARY_URL}/assets/users/login`,
    alt: "Usuario",
  },

  userAnonymous: {
    src: `${CLOUDINARY_URL}/assets/users/user-anonymous`,
    alt: "Usuario anónimo",
  },

  userActive: {
    src: `${CLOUDINARY_URL}/assets/users/user-active`,
    alt: "Usuario activo",
  },

  // NAVIGATION
  categoryMenu: {
    src: `${CLOUDINARY_URL}/assets/navigation/category-menu`,
    alt: "Menú de categorías",
  },

  search: {
    src: `${CLOUDINARY_URL}/assets/navigation/search`,
    alt: "Buscar",
  },

  left: {
    src: `${CLOUDINARY_URL}/assets/navigation/left`,
    alt: "Anterior",
  },

  right: {
    src: `${CLOUDINARY_URL}/assets/navigation/right`,
    alt: "Siguiente",
  },

  // SYSTEM
  back: {
    src: `${CLOUDINARY_URL}/assets/system/back`,
    alt: "Volver",
  },

  exit: {
    src: `${CLOUDINARY_URL}/assets/system/exit`,
    alt: "Salir",
  },

  edit: {
    src: `${CLOUDINARY_URL}/assets/system/edit`,
    alt: "Editar",
  },

  delete: {
    src: `${CLOUDINARY_URL}/assets/system/delete`,
    alt: "Eliminar",
  },

  // CART
  cart: {
    src: `${CLOUDINARY_URL}/assets/ecommerce/cart/cart`,
    alt: "Carrito",
  },

  // WISHLIST
  wishlistFilled: {
    src: `${CLOUDINARY_URL}/assets/ecommerce/wishlist/wishlist-filled`,
    alt: "Favorito seleccionado",
  },

  wishlistOutline: {
    src: `${CLOUDINARY_URL}/assets/ecommerce/wishlist/wishlist-outline`,
    alt: "Favorito",
  },

  wishlistContainer: {
    src: `${CLOUDINARY_URL}/assets/ecommerce/wishlist/wishlist-container`,
    alt: "Lista de favoritos",
  },

  // CHECKOUT
  visa: {
    src: `${CLOUDINARY_URL}/assets/checkout/visa`,
    alt: "Visa",
  },

  mastercard: {
    src: `${CLOUDINARY_URL}/assets/checkout/mastercard`,
    alt: "Mastercard",
  },

  paypal: {
    src: `${CLOUDINARY_URL}/assets/checkout/paypal`,
    alt: "PayPal",
  },

  cardInput: {
    src: `${CLOUDINARY_URL}/assets/checkout/card-input`,
    alt: "Número de tarjeta",
  },

  cardAnonymous: {
    src: `${CLOUDINARY_URL}/assets/checkout/card-anonymous`,
    alt: "Tarjeta",
  },

  cvcAnonymous: {
    src: `${CLOUDINARY_URL}/assets/checkout/cvc-anonymous`,
    alt: "Código CVC",
  },

  expiryAnonymous: {
    src: `${CLOUDINARY_URL}/assets/checkout/expiry-anonymous`,
    alt: "Fecha de expiración",
  },
  productNotFound: {
    src: `${CLOUDINARY_URL}/assets/not-found/product-not-found`,
    alt: "Producto no encontrado",
  },
};
