import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import admin from "firebase-admin";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());

// =====================================================
// Cloudinary config
// =====================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// =====================================================
// Firebase Admin config
// =====================================================

const firebaseServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});

const db = admin.firestore();

// =====================================================
// Helpers de Cloudinary
// =====================================================

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

function getCloudinaryImageUrl(image, options = {}) {
  const {
    width = 300,
    height = 300,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  if (!image || !image.publicId) {
    return null;
  }

  const transformation = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
  const version = image.version ? `/v${image.version}` : "";

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformation}${version}/${image.publicId}`;
}

function getCloudinaryOriginalUrl(image) {
  if (!image || !image.publicId) {
    return null;
  }

  const version = image.version ? `/v${image.version}` : "";
  const format = image.format ? `.${image.format}` : "";

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload${version}/${image.publicId}${format}`;
}

// =====================================================
// Helpers de migración
// =====================================================

const imageManualMap = {};

function removeExtension(value = "") {
  return value.replace(/\.[a-z0-9]+$/i, "");
}

function removeCloudinarySuffix(value = "") {
  return value.replace(/[_-][a-z0-9]{5,}$/i, "");
}

function getFileNameFromPathOrUrl(value = "") {
  if (!value) return "";

  try {
    const cleanValue = value.split("?")[0];
    const parts = cleanValue.split("/");
    const lastPart = parts[parts.length - 1] || "";
    return removeExtension(lastPart);
  } catch {
    return "";
  }
}

function getBaseNameFromPublicId(publicId = "") {
  const parts = publicId.split("/");
  const lastPart = parts[parts.length - 1] || "";
  return removeExtension(lastPart);
}

function normalizeImageKey(value = "") {
  return value
    .toString()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-][a-z0-9]{5,}$/i, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function getExpectedKeyFromProduct(product) {
  if (product.imageUrl) {
    const fileName = getFileNameFromPathOrUrl(product.imageUrl);
    const key = normalizeImageKey(fileName);

    if (key) return key;
  }

  if (product.src) {
    const fileName = getFileNameFromPathOrUrl(product.src);
    const key = normalizeImageKey(fileName);

    if (key) return key;
  }

  if (product.alt) {
    const key = normalizeImageKey(product.alt);

    if (key) return key;
  }

  return "";
}

function getCloudinaryKey(cloudinaryImage) {
  const baseName = getBaseNameFromPublicId(cloudinaryImage.public_id);
  const withoutSuffix = removeCloudinarySuffix(baseName);

  return normalizeImageKey(withoutSuffix);
}

function buildCloudinaryImageData(cloudinaryImage, product) {
  return {
    publicId: cloudinaryImage.public_id,
    version: cloudinaryImage.version,
    format: cloudinaryImage.format,
    alt: product.alt || product.name || cloudinaryImage.public_id,
    width: cloudinaryImage.width || null,
    height: cloudinaryImage.height || null,
    bytes: cloudinaryImage.bytes || null,
  };
}

async function getAllCloudinaryImages() {
  let nextCursor = undefined;
  const allImages = [];

  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      max_results: 500,
      next_cursor: nextCursor,
    });

    allImages.push(...result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return allImages;
}

function findManualMapImage(productDocId, cloudinaryImages) {
  const manualPublicId = imageManualMap[productDocId];

  if (!manualPublicId) return null;

  return (
    cloudinaryImages.find((img) => img.public_id === manualPublicId) || null
  );
}

function autoResolveDuplicateByProductId(productDocId, candidates) {
  if (!candidates || candidates.length === 0) return null;

  const sortedCandidates = [...candidates].sort((a, b) => {
    return a.version - b.version;
  });

  if (productDocId.startsWith("HOM-")) {
    return sortedCandidates[sortedCandidates.length - 1];
  }

  if (productDocId.startsWith("MUJ-")) {
    return sortedCandidates[0];
  }

  return null;
}

function findBestCloudinaryMatch(
  productDocId,
  product,
  cloudinaryImages,
  options = {},
) {
  const { autoResolveDuplicates = false } = options;

  const manualImage = findManualMapImage(productDocId, cloudinaryImages);

  if (manualImage) {
    return {
      status: "matched",
      mode: "manual_map",
      image: manualImage,
      candidates: [manualImage],
      expectedKey: getExpectedKeyFromProduct(product),
    };
  }

  const expectedKey = getExpectedKeyFromProduct(product);

  if (!expectedKey) {
    return {
      status: "not_found",
      reason: "no_expected_key",
      image: null,
      candidates: [],
      expectedKey,
    };
  }

  const exactCandidates = cloudinaryImages.filter((img) => {
    const cloudinaryKey = getCloudinaryKey(img);
    return cloudinaryKey === expectedKey;
  });

  if (exactCandidates.length === 1) {
    return {
      status: "matched",
      mode: "exact_base_name",
      image: exactCandidates[0],
      candidates: exactCandidates,
      expectedKey,
    };
  }

  if (exactCandidates.length > 1) {
    if (autoResolveDuplicates) {
      const resolvedImage = autoResolveDuplicateByProductId(
        productDocId,
        exactCandidates,
      );

      if (resolvedImage) {
        return {
          status: "matched",
          mode: "auto_resolved_duplicate_by_product_id",
          image: resolvedImage,
          candidates: exactCandidates,
          expectedKey,
        };
      }
    }

    return {
      status: "multiple_exact_candidates",
      reason: "same_base_name_more_than_once",
      image: null,
      candidates: exactCandidates,
      expectedKey,
    };
  }

  return {
    status: "not_found",
    reason: "no_exact_match",
    image: null,
    candidates: [],
    expectedKey,
  };
}

// =====================================================
// Routes básicas
// =====================================================

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// =====================================================
// Ver imágenes directamente desde Cloudinary
// =====================================================

app.get("/api/images", async (req, res) => {
  try {
    const images = await getAllCloudinaryImages();

    res.json({
      success: true,
      total: images.length,
      images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =====================================================
// Verificar Firebase
// =====================================================

app.get("/api/check-firebase", async (req, res) => {
  try {
    const snapshot = await db.collection("products").limit(10).get();

    const sample = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      totalSample: sample.length,
      sample,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =====================================================
// Productos desde Firestore con URLs generadas
// =====================================================

app.get("/api/products-with-images", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map((doc) => {
      const product = doc.data();

      const thumbnailUrl = getCloudinaryImageUrl(product.image, {
        width: 300,
        height: 300,
      });

      const cardUrl = getCloudinaryImageUrl(product.image, {
        width: 500,
        height: 500,
      });

      const largeUrl = getCloudinaryImageUrl(product.image, {
        width: 900,
        height: 900,
      });

      const originalUrl = getCloudinaryOriginalUrl(product.image);

      return {
        firestoreId: doc.id,
        id: product.id || doc.id,
        name: product.name || "",
        descripcion: product.descripcion || "",
        gender: product.gender || "",
        category: product.category || "",
        precio: product.precio || null,
        alt: product.image?.alt || product.alt || product.name || "",
        image: product.image || null,
        urls: {
          thumbnailUrl,
          cardUrl,
          largeUrl,
          originalUrl,
        },
      };
    });

    res.json({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =====================================================
// Lista de URLs lista para copiar
// =====================================================

app.get("/api/image-urls", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const urls = snapshot.docs.map((doc) => {
      const product = doc.data();

      return {
        productId: doc.id,
        name: product.name || "",
        gender: product.gender || "",
        category: product.category || "",
        publicId: product.image?.publicId || null,
        thumbnailUrl: getCloudinaryImageUrl(product.image, {
          width: 300,
          height: 300,
        }),
        cardUrl: getCloudinaryImageUrl(product.image, {
          width: 500,
          height: 500,
        }),
        largeUrl: getCloudinaryImageUrl(product.image, {
          width: 900,
          height: 900,
        }),
        originalUrl: getCloudinaryOriginalUrl(product.image),
      };
    });

    res.json({
      success: true,
      total: urls.length,
      urls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =====================================================
// Lista simple de URLs en texto plano
// =====================================================

app.get("/api/image-urls-text", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const text = snapshot.docs
      .map((doc) => {
        const product = doc.data();

        const cardUrl = getCloudinaryImageUrl(product.image, {
          width: 500,
          height: 500,
        });

        return `${doc.id} - ${cardUrl}`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(text);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// =====================================================
// Revisar múltiples pendientes
// =====================================================

app.get("/api/multiple-candidates", async (req, res) => {
  try {
    const autoResolveDuplicates = req.query.autoResolveDuplicates === "true";

    const cloudinaryImages = await getAllCloudinaryImages();
    const productsSnapshot = await db.collection("products").get();

    const multiples = [];
    const autoResolved = [];

    for (const productDoc of productsSnapshot.docs) {
      const product = productDoc.data();

      if (product.image?.publicId) continue;

      const match = findBestCloudinaryMatch(
        productDoc.id,
        product,
        cloudinaryImages,
        { autoResolveDuplicates },
      );

      if (match.status === "multiple_exact_candidates") {
        multiples.push({
          productId: productDoc.id,
          expectedKey: match.expectedKey,
          oldImageUrl: product.imageUrl || null,
          name: product.name || null,
          alt: product.alt || null,
          candidates: match.candidates.map((img) => ({
            publicId: img.public_id,
            version: img.version,
            format: img.format,
            secureUrl: img.secure_url,
          })),
        });
      }

      if (
        match.status === "matched" &&
        match.mode === "auto_resolved_duplicate_by_product_id"
      ) {
        autoResolved.push({
          productId: productDoc.id,
          expectedKey: match.expectedKey,
          image: {
            publicId: match.image.public_id,
            version: match.image.version,
            format: match.image.format,
            secureUrl: match.image.secure_url,
          },
          candidates: match.candidates.map((img) => ({
            publicId: img.public_id,
            version: img.version,
            format: img.format,
            secureUrl: img.secure_url,
          })),
        });
      }
    }

    res.json({
      success: true,
      autoResolveDuplicates,
      totalMultiples: multiples.length,
      totalAutoResolved: autoResolved.length,
      multiples,
      autoResolved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =====================================================
// Migración
// =====================================================

app.post("/api/migrate-image-urls", async (req, res) => {
  const dryRun = req.query.dryRun !== "false";
  const removeImageUrl = req.query.removeImageUrl !== "false";
  const force = req.query.force === "true";
  const autoResolveDuplicates = req.query.autoResolveDuplicates === "true";

  try {
    const cloudinaryImages = await getAllCloudinaryImages();
    const productsSnapshot = await db.collection("products").get();

    let matched = 0;
    let updated = 0;
    let multiple = 0;
    let notFound = 0;
    let skipped = 0;

    const report = [];

    let batch = db.batch();
    let batchCount = 0;

    for (const productDoc of productsSnapshot.docs) {
      const product = productDoc.data();
      const productDocId = productDoc.id;

      if (product.image?.publicId && !force) {
        skipped++;

        report.push({
          productId: productDocId,
          status: "skipped_already_has_image",
          publicId: product.image.publicId,
        });

        continue;
      }

      const match = findBestCloudinaryMatch(
        productDocId,
        product,
        cloudinaryImages,
        { autoResolveDuplicates },
      );

      if (match.status === "matched") {
        matched++;

        const imageData = buildCloudinaryImageData(match.image, product);

        const updateData = {
          image: imageData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (removeImageUrl) {
          updateData.imageUrl = admin.firestore.FieldValue.delete();
        }

        report.push({
          productId: productDocId,
          status: "matched",
          mode: match.mode,
          expectedKey: match.expectedKey,
          oldImageUrl: product.imageUrl || null,
          image: imageData,
        });

        if (!dryRun) {
          batch.update(productDoc.ref, updateData);
          batchCount++;
          updated++;

          if (batchCount >= 450) {
            await batch.commit();
            batch = db.batch();
            batchCount = 0;
          }
        }

        continue;
      }

      if (match.status === "multiple_exact_candidates") {
        multiple++;

        report.push({
          productId: productDocId,
          status: "multiple_exact_candidates",
          reason: match.reason,
          expectedKey: match.expectedKey,
          oldImageUrl: product.imageUrl || null,
          name: product.name || null,
          alt: product.alt || null,
          candidates: match.candidates.map((img) => ({
            publicId: img.public_id,
            version: img.version,
            format: img.format,
            secureUrl: img.secure_url,
          })),
        });

        continue;
      }

      if (match.status === "not_found") {
        notFound++;

        report.push({
          productId: productDocId,
          status: "not_found",
          reason: match.reason,
          expectedKey: match.expectedKey,
          oldImageUrl: product.imageUrl || null,
          name: product.name || null,
          alt: product.alt || null,
        });

        continue;
      }
    }

    if (!dryRun && batchCount > 0) {
      await batch.commit();
    }

    res.json({
      success: true,
      dryRun,
      removeImageUrl,
      force,
      autoResolveDuplicates,
      summary: {
        totalProducts: productsSnapshot.size,
        cloudinaryImages: cloudinaryImages.length,
        matched,
        updated: dryRun ? 0 : updated,
        skipped,
        multiple,
        notFound,
      },
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =====================================================
// Server listen
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT);
