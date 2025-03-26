const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Ensure jwt is imported
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

// Middleware to authenticate the user and verify the token
module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Token is required' });
  }

  // Verify the JWT token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    // Check if the user exists in the MySQL database
    const userId = decoded.id;
    
    console.log("userId: ", userId);

    const query = 'SELECT * FROM users WHERE id = ?';

    db.query(query, [userId], (err, results) => {
      console.log("query excuted");
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      req.user = results[0];
      next();
    });



  });
};