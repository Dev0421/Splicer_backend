const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Ensure jwt is imported
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Registering...", req.body);

        // Check if the user already exists
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        await db.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("Logging in...", req.body);
        const { email, password } = req.body;

        // Use promise-based query
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const user = results[0];

        // Use await properly
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            user: { username: user.username, email: user.email },
            token: "Bearer " + token,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};