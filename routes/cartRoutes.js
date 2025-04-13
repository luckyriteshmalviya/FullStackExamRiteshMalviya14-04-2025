const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

router.get("/", cartController.getCart);

router.post("/", cartController.addToCart);

router.delete("/:productId", cartController.removeFromCart);

router.put("/:productId", cartController.updateCartItem);

router.delete("/", cartController.clearCart);

module.exports = router;
