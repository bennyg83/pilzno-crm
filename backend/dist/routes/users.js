"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const error_handler_1 = require("../middleware/error-handler");
const router = express_1.default.Router();
exports.userRouter = router;
router.get('/profile', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    res.json({
        id: user?.id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role,
        isActive: user?.isActive,
        createdAt: user?.createdAt
    });
}));
router.put('/profile', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (firstName)
        user.firstName = firstName;
    if (lastName)
        user.lastName = lastName;
    await userRepository.save(user);
    res.json({
        message: 'Profile updated successfully',
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    });
}));
router.get('/', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const currentUser = req.user;
    if (currentUser?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const users = await userRepository.find({
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt']
    });
    res.json({ users });
}));
//# sourceMappingURL=users.js.map