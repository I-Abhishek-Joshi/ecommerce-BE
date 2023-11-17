const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: [ String ] },
    category: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    productId: { type: String, default: "1234" },
    quantity: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
