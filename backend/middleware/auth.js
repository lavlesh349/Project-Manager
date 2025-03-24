const jwt = require('jsonwebtoken');
require('dotenv').config(); // To use environment variables

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Adjust based on how you're sending the token

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using the secret key from the .env file
        const decoded = jwt.verify(token, "1234"); // Use the actual secret key

        // Store both userId and username from the decoded token in the request object
        req.userId = decoded.id;       // Assuming your token contains 'id'
        req.userName = decoded.username; // Assuming your token contains 'username'

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Token is invalid or expired
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
