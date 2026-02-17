const bcrypt = require('bcrypt');
const pool = require('./db');

async function ensureAdminUser() {
    try {
        const result = await pool.query(
            "SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1"
        );

        if (result.rows.length === 0) {

            const hashedPassword = await bcrypt.hash('admin', 10);

            await pool.query(
                `INSERT INTO users (username, email, password_hash, role)
                 VALUES ($1, $2, $3, $4)`,
                ['admin', 'admin@yapyap.com', hashedPassword, 'ADMIN']
            );

            console.log('Admin user created');
        } else {
            console.log('Admin already exists');
        }

    } catch (err) {
        console.error('Error ensuring admin user:', err);
    }
}

module.exports = ensureAdminUser;
