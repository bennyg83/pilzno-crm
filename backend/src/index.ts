import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { authRouter } from './routes/auth';
import { familyRouter } from './routes/families';
import { familyMemberRouter } from './routes/family-members';
import { userRouter } from './routes/users';
import { errorHandler } from './middleware/error-handler';
import { authenticate } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Pilzno Synagogue Management System API',
    timestamp: new Date().toISOString()
  });
});

// Auth routes (no authentication required)
app.use('/api/auth', authRouter);

// Protected routes (authentication required)
app.use('/api/users', authenticate, userRouter);
app.use('/api/families', authenticate, familyRouter);
app.use('/api/family-members', authenticate, familyMemberRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist.`
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Pilzno Synagogue Management System API running on port ${PORT}`);
      console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
      console.log(`🌐 External access available at: http://0.0.0.0:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 