const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  getAllPizzasAdmin,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

router.use(protectAdmin);

router.get("/", getAllPizzasAdmin);
router.post("/", upload.single("image"), createPizza);
router.put("/:id", upload.single("image"), updatePizza);
router.delete("/:id", deletePizza);

module.exports = router;
