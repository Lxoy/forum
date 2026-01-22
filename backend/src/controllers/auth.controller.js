const pool = require('../db');
const bcrypt = require('bcrypt');

const register = async(req, res) => {
    try{
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ message: 'Missing fields'});
        }

        const userExists = await pool.query(
            `SELECT id FROM users WHERE username = $1 or email = $2`,
            [username, email]
        );

        if(userExists.rows.length > 0){
            return res.status(409).json({ message: 'User already exists!'});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(`INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)`, [username, email, passwordHash]);

        return res.status(201).json({ message: 'User registered successfully!' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {register};