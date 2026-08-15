const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Veg", "Non-Veg", "Custom"],
      default: "Veg",
    },
    basePrice: {
      small: { type: Number, required: true },
      medium: { type: Number, required: true },
      large: { type: Number, required: true },
    },
    isCustomizable: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pizza", pizzaSchema);
