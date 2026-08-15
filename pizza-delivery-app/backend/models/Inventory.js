const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Base", "Sauce", "Cheese", "Vegetable"],
      required: true,
    },
    price: { type: Number, default: 0 }, // extra price if selected in custom builder
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, default: "units" },
    lowStockThreshold: { type: Number, default: 10 },
    lastLowStockAlertSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

inventorySchema.methods.isLowStock = function () {
  return this.stock <= this.lowStockThreshold;
};

module.exports = mongoose.model("Inventory", inventorySchema);
