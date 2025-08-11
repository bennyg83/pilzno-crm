"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyMember = exports.RelationshipToHead = exports.Gender = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Family_1 = require("./Family");
const Event_1 = require("./Event");
const Donation_1 = require("./Donation");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var RelationshipToHead;
(function (RelationshipToHead) {
    RelationshipToHead["SELF"] = "self";
    RelationshipToHead["SPOUSE"] = "spouse";
    RelationshipToHead["CHILD"] = "child";
    RelationshipToHead["PARENT"] = "parent";
    RelationshipToHead["SIBLING"] = "sibling";
    RelationshipToHead["OTHER"] = "other";
})(RelationshipToHead || (exports.RelationshipToHead = RelationshipToHead = {}));
let FamilyMember = class FamilyMember {
    getFullName() {
        const name = `${this.firstName} ${this.lastName}`;
        return this.nickname ? `${name} (${this.nickname})` : name;
    }
    getHebrewFullName() {
        if (!this.hebrewFirstName && !this.hebrewLastName)
            return '';
        return `${this.hebrewFirstName || ''} ${this.hebrewLastName || ''}`.trim();
    }
    getDisplayName() {
        const englishName = this.getFullName();
        const hebrewName = this.getHebrewFullName();
        return hebrewName ? `${englishName} (${hebrewName})` : englishName;
    }
    getAge() {
        if (!this.dateOfBirth)
            return null;
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    isChild() {
        const age = this.getAge();
        return age !== null && age < 18;
    }
    isTeen() {
        const age = this.getAge();
        return age !== null && age >= 13 && age < 18;
    }
    isAdult() {
        const age = this.getAge();
        return age !== null && age >= 18;
    }
    isSenior() {
        const age = this.getAge();
        return age !== null && age >= 65;
    }
    isBirthdayThisMonth() {
        if (!this.dateOfBirth)
            return false;
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        return today.getMonth() === birthDate.getMonth();
    }
    isYahrzeitThisMonth() {
        if (!this.dateOfDeath)
            return false;
        const today = new Date();
        const deathDate = new Date(this.dateOfDeath);
        return today.getMonth() === deathDate.getMonth();
    }
    isUpcomingBarBatMitzvah() {
        if (!this.dateOfBirth || this.barBatMitzvahDate)
            return false;
        const age = this.getAge();
        return age !== null && age >= 12 && age <= 14;
    }
    getLifeStage() {
        if (this.isChild())
            return 'child';
        if (this.isTeen())
            return 'teen';
        if (this.isSenior())
            return 'senior';
        return 'adult';
    }
    getPriestlyStatus() {
        if (this.isCohen)
            return 'Cohen';
        if (this.isLevi)
            return 'Levi';
        return null;
    }
};
exports.FamilyMember = FamilyMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FamilyMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "hebrewFirstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "hebrewLastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], FamilyMember.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "hebrewBirthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Gender, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Gender),
    __metadata("design:type", String)
], FamilyMember.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RelationshipToHead, default: RelationshipToHead.OTHER }),
    (0, class_validator_1.IsEnum)(RelationshipToHead),
    __metadata("design:type", String)
], FamilyMember.prototype, "relationshipToHead", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "isPrimaryContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], FamilyMember.prototype, "barBatMitzvahDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "hebrewBarBatMitzvahDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "isCohen", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "isLevi", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "israeliCitizenship", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], FamilyMember.prototype, "aliyahDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "synagogueRoles", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "interests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], FamilyMember.prototype, "dateOfDeath", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "hebrewDeathDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "memorialInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "receiveEmails", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "receiveTexts", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FamilyMember.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "medicalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "accessibilityNeeds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FamilyMember.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FamilyMember.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Family_1.Family, family => family.members),
    (0, typeorm_1.JoinColumn)({ name: 'familyId' }),
    __metadata("design:type", Family_1.Family)
], FamilyMember.prototype, "family", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FamilyMember.prototype, "familyId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Event_1.Event, event => event.familyMember),
    __metadata("design:type", Array)
], FamilyMember.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Donation_1.Donation, donation => donation.familyMember),
    __metadata("design:type", Array)
], FamilyMember.prototype, "donations", void 0);
exports.FamilyMember = FamilyMember = __decorate([
    (0, typeorm_1.Entity)('family_members')
], FamilyMember);
//# sourceMappingURL=FamilyMember.js.map