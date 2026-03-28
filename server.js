const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

// ПОРЯДОК ВАЖЕН:
app.use(cors()); // 1. Разрешаем кросс-доменные запросы
app.use(express.json()); // 2. Разрешаем чтение JSON из тела запроса (body)

// 3. Подключаем базу данных MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ База QuickWhole подключена!'))
    .catch(err => console.error('❌ Ошибка подключения к базе:', err));

// 4. Роуты (Маршруты)
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // ИМПОРТ РОУТОВ ЗАКАЗОВ

app.use('/api/auth', authRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // РЕГИСТРАЦИЯ РОУТА (Лечит ошибку 404)

// 5. Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 QuickWhole Server running on port ${PORT}`));