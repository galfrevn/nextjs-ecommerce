import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String },
      },
    ],
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    colors: [
      {
        name: { type: String, required: true },
        class: { type: String },
        selectedClass: { type: String },
      },
    ],
    sizes: [
      {
        name: { type: String, required: true },
        inStock: { type: Boolean, default: true },
      },
    ],
    highlights: [{ type: String }],
    details: { type: String, required: true },
    breadcrumbs: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
