"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const error_handler_1 = require("../middleware/error-handler");
const class_validator_1 = require("class-validator");
const router = express_1.default.Router();
exports.authRouter = router;
router.post('/register', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName, role = 'user' } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'Email, password, first name, and last name are required.'
        });
    }
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
        return res.status(409).json({
            error: 'User already exists',
            message: 'A user with this email address already exists.'
        });
    }
    const saltRounds = 12;
    const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
    const user = new User_1.User();
    user.email = email;
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;
    const errors = await (0, class_validator_1.validate)(user);
    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            message: 'User data validation failed.',
            details: errors
        });
    }
    await userRepository.save(user);
    const jwtSecret = process.env.JWT_SECRET || 'pilzno_synagogue_jwt_secret_key_2024';
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role
    }, jwtSecret, { expiresIn: '24h' });
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        token
    });
}));
router.post('/login', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: 'Missing credentials',
            message: 'Email and password are required.'
        });
    }
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = await userRepository.findOne({
        where: { email, isActive: true }
    });
    if (!user) {
        return res.status(401).json({
            error: 'Invalid credentials',
            message: 'Invalid email or password.'
        });
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            error: 'Invalid credentials',
            message: 'Invalid email or password.'
        });
    }
    const jwtSecret = process.env.JWT_SECRET || 'pilzno_synagogue_jwt_secret_key_2024';
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role
    }, jwtSecret, { expiresIn: '24h' });
    res.json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        token
    });
}));
router.get('/verify', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Authentication required',
            message: 'Please provide a valid authorization token.'
        });
    }
    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'pilzno_synagogue_jwt_secret_key_2024';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: decoded.userId, isActive: true }
        });
        if (!user) {
            return res.status(401).json({
                error: 'User not found',
                message: 'The user associated with this token was not found.'
            });
        }
        res.json({
            message: 'Token is valid',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    }
    catch (error) {
        return res.status(401).json({
            error: 'Invalid token',
            message: 'The provided token is invalid or expired.'
        });
    }
}));
//# sourceMappingURL=auth.js.map