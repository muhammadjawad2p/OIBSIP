const Pizza = require("../models/Pizza");
const Inventory = require("../models/Inventory");

// @desc    Get all pizzas (with optional category filter/search)
// @route   GET /api/pizzas
exports.getPizzas = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: pizzas.length, pizzas });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pizza details
// @route   GET /api/pizzas/:id
exports.getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }
    res.json({ success: true, pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customization options for the pizza builder (bases, sauces, cheese, veggies)
// @route   GET /api/pizzas/builder/options
exports.getBuilderOptions = async (req, res, next) => {
  try {
    const items = await Inventory.find({ stock: { $gt: 0 } });
    const grouped = {
      bases: items.filter((i) => i.category === "Base"),
      sauces: items.filter((i) => i.category === "Sauce"),
      cheese: items.filter((i) => i.category === "Cheese"),
      vegetables: items.filter((i) => i.category === "Vegetable"),
    };
    res.json({ success: true, options: grouped });
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

// @desc    Create pizza
// @route   POST /api/admin/pizzas
exports.createPizza = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, isCustomizable } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const pizza = await Pizza.create({
      name,
      description,
      category,
      basePrice: typeof basePrice === "string" ? JSON.parse(basePrice) : basePrice,
      isCustomizable,
      image,
    });

    res.status(201).json({ success: true, pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pizza
// @route   PUT /api/admin/pizzas/:id
exports.updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }

    const updates = { ...req.body };
    if (updates.basePrice && typeof updates.basePrice === "string") {
      updates.basePrice = JSON.parse(updates.basePrice);
    }
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    Object.assign(pizza, updates);
    await pizza.save();

    res.json({ success: true, pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pizza
// @route   DELETE /api/admin/pizzas/:id
exports.deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }
    await pizza.deleteOne();
    res.json({ success: true, message: "Pizza deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pizzas for admin (including unavailable)
// @route   GET /api/admin/pizzas
exports.getAllPizzasAdmin = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find().sort({ createdAt: -1 });
    res.json({ success: true, count: pizzas.length, pizzas });
  } catch (error) {
    next(error);
  }
};
