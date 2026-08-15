const Inventory = require("../models/Inventory");

// @desc    Get all inventory items
// @route   GET /api/admin/inventory
exports.getInventory = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Inventory.find(filter).sort({ category: 1, itemName: 1 });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory item
// @route   POST /api/admin/inventory
exports.createInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item (general fields)
// @route   PUT /api/admin/inventory/:id
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Increase stock
// @route   PATCH /api/admin/inventory/:id/increase
exports.increaseStock = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }
    item.stock += Number(amount) || 0;
    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Decrease stock
// @route   PATCH /api/admin/inventory/:id/decrease
exports.decreaseStock = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }
    item.stock = Math.max(0, item.stock - (Number(amount) || 0));
    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/admin/inventory/:id
exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }
    await item.deleteOne();
    res.json({ success: true, message: "Inventory item deleted" });
  } catch (error) {
    next(error);
  }
};
