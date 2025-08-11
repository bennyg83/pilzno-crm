"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireStaffOrAdmin = exports.requireAdmin = exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Please provide a valid authorization token.'
            });
        }
        const token = authHeader.substring(7);
        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Token not provided.'
            });
        }
        const jwtSecret = process.env.JWT_SECRET || 'pilzno_synagogue_jwt_secret_key_2024';
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        catch (jwtError) {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'The provided token is invalid or expired.'
            });
        }
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: decoded.userId, isActive: true }
        });
        if (!user) {
            return res.status(401).json({
                error: 'User not found',
                message: 'The user associated with this token was not found or is inactive.'
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'Authentication error',
            message: 'An error occurred during authentication.'
        });
    }
};
exports.authenticate = authenticate;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'User not authenticated.'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireStaffOrAdmin = (0, exports.requireRole)(['staff', 'admin']);
//# sourceMappingURL=auth.js.map