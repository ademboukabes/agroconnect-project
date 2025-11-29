import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

/**
 * Service d'authentification
 * Contient la logique métier pour l'authentification des utilisateurs
 */

/**
 * Génère un token JWT pour un utilisateur
 * @param {String} userId - L'ID de l'utilisateur
 * @returns {String} Token JWT
 */
export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'supersecretkey123',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};

/**
 * Vérifie un token JWT
 * @param {String} token - Le token à vérifier
 * @returns {Object} Données décodées du token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');
    } catch (error) {
        throw new Error('Token invalide');
    }
};

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Object} Utilisateur créé et token
 */
export const registerUser = async (userData) => {
    const { name, email, password, role, phone, transporterProfile } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
    }

    // Créer l'utilisateur
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user',
        phone,
        transporterProfile: role === 'transporter' ? transporterProfile : undefined
    });

    // Générer le token
    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};

/**
 * Authentifie un utilisateur
 * @param {String} email - Email de l'utilisateur
 * @param {String} password - Mot de passe
 * @returns {Object} Utilisateur et token
 */
export const loginUser = async (email, password) => {
    // Trouver l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // Générer le token
    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};

/**
 * Récupère un utilisateur par son ID
 * @param {String} userId - ID de l'utilisateur
 * @returns {Object} Utilisateur
 */
export const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }
    return user;
};
