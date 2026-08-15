const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const { calculateOrderTotals } = require("../utils/pricing");
const { emitOrderStatusUpdate, emitNewOrder } = require("../services/socketService");
const { sendLowStockEmail } = require("../utils/sendEmail");

// Deduct stock for custom pizza ingredients used in an order's items.
// Silently skips items with no customization (pre-made menu pizzas don't track ingredient-level stock).
const deductInventoryForItems = async (items) => {
  for (const item of items) {
    const c = item.customization;
    if (!c) continue;
    const names = [c.base, c.sauce, c.cheese, ...(c.vegetables || [])].filter(Boolean);
    for (const name of names) {
      const invItem = await Inventory.findOne({ itemName: name });
      if (!invItem) continue;
      invItem.stock = Math.max(0, invItem.stock - item.quantity);
      await invItem.save();

      if (invItem.isLowStock()) {
        try {
          await sendLowStockEmail(process.env.ADMIN_EMAIL, invItem.itemName, invItem.stock);
        } catch (e) {
          console.error("Low stock email failed:", e.message);
        }
      }
    }
  }
};

// @desc    Create order (called after successful payment, or as pending order)
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    const itemsWithSubtotal = items.map((item) => ({
      ...item,
      subtotal: item.unitPrice * item.quantity,
    }));

    const totals = calculateOrderTotals(itemsWithSubtotal, couponCode);

    const order = await Order.create({
      user: req.user._id,
      items: itemsWithSubtotal,
      deliveryAddress,
      couponCode: couponCode || null,
      ...totals,
      status: "Order Received",
      statusHistory: [{ status: "Order Received" }],
    });

    await deductInventoryForItems(itemsWithSubtotal);

    emitNewOrder(order);

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's order history
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order (must belong to logged-in user)
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (only if not yet out for delivery)
// @route   PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const nonCancellable = ["Out For Delivery", "Delivered", "Cancelled"];
    if (nonCancellable.includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is ${order.status}` });
    }
    order.status = "Cancelled";
    order.statusHistory.push({ status: "Cancelled" });
    await order.save();

    emitOrderStatusUpdate(order.user, order);

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin) — triggers real-time update to user
// @route   PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Order.STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    order.statusHistory.push({ status });
    await order.save();

    emitOrderStatusUpdate(order.user, order);

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard statistics
// @route   GET /api/admin/orders/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalOrders, todaysOrders, pendingOrders, completedOrders, revenueAgg] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: startOfToday } }),
        Order.countDocuments({
          status: { $nin: ["Delivered", "Cancelled"] },
        }),
        Order.countDocuments({ status: "Delivered" }),
        Order.aggregate([
          { $match: { paymentStatus: "Paid" } },
          { $group: { _id: null, total: { $sum: "$grandTotal" } } },
        ]),
      ]);

    const revenue = revenueAgg[0]?.total || 0;

    // Last 7 days order counts for a simple chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$grandTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        todaysOrders,
        pendingOrders,
        completedOrders,
        revenue,
        dailyOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
