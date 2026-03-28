const Product = require('../models/Product');

// ПОЛУЧЕНИЕ ВСЕХ ТОВАРОВ
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // Новые товары будут сверху
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Ошибка при получении товаров" });
    }
};

// СОЗДАНИЕ НОВОГО ТОВАРА (Для админки)
exports.createProduct = async (req, res) => {
    try {
        const { name, price, imageUrl, minOrder } = req.body;

        const newProduct = new Product({
            name,
            price: Number(price), // Убедимся, что цена — это число
            imageUrl,
            minOrder: Number(minOrder) || 1
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Ошибка при создании товара" });
    }
};