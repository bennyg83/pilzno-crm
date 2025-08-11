import express, { Response } from 'express';
import { AppDataSource } from '../data-source';
import { FamilyMember, Gender, RelationshipToHead } from '../entities/FamilyMember';
import { Family } from '../entities/Family';
import { asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all family members with filtering and pagination
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const { 
    page = 1, 
    limit = 50, 
    familyId, 
    search, 
    isActive = 'true',
    relationshipToHead,
    gender 
  } = req.query;

  const queryBuilder = memberRepository.createQueryBuilder('member')
    .leftJoinAndSelect('member.family', 'family')
    .orderBy('member.lastName', 'ASC')
    .addOrderBy('member.firstName', 'ASC');

  // Apply filters
  if (familyId) {
    queryBuilder.andWhere('member.familyId = :familyId', { familyId });
  }

  if (isActive !== 'all') {
    queryBuilder.andWhere('member.isActive = :isActive', { isActive: isActive === 'true' });
  }

  if (relationshipToHead) {
    queryBuilder.andWhere('member.relationshipToHead = :relationshipToHead', { relationshipToHead });
  }

  if (gender) {
    queryBuilder.andWhere('member.gender = :gender', { gender });
  }

  if (search) {
    queryBuilder.andWhere(
      '(LOWER(member.firstName) LIKE LOWER(:search) OR LOWER(member.lastName) LIKE LOWER(:search) OR LOWER(member.email) LIKE LOWER(:search) OR LOWER(member.hebrewFirstName) LIKE LOWER(:search) OR LOWER(member.hebrewLastName) LIKE LOWER(:search))',
      { search: `%${search}%` }
    );
  }

  // Pagination
  const offset = (Number(page) - 1) * Number(limit);
  queryBuilder.skip(offset).take(Number(limit));

  const [members, total] = await queryBuilder.getManyAndCount();

  res.json({
    members,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit))
  });
}));

// Get member by ID
router.get('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const member = await memberRepository.findOne({
    where: { id: req.params.id },
    relations: ['family']
  });

  if (!member) {
    return res.status(404).json({
      error: 'Member not found',
      message: 'The specified member does not exist.'
    });
  }

  res.json({ member });
}));

// Create new family member
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const familyRepository = AppDataSource.getRepository(Family);

  const {
    firstName,
    lastName,
    hebrewFirstName,
    hebrewLastName,
    nickname,
    email,
    phone,
    dateOfBirth,
    hebrewBirthDate,
    gender,
    relationshipToHead,
    familyId,
    isPrimaryContact,
    isActive,
    barBatMitzvahDate,
    hebrewBarBatMitzvahDate,
    isCohen,
    isLevi,
    israeliCitizenship,
    aliyahDate,
    education,
    profession,
    synagogueRoles,
    skills,
    interests,
    receiveEmails,
    receiveTexts,
    emergencyContact,
    medicalNotes,
    accessibilityNeeds,
    notes
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !familyId) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'First name, last name, and family ID are required.'
    });
  }

  // Verify family exists
  const family = await familyRepository.findOne({ where: { id: familyId } });
  if (!family) {
    return res.status(404).json({
      error: 'Family not found',
      message: 'The specified family does not exist.'
    });
  }

  // Check for duplicate email if provided
  if (email) {
    const existingMember = await memberRepository.findOne({ where: { email } });
    if (existingMember) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'A member with this email address already exists.'
      });
    }
  }

  const member = new FamilyMember();
  member.firstName = firstName;
  member.lastName = lastName;
  member.hebrewFirstName = hebrewFirstName || null;
  member.hebrewLastName = hebrewLastName || null;
  member.nickname = nickname || null;
  member.email = email || null;
  member.phone = phone || null;
  member.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
  member.hebrewBirthDate = hebrewBirthDate || undefined;
  member.gender = gender || undefined;
  member.relationshipToHead = relationshipToHead || RelationshipToHead.OTHER;
  member.familyId = familyId;
  member.isPrimaryContact = isPrimaryContact || false;
  member.isActive = isActive !== undefined ? isActive : true;
  member.barBatMitzvahDate = barBatMitzvahDate ? new Date(barBatMitzvahDate) : undefined;
  member.hebrewBarBatMitzvahDate = hebrewBarBatMitzvahDate || undefined;
  member.isCohen = isCohen || false;
  member.isLevi = isLevi || false;
  member.israeliCitizenship = israeliCitizenship || false;
  member.aliyahDate = aliyahDate ? new Date(aliyahDate) : undefined;
  member.education = education || null;
  member.profession = profession || null;
  member.synagogueRoles = synagogueRoles || null;
  member.skills = skills || null;
  member.interests = interests || null;
  member.receiveEmails = receiveEmails !== undefined ? receiveEmails : true;
  member.receiveTexts = receiveTexts || false;
  member.emergencyContact = emergencyContact || false;
  member.medicalNotes = medicalNotes || null;
  member.accessibilityNeeds = accessibilityNeeds || null;
  member.notes = notes || null;

  await memberRepository.save(member);

  // Fetch the saved member with family relation
  const savedMember = await memberRepository.findOne({
    where: { id: member.id },
    relations: ['family']
  });

  res.status(201).json({
    message: 'Family member created successfully',
    member: savedMember
  });
}));

// Update family member
router.put('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const member = await memberRepository.findOne({ where: { id: req.params.id } });

  if (!member) {
    return res.status(404).json({
      error: 'Member not found',
      message: 'The specified member does not exist.'
    });
  }

  // Check for duplicate email if being updated
  if (req.body.email && req.body.email !== member.email) {
    const existingMember = await memberRepository.findOne({ where: { email: req.body.email } });
    if (existingMember) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'A member with this email address already exists.'
      });
    }
  }

  // Update fields
  (Object.keys(req.body) as Array<keyof FamilyMember | string>).forEach((key) => {
    if (key === 'dateOfBirth' || key === 'barBatMitzvahDate' || key === 'aliyahDate') {
      const typedKey = key as keyof FamilyMember;
      const value = (req.body as Record<string, unknown>)[key];
      (member as any)[typedKey] = value ? new Date(value as string) : undefined;
    } else if ((req.body as Record<string, unknown>)[key] !== undefined) {
      const typedKey = key as keyof FamilyMember;
      (member as any)[typedKey] = (req.body as Record<string, unknown>)[key];
    }
  });

  await memberRepository.save(member);

  // Fetch updated member with family relation
  const updatedMember = await memberRepository.findOne({
    where: { id: member.id },
    relations: ['family']
  });

  res.json({
    message: 'Family member updated successfully',
    member: updatedMember
  });
}));

// Delete family member
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const member = await memberRepository.findOne({ where: { id: req.params.id } });

  if (!member) {
    return res.status(404).json({
      error: 'Member not found',
      message: 'The specified member does not exist.'
    });
  }

  await memberRepository.remove(member);

  res.json({
    message: 'Family member deleted successfully'
  });
}));

// Get birthdays this month
router.get('/special/birthdays-this-month', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const currentMonth = new Date().getMonth() + 1;

  const birthdays = await memberRepository
    .createQueryBuilder('member')
    .leftJoinAndSelect('member.family', 'family')
    .where('EXTRACT(MONTH FROM member.dateOfBirth) = :month', { month: currentMonth })
    .andWhere('member.isActive = true')
    .orderBy('EXTRACT(DAY FROM member.dateOfBirth)', 'ASC')
    .getMany();

  res.json({
    birthdays,
    month: currentMonth,
    total: birthdays.length
  });
}));

// Get yahrzeits this month
router.get('/special/yahrzeits-this-month', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const currentMonth = new Date().getMonth() + 1;

  const yahrzeits = await memberRepository
    .createQueryBuilder('member')
    .leftJoinAndSelect('member.family', 'family')
    .where('EXTRACT(MONTH FROM member.dateOfDeath) = :month', { month: currentMonth })
    .andWhere('member.dateOfDeath IS NOT NULL')
    .orderBy('EXTRACT(DAY FROM member.dateOfDeath)', 'ASC')
    .getMany();

  res.json({
    yahrzeits,
    month: currentMonth,
    total: yahrzeits.length
  });
}));

// Get upcoming B'nai Mitzvah
router.get('/special/upcoming-bnai-mitzvah', asyncHandler(async (req: AuthRequest, res: Response) => {
  const memberRepository = AppDataSource.getRepository(FamilyMember);
  const currentYear = new Date().getFullYear();

  const upcomingBnaiMitzvah = await memberRepository
    .createQueryBuilder('member')
    .leftJoinAndSelect('member.family', 'family')
    .where('member.dateOfBirth IS NOT NULL')
    .andWhere('member.barBatMitzvahDate IS NULL')
    .andWhere('member.isActive = true')
    .andWhere(`EXTRACT(YEAR FROM member.dateOfBirth) BETWEEN :startYear AND :endYear`, {
      startYear: currentYear - 15,
      endYear: currentYear - 11
    })
    .orderBy('member.dateOfBirth', 'ASC')
    .getMany();

  res.json({
    upcomingBnaiMitzvah,
    total: upcomingBnaiMitzvah.length
  });
}));

export { router as familyMemberRouter }; 