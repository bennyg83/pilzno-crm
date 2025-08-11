import express, { Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/profile', asyncHandler(async (req: AuthRequest, res: Response) => {
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

// Update user profile
router.put('/profile', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;

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

// Get all users (admin only)
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const currentUser = req.user;
  
  if (currentUser?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find({
    select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt']
  });

  res.json({ users });
}));

export { router as userRouter }; 