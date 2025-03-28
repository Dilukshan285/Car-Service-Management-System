import Product from '../models/Product.js';
import sharp from 'sharp';
import User from '../models/Usermodel.js';

// Add new product
export const addProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file); // File from router's upload.single('productImages')

    const {
      productName,
      description,
      price,
      category,
      stockQuantity,
      sellerName
    } = req.body;

    // Validate required fields
    if (!productName || !price || !category || !stockQuantity || !sellerName) {
      console.log('Missing fields:', { productName, price, category, stockQuantity, sellerName });
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Convert price and stockQuantity to numbers and validate
    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stockQuantity, 10);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity must be a valid positive integer'
      });
    }

    // Handle product image
    const defaultImageURL =
      'https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180';
    let imageBase64;

    if (req.file) {
      try {
        const compressedImageBuffer = await sharp(req.file.buffer)
          .resize(300, 300)
          .jpeg({ quality: 80 })
          .toBuffer();
        imageBase64 = `data:${req.file.mimetype};base64,${compressedImageBuffer.toString('base64')}`;
      } catch (imageError) {
        console.error('Error compressing image:', imageError);
        return res.status(500).json({
          success: false,
          message: 'Image processing error'
        });
      }
    } else {
      imageBase64 = defaultImageURL;
    }

    const newProduct = new Product({
      name: productName,
      description: description || '',
      price: numericPrice,
      category,
      stock: numericStock,
      seller: sellerName,
      images: imageBase64
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('Error adding product:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Placeholder functions (implement as needed)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      category,
      stockQuantity,
      sellerName
    } = req.body;

    const numericPrice = price ? parseFloat(price) : undefined;
    const numericStock = stockQuantity ? parseInt(stockQuantity, 10) : undefined;

    if (numericPrice !== undefined && (isNaN(numericPrice) || numericPrice < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    if (numericStock !== undefined && (isNaN(numericStock) || numericStock < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity must be a valid positive integer'
      });
    }

    const defaultImageURL = 'https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180';
    let imageBase64;

    if (req.file) {
      const compressedImageBuffer = await sharp(req.file.buffer)
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toBuffer();
      imageBase64 = `data:${req.file.mimetype};base64,${compressedImageBuffer.toString('base64')}`;
    }

    const updateData = {
      ...(productName && { name: productName }),
      ...(description !== undefined && { description }),
      ...(numericPrice !== undefined && { price: numericPrice }),
      ...(category && { category }),
      ...(numericStock !== undefined && { stock: numericStock }),
      ...(sellerName && { seller: sellerName }),
      ...(imageBase64 && { images: imageBase64 })
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Convert cartData to Map if it's not already
    if (!(user.cartData instanceof Map)) {
      user.cartData = new Map(Object.entries(user.cartData || {}));
    }

    const currentQuantity = user.cartData.get(productId) || 0;
    user.cartData.set(productId, currentQuantity + quantity);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: Object.fromEntries(user.cartData)
    });
  } catch (error) {
    console.error("Error adding to cart:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = user.cartData instanceof Map 
      ? Object.fromEntries(user.cartData) 
      : user.cartData || {};

    const cartItems = await Promise.all(
      Object.entries(cartData).map(async ([productId, quantity]) => {
        const product = await Product.findById(productId);
        return {
          productId,
          quantity,
          product: product
            ? {
                name: product.name,
                price: product.price,
                images: product.images,
                stock: product.stock,
              }
            : null,
        };
      })
    );

    const validCartItems = cartItems.filter((item) => item.product !== null);

    res.status(200).json({
      success: true,
      data: {
        cartItems: validCartItems,
        totalItems: validCartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: validCartItems.reduce(
          (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
          0
        ),
      },
    });
  } catch (error) {
    console.error("Error getting cart:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!(user.cartData instanceof Map)) {
      user.cartData = new Map(Object.entries(user.cartData || {}));
    }

    if (!user.cartData.has(productId)) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      user.cartData.delete(productId);
    } else {
      user.cartData.set(productId, quantity);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: Object.fromEntries(user.cartData)
    });
  } catch (error) {
    console.error("Error updating cart:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!(user.cartData instanceof Map)) {
      user.cartData = new Map(Object.entries(user.cartData || {}));
    }

    if (!user.cartData.has(productId)) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    user.cartData.delete(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: Object.fromEntries(user.cartData)
    });
  } catch (error) {
    console.error("Error removing item from cart:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};