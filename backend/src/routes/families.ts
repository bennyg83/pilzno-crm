import express, { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Family, FamilyHealth } from '../entities/Family';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all families (placeholder - will be fully implemented in PROMPT 3)
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const familyRepository = AppDataSource.getRepository(Family);
  const families = await familyRepository.find({
    relations: ['members', 'familyTier'],
    take: 20
  });

  res.json({
    families,
    total: families.length,
    message: 'Family management routes will be fully implemented in Phase 2'
  });
}));

// Create new family
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const familyRepository = AppDataSource.getRepository(Family);
  
  const {
    familyName,
    hebrewFamilyName,
    membershipStatus,
    primaryEmail,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    annualPledge,
    membershipStartDate,
    membershipEndDate,
    isFoundingFamily,
    isBoardFamily,
    dietaryRestrictions,
    specialNeeds,
    familyNotes
  } = req.body;

  if (!familyName || !membershipStatus) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Family name and membership status are required.'
    });
  }

  // Check for duplicate family name
  const existingFamily = await familyRepository.findOne({ 
    where: { familyName } 
  });
  
  if (existingFamily) {
    return res.status(409).json({
      error: 'Family already exists',
      message: 'A family with this name already exists.'
    });
  }

  const family = new Family();
  family.familyName = familyName;
  family.hebrewFamilyName = hebrewFamilyName || null;
  family.membershipStatus = membershipStatus;
  family.primaryEmail = primaryEmail || null;
  family.phone = phone || null;
  family.address = address || null;
  family.city = city || null;
  family.state = state || null;
  family.zipCode = zipCode || null;
  family.country = country || 'Israel';
  family.annualPledge = annualPledge || 0;
  family.membershipStartDate = membershipStartDate ? new Date(membershipStartDate) : undefined;
  family.membershipEndDate = membershipEndDate ? new Date(membershipEndDate) : undefined;
  family.isFoundingFamily = isFoundingFamily || false;
  family.isBoardFamily = isBoardFamily || false;
  family.familyHealth = FamilyHealth.GOOD; // Default health status
  family.totalDonations = 0; // Default donations
  family.dietaryRestrictions = dietaryRestrictions || null;
  family.specialNeeds = specialNeeds || null;
  family.familyNotes = familyNotes || null;

  await familyRepository.save(family);

  res.status(201).json({
    message: 'Family created successfully',
    family: {
      id: family.id,
      familyName: family.familyName,
      hebrewFamilyName: family.hebrewFamilyName,
      membershipStatus: family.membershipStatus,
      primaryEmail: family.primaryEmail,
      phone: family.phone,
      address: family.address,
      city: family.city,
      annualPledge: family.annualPledge,
      isFoundingFamily: family.isFoundingFamily,
      isBoardFamily: family.isBoardFamily,
      createdAt: family.createdAt
    }
  });
}));

// Update family
router.put('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const familyRepository = AppDataSource.getRepository(Family);
  const { id } = req.params;
  
  const family = await familyRepository.findOne({ where: { id } });
  
  if (!family) {
    return res.status(404).json({
      error: 'Family not found',
      message: 'The specified family does not exist.'
    });
  }

  const {
    familyName,
    hebrewFamilyName,
    membershipStatus,
    primaryEmail,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    annualPledge,
    membershipStartDate,
    membershipEndDate,
    isFoundingFamily,
    isBoardFamily,
    dietaryRestrictions,
    specialNeeds,
    familyNotes
  } = req.body;

  // Update fields if provided
  if (familyName) family.familyName = familyName;
  if (hebrewFamilyName !== undefined) family.hebrewFamilyName = hebrewFamilyName || null;
  if (membershipStatus) family.membershipStatus = membershipStatus;
  if (primaryEmail !== undefined) family.primaryEmail = primaryEmail || null;
  if (phone !== undefined) family.phone = phone || null;
  if (address !== undefined) family.address = address || null;
  if (city !== undefined) family.city = city || null;
  if (state !== undefined) family.state = state || null;
  if (zipCode !== undefined) family.zipCode = zipCode || null;
  if (country !== undefined) family.country = country || null;
  if (annualPledge !== undefined) family.annualPledge = annualPledge;
  if (membershipStartDate !== undefined) family.membershipStartDate = membershipStartDate ? new Date(membershipStartDate) : undefined;
  if (membershipEndDate !== undefined) family.membershipEndDate = membershipEndDate ? new Date(membershipEndDate) : undefined;
  if (isFoundingFamily !== undefined) family.isFoundingFamily = isFoundingFamily;
  if (isBoardFamily !== undefined) family.isBoardFamily = isBoardFamily;
  if (dietaryRestrictions !== undefined) family.dietaryRestrictions = dietaryRestrictions || null;
  if (specialNeeds !== undefined) family.specialNeeds = specialNeeds || null;
  if (familyNotes !== undefined) family.familyNotes = familyNotes || null;

  await familyRepository.save(family);

  res.json({
    message: 'Family updated successfully',
    family: {
      id: family.id,
      familyName: family.familyName,
      hebrewFamilyName: family.hebrewFamilyName,
      membershipStatus: family.membershipStatus,
      primaryEmail: family.primaryEmail,
      phone: family.phone,
      address: family.address,
      city: family.city,
      annualPledge: family.annualPledge,
      isFoundingFamily: family.isFoundingFamily,
      isBoardFamily: family.isBoardFamily,
      createdAt: family.createdAt
    }
  });
}));

// Get family statistics (placeholder)
router.get('/statistics', asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    totalFamilies: 0,
    activeFamilies: 0,
    prospectiveFamilies: 0,
    atRiskFamilies: 0,
    message: 'Statistics will be implemented in PROMPT 3'
  });
}));

export { router as familyRouter }; 