const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Login controller
exports.login = (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM Customer WHERE email = ?';
    
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
};
