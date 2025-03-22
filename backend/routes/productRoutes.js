import express from 'express';
import { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controller/productController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memoryStorage for Base64 conversion
const upload = multer({ storage: storage });

const router = express.Router();

// Routes
router.post('/products', upload.single('productImages'), addProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.single('productImages'), updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;