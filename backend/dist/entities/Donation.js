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
exports.Donation = exports.RecurringFrequency = exports.DonationType = exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Family_1 = require("./Family");
const FamilyMember_1 = require("./FamilyMember");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CHECK"] = "check";
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["ONLINE"] = "online";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["VENMO"] = "venmo";
    PaymentMethod["ZELLE"] = "zelle";
    PaymentMethod["OTHER"] = "other";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var DonationType;
(function (DonationType) {
    DonationType["GENERAL"] = "general";
    DonationType["BUILDING"] = "building";
    DonationType["TORAH"] = "torah";
    DonationType["MEMORIAL"] = "memorial";
    DonationType["HOLIDAY"] = "holiday";
    DonationType["EDUCATION"] = "education";
    DonationType["YOUTH"] = "youth";
    DonationType["SECURITY"] = "security";
    DonationType["SOCIAL_ACTION"] = "social_action";
    DonationType["SPECIAL_EVENT"] = "special_event";
    DonationType["PLEDGE"] = "pledge";
    DonationType["OTHER"] = "other";
})(DonationType || (exports.DonationType = DonationType = {}));
var RecurringFrequency;
(function (RecurringFrequency) {
    RecurringFrequency["ONE_TIME"] = "one-time";
    RecurringFrequency["WEEKLY"] = "weekly";
    RecurringFrequency["MONTHLY"] = "monthly";
    RecurringFrequency["QUARTERLY"] = "quarterly";
    RecurringFrequency["SEMI_ANNUAL"] = "semi-annual";
    RecurringFrequency["ANNUAL"] = "annual";
})(RecurringFrequency || (exports.RecurringFrequency = RecurringFrequency = {}));
let Donation = class Donation {
    getDisplayAmount() {
        return `$${this.amount.toFixed(2)}`;
    }
    getDonorName() {
        if (this.isAnonymous)
            return 'Anonymous';
        if (this.familyMember)
            return this.familyMember.getFullName();
        if (this.family)
            return this.family.familyName;
        return 'Unknown Donor';
    }
    isThisYear() {
        const currentYear = new Date().getFullYear();
        return new Date(this.donationDate).getFullYear() === currentYear;
    }
    isThisMonth() {
        const today = new Date();
        const donationDate = new Date(this.donationDate);
        return donationDate.getMonth() === today.getMonth() &&
            donationDate.getFullYear() === today.getFullYear();
    }
    getQuarter() {
        const month = new Date(this.donationDate).getMonth();
        return Math.floor(month / 3) + 1;
    }
    isMemorialDonation() {
        return this.donationType === DonationType.MEMORIAL || !!this.honoringMemory;
    }
    requiresReceipt() {
        return this.isTaxDeductible && !this.receiptSent && this.amount >= 250;
    }
    getFormattedDonationType() {
        return this.donationType.replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
};
exports.Donation = Donation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Donation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Donation.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Donation.prototype, "donationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.OTHER }),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], Donation.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DonationType, default: DonationType.GENERAL }),
    (0, class_validator_1.IsEnum)(DonationType),
    __metadata("design:type", String)
], Donation.prototype, "donationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RecurringFrequency, default: RecurringFrequency.ONE_TIME }),
    (0, class_validator_1.IsEnum)(RecurringFrequency),
    __metadata("design:type", String)
], Donation.prototype, "recurringFrequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Donation.prototype, "fundName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Donation.prototype, "isAnonymous", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Donation.prototype, "receiptSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Donation.prototype, "checkNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Donation.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Donation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Donation.prototype, "dedicationMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Donation.prototype, "honoringMemory", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Donation.prototype, "isTaxDeductible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Donation.prototype, "taxDeductibleAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Donation.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Donation.prototype, "recurringStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Donation.prototype, "recurringEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Donation.prototype, "recurringDonationId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Donation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Donation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Family_1.Family, family => family.donations, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyId' }),
    __metadata("design:type", Family_1.Family)
], Donation.prototype, "family", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Donation.prototype, "familyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => FamilyMember_1.FamilyMember, member => member.donations, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyMemberId' }),
    __metadata("design:type", FamilyMember_1.FamilyMember)
], Donation.prototype, "familyMember", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Donation.prototype, "familyMemberId", void 0);
exports.Donation = Donation = __decorate([
    (0, typeorm_1.Entity)('donations')
], Donation);
//# sourceMappingURL=Donation.js.map