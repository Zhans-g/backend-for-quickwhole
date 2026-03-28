const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // Связь с пользователем, который сделал заказ
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    // Список товаров в заказе
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    city: { type: String, required: true },
    status: {
        type: String,
        default: 'Pending', // Pending, Shipped, Delivered, Cancelled
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);