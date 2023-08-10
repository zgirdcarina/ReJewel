// Product Model holds all the products available in the virtual jewelry store.
// Admin users will be able to do all the CRUD operations on this model.
// Ordinary users (Buyers) can only read it.
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema(
  {
    jewleryClass: { type: String, required: true},
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    designer: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: false },
    numReviews: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model('Product', productSchema);

export default Product;
