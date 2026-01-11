import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            //coom
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success: false,
                message: 'Non autorisé, token invalide'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Non autorisé, pas de token'
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Le rôle utilisateur ${req.user.role} n'est pas autorisé à accéder à cette route`
            });
        }
        next();
    };
};
