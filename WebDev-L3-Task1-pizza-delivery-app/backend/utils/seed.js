// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Pizza = require("../models/Pizza");
const Inventory = require("../models/Inventory");

const pizzas = [
  {
    name: "Margherita",
    description: "Classic cheese and tomato pizza",
    category: "Veg",
    basePrice: { small: 149, medium: 249, large: 349 },
    image: "",
  },
  {
    name: "Farmhouse",
    description: "Loaded with fresh veggies",
    category: "Veg",
    basePrice: { small: 199, medium: 299, large: 399 },
    image: "",
  },
  {
    name: "Pepperoni",
    description: "Classic pepperoni with mozzarella",
    category: "Non-Veg",
    basePrice: { small: 249, medium: 349, large: 449 },
    image: "",
  },
  {
    name: "Chicken Tikka",
    description: "Spicy chicken tikka pizza, Indian style",
    category: "Non-Veg",
    basePrice: { small: 259, medium: 369, large: 469 },
    image: "",
  },
  {
    name: "Build Your Own",
    description: "Customize your pizza from scratch",
    category: "Custom",
    basePrice: { small: 129, medium: 199, large: 269 },
    isCustomizable: true,
    image: "",
  },
];

const inventoryItems = [
  { itemName: "Thin Crust", category: "Base", stock: 50, price: 0 },
  { itemName: "Thick Crust", category: "Base", stock: 50, price: 20 },
  { itemName: "Cheese Burst", category: "Base", stock: 50, price: 40 },
  { itemName: "Wheat Thin Crust", category: "Base", stock: 50, price: 10 },
  { itemName: "Multigrain Crust", category: "Base", stock: 50, price: 20 },

  { itemName: "Tomato Sauce", category: "Sauce", stock: 100, price: 0 },
  { itemName: "Pesto Sauce", category: "Sauce", stock: 100, price: 20 },
  { itemName: "BBQ Sauce", category: "Sauce", stock: 100, price: 20 },
  { itemName: "White Sauce", category: "Sauce", stock: 100, price: 25 },
  { itemName: "Peri Peri Sauce", category: "Sauce", stock: 100, price: 20 },

  { itemName: "Mozzarella", category: "Cheese", stock: 100, price: 0 },

  { itemName: "Onion", category: "Vegetable", stock: 100, price: 10 },
  { itemName: "Capsicum", category: "Vegetable", stock: 100, price: 10 },
  { itemName: "Mushroom", category: "Vegetable", stock: 100, price: 20 },
  { itemName: "Corn", category: "Vegetable", stock: 100, price: 15 },
  { itemName: "Olives", category: "Vegetable", stock: 100, price: 20 },
  { itemName: "Jalapeno", category: "Vegetable", stock: 100, price: 15 },
];

const seed = async () => {
  await connectDB();

  await Admin.deleteMany({});
  await Pizza.deleteMany({});
  await Inventory.deleteMany({});

  await Admin.create({
    name: "Super Admin",
    email: process.env.ADMIN_EMAIL || "admin@pizza.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    role: "superadmin",
  });

  await Pizza.insertMany(pizzas);
  await Inventory.insertMany(inventoryItems);

  console.log("Seed data inserted successfully!");
  console.log(`Admin login -> email: ${process.env.ADMIN_EMAIL}, password: ${process.env.ADMIN_PASSWORD}`);
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
