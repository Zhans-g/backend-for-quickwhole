const Order = require('../models/Order');

exports.createOrderLink = async (req, res) => {
    try {
        const { cartItems, totalPrice, city, customerName, userId } = req.body;

        const newOrder = new Order({
            user: userId || null,
            items: cartItems,
            totalPrice,
            city,
            customerName
        });
        await newOrder.save();

        let message = `🚀 *Новый заказ №${newOrder._id.toString().slice(-6)}*\n\n`; // Берем последние 6 цифр ID для красоты
        message += `👤 *Клиент:* ${customerName}\n`;
        message += `📍 *Город:* ${city}\n\n`;
        message += `📦 *Товары:*\n`;

        cartItems.forEach((item, index) => {
            // СЧИТАЕМ СУММУ ДЛЯ КАЖДОЙ ПОЗИЦИИ
            const itemSum = item.price * item.quantity; 
            message += `${index + 1}. *${item.name}*\n`;
            message += `   ${item.quantity} шт. x ${item.price.toLocaleString()} ₸ = ${itemSum.toLocaleString()} ₸\n`;
        });

        message += `\n💰 *ИТОГО К ОПЛАТЕ: ${totalPrice.toLocaleString()} ₸*`;

        const adminPhone = "7707XXXXXXX";
        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

        res.json({ url: whatsappUrl, orderId: newOrder._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Ошибка при создании заказа" });
    }
};