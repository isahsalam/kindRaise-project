const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../model/userModel');
exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({ message: 'Access denied, authorization required' });
        }

        const token = auth.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: 'Token missing or invalid' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log the decoded token

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: `Authentication error: ${error.message}` });
    }
};

// exports.authenticate = async (req, res, next) => {
//     try {
//         const auth = req.headers.authorization;
//         if (!auth) {
//             return res.status(400).json({ info: 'Access denied, needs authorization to continue' });
//         }
//         const token = auth.split(" ")[1];
//         if (!token) {
//             return res.status(400).json({ message: 'No or invalid token' });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await userModel.findById(decoded._id);
//         console.log(user)
//         if (!user) {
//             return res.status(400).json({ message: 'User not found or details incorrect' });
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(500).json({ message: `Authentication error: ${error.message}` });
//     }
// };

  
exports.authenticateAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') { 
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};
exports.authenticateNpo = (req, res, next) => {
    if (req.user.role !== 'npo') { 
        return res.status(403).json({ message: 'Access Denied. npo privileges required.' });
    }
    next();
};
exports.authenticateDonor  = (req, res, next) => {
    if (req.user.role !== 'donor') { 
        return res.status(403).json({ message: 'Access Denied. donor privileges required.' });
    }
    next();
};