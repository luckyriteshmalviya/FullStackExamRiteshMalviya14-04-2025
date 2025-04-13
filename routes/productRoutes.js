const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', productController.listProducts);

router.get('/:id', productController.getProduct);

router.post('/', [auth], productController.createProduct);

router.put('/:id', [auth, admin], productController.updateProduct);

router.delete('/:id', [auth, admin], productController.deleteProduct);

module.exports = router;