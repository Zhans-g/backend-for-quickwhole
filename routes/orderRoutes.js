const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Убедись, что путь к контроллеру верный

// Маршрут для создания заказа
router.post('/', orderController.createOrderLink);

module.exports = router;