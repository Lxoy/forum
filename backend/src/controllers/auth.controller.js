const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const userExists = await pool.query(
            `SELECT id FROM users WHERE username = $1 or email = $2`,
            [username, email]
        );

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists!' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(`INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)`, [username, email, passwordHash]);

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const result = await pool.query(
            `SELECT id, password_hash FROM users WHERE username = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const { id: userId, password_hash: storedHash } = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, storedHash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: userId, username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );


        return res.status(200).json({
            message: "Login successful!",
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
}

module.exports = { register, login };