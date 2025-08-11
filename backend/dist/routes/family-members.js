"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.familyMemberRouter = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const FamilyMember_1 = require("../entities/FamilyMember");
const Family_1 = require("../entities/Family");
const error_handler_1 = require("../middleware/error-handler");
const router = express_1.default.Router();
exports.familyMemberRouter = router;
router.get('/', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
    const { page = 1, limit = 50, familyId, search, isActive = 'true', relationshipToHead, gender } = req.query;
    const queryBuilder = memberRepository.createQueryBuilder('member')
        .leftJoinAndSelect('member.family', 'family')
        .orderBy('member.lastName', 'ASC')
        .addOrderBy('member.firstName', 'ASC');
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
        queryBuilder.andWhere('(LOWER(member.firstName) LIKE LOWER(:search) OR LOWER(member.lastName) LIKE LOWER(:search) OR LOWER(member.email) LIKE LOWER(:search) OR LOWER(member.hebrewFirstName) LIKE LOWER(:search) OR LOWER(member.hebrewLastName) LIKE LOWER(:search))', { search: `%${search}%` });
    }
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
router.get('/:id', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
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
router.post('/', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
    const familyRepository = data_source_1.AppDataSource.getRepository(Family_1.Family);
    const { firstName, lastName, hebrewFirstName, hebrewLastName, nickname, email, phone, dateOfBirth, hebrewBirthDate, gender, relationshipToHead, familyId, isPrimaryContact, isActive, barBatMitzvahDate, hebrewBarBatMitzvahDate, isCohen, isLevi, israeliCitizenship, aliyahDate, education, profession, synagogueRoles, skills, interests, receiveEmails, receiveTexts, emergencyContact, medicalNotes, accessibilityNeeds, notes } = req.body;
    if (!firstName || !lastName || !familyId) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'First name, last name, and family ID are required.'
        });
    }
    const family = await familyRepository.findOne({ where: { id: familyId } });
    if (!family) {
        return res.status(404).json({
            error: 'Family not found',
            message: 'The specified family does not exist.'
        });
    }
    if (email) {
        const existingMember = await memberRepository.findOne({ where: { email } });
        if (existingMember) {
            return res.status(409).json({
                error: 'Email already exists',
                message: 'A member with this email address already exists.'
            });
        }
    }
    const member = new FamilyMember_1.FamilyMember();
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
    member.relationshipToHead = relationshipToHead || FamilyMember_1.RelationshipToHead.OTHER;
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
    const savedMember = await memberRepository.findOne({
        where: { id: member.id },
        relations: ['family']
    });
    res.status(201).json({
        message: 'Family member created successfully',
        member: savedMember
    });
}));
router.put('/:id', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
    const member = await memberRepository.findOne({ where: { id: req.params.id } });
    if (!member) {
        return res.status(404).json({
            error: 'Member not found',
            message: 'The specified member does not exist.'
        });
    }
    if (req.body.email && req.body.email !== member.email) {
        const existingMember = await memberRepository.findOne({ where: { email: req.body.email } });
        if (existingMember) {
            return res.status(409).json({
                error: 'Email already exists',
                message: 'A member with this email address already exists.'
            });
        }
    }
    Object.keys(req.body).forEach((key) => {
        if (key === 'dateOfBirth' || key === 'barBatMitzvahDate' || key === 'aliyahDate') {
            const typedKey = key;
            const value = req.body[key];
            member[typedKey] = value ? new Date(value) : undefined;
        }
        else if (req.body[key] !== undefined) {
            const typedKey = key;
            member[typedKey] = req.body[key];
        }
    });
    await memberRepository.save(member);
    const updatedMember = await memberRepository.findOne({
        where: { id: member.id },
        relations: ['family']
    });
    res.json({
        message: 'Family member updated successfully',
        member: updatedMember
    });
}));
router.delete('/:id', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
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
router.get('/special/birthdays-this-month', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
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
router.get('/special/yahrzeits-this-month', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
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
router.get('/special/upcoming-bnai-mitzvah', (0, error_handler_1.asyncHandler)(async (req, res) => {
    const memberRepository = data_source_1.AppDataSource.getRepository(FamilyMember_1.FamilyMember);
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
//# sourceMappingURL=family-members.js.map