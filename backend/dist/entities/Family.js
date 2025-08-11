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
exports.Family = exports.FamilyHealth = exports.MembershipStatus = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const FamilyTier_1 = require("./FamilyTier");
const FamilyMember_1 = require("./FamilyMember");
const Event_1 = require("./Event");
const Donation_1 = require("./Donation");
const Note_1 = require("./Note");
const Email_1 = require("./Email");
var MembershipStatus;
(function (MembershipStatus) {
    MembershipStatus["MEMBER"] = "member";
    MembershipStatus["PROSPECTIVE"] = "prospective";
    MembershipStatus["VISITOR"] = "visitor";
    MembershipStatus["FORMER"] = "former";
})(MembershipStatus || (exports.MembershipStatus = MembershipStatus = {}));
var FamilyHealth;
(function (FamilyHealth) {
    FamilyHealth["EXCELLENT"] = "excellent";
    FamilyHealth["GOOD"] = "good";
    FamilyHealth["NEEDS_ATTENTION"] = "needs-attention";
    FamilyHealth["AT_RISK"] = "at-risk";
})(FamilyHealth || (exports.FamilyHealth = FamilyHealth = {}));
let Family = class Family {
    getDisplayName() {
        return this.hebrewFamilyName ? `${this.familyName} (${this.hebrewFamilyName})` : this.familyName;
    }
    getFullAddress() {
        const parts = [this.address, this.city, this.state, this.zipCode, this.country].filter(Boolean);
        return parts.join(', ');
    }
    getMemberCount() {
        return this.members?.length || 0;
    }
    getChildrenCount() {
        return this.members?.filter(member => member.isChild()).length || 0;
    }
    getHeadOfHousehold() {
        return this.members?.find(member => member.relationshipToHead === 'self');
    }
    getPrimaryContact() {
        return this.members?.find(member => member.isPrimaryContact) || this.getHeadOfHousehold();
    }
};
exports.Family = Family;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Family.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "familyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "hebrewFamilyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Family.prototype, "primaryEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Family.prototype, "secondaryEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "zipCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MembershipStatus, default: MembershipStatus.PROSPECTIVE }),
    (0, class_validator_1.IsEnum)(MembershipStatus),
    __metadata("design:type", String)
], Family.prototype, "membershipStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Family.prototype, "membershipStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Family.prototype, "membershipEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Family.prototype, "annualPledge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Family.prototype, "totalDonations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Family.prototype, "lastDonationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Family.prototype, "lastContactDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Family.prototype, "nextFollowUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: FamilyHealth, default: FamilyHealth.GOOD }),
    (0, class_validator_1.IsEnum)(FamilyHealth),
    __metadata("design:type", String)
], Family.prototype, "familyHealth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "dietaryRestrictions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "specialNeeds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Family.prototype, "familyNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Family.prototype, "receiveNewsletter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Family.prototype, "receiveEventNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Family.prototype, "isFoundingFamily", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Family.prototype, "isBoardFamily", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Family.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Family.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => FamilyTier_1.FamilyTier, familyTier => familyTier.families, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyTierId' }),
    __metadata("design:type", FamilyTier_1.FamilyTier)
], Family.prototype, "familyTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Family.prototype, "familyTierId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FamilyMember_1.FamilyMember, member => member.family, { cascade: true }),
    __metadata("design:type", Array)
], Family.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Event_1.Event, event => event.family),
    __metadata("design:type", Array)
], Family.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Donation_1.Donation, donation => donation.family),
    __metadata("design:type", Array)
], Family.prototype, "donations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Note_1.Note, note => note.family),
    __metadata("design:type", Array)
], Family.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Email_1.Email, email => email.family),
    __metadata("design:type", Array)
], Family.prototype, "emails", void 0);
exports.Family = Family = __decorate([
    (0, typeorm_1.Entity)('families')
], Family);
//# sourceMappingURL=Family.js.map