const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Проверка: есть ли такой email в базе?
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Email уже зарегистрирован' });

        // Создаем объект юзера
        user = new User({ username, email, password });

        // Шифруем пароль (чтобы в Atlas не было видно "12345")
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Создаем JWT (токен доступа)
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username, email } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка на стороне сервера');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Ищем пользователя по почте
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Неверные данные для входа (email)' });
        }

        // 2. Сравниваем введенный пароль с зашифрованным в базе
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Неверные данные для входа (password)' });
        }

        // 3. Если всё ок, создаем и отправляем токен
        const payload = { user: { id: user.id } };
        
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { id: user.id, username: user.username, email: user.email, role: user.role } 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера при входе');
    }
};

// Логику входа (login) добавим чуть позже, когда проверим это