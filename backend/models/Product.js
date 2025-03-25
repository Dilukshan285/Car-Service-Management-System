import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ['Brakes', 'Lighting', 'Engine', 'Wheels'] },
    stock: { type: Number, required: true, min: 0 },
    seller: { type: String, required: true, trim: true },
    images: { type: String, trim: true }, // Single string for one Base64 image
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);