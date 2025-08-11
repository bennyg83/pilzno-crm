"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./data-source");
const auth_1 = require("./routes/auth");
const families_1 = require("./routes/families");
const family_members_1 = require("./routes/family-members");
const users_1 = require("./routes/users");
const error_handler_1 = require("./middleware/error-handler");
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Pilzno Synagogue Management System API',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/auth', auth_1.authRouter);
app.use('/api/users', auth_2.authenticate, users_1.userRouter);
app.use('/api/families', auth_2.authenticate, families_1.familyRouter);
app.use('/api/family-members', auth_2.authenticate, family_members_1.familyMemberRouter);
app.use(error_handler_1.errorHandler);
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The requested endpoint ${req.originalUrl} does not exist.`
    });
});
const startServer = async () => {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('✅ Database connection established successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Pilzno Synagogue Management System API running on port ${PORT}`);
            console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map