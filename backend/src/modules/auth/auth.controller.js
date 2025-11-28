import { registerUser, loginUser, getUserById } from './auth.service.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir tous les champs requis'
            });
        }

        // Register user using service
        const result = await registerUser({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: result
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur lors de l\'inscription'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir email et mot de passe'
            });
        }

        // Login user using service
        const result = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            data: result
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);

        // Return 401 for authentication errors
        const statusCode = error.message.includes('incorrect') ? 401 : 500;

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Erreur serveur lors de la connexion'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const user = await getUserById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
