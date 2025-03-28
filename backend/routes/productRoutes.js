// In your router file (routes/productRoutes.js)
import express from 'express';
import { 
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,       // Add this
} from '../controller/productController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import verifyToken from "../middleware/verifyToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/products", upload.single("productImages"), addProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", upload.single("productImages"), updateProduct);
router.delete("/products/:id", deleteProduct);
router.post("/cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);
router.put("/cart/update", verifyToken, updateCartItem);
router.delete("/cart/remove", verifyToken, removeCartItem);

export default router;