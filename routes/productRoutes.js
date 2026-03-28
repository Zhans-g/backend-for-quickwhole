const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct); // Добавить
router.get('/', productController.getProducts);    // Получить все

module.exports = router;