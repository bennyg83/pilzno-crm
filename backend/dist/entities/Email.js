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
exports.Email = exports.Priority = exports.EmailType = exports.EmailStatus = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Family_1 = require("./Family");
const FamilyMember_1 = require("./FamilyMember");
const User_1 = require("./User");
var EmailStatus;
(function (EmailStatus) {
    EmailStatus["DRAFT"] = "draft";
    EmailStatus["SENT"] = "sent";
    EmailStatus["FAILED"] = "failed";
    EmailStatus["SCHEDULED"] = "scheduled";
})(EmailStatus || (exports.EmailStatus = EmailStatus = {}));
var EmailType;
(function (EmailType) {
    EmailType["PERSONAL"] = "personal";
    EmailType["NEWSLETTER"] = "newsletter";
    EmailType["EVENT_ANNOUNCEMENT"] = "event_announcement";
    EmailType["DONATION_RECEIPT"] = "donation_receipt";
    EmailType["MEMBERSHIP"] = "membership";
    EmailType["PASTORAL_CARE"] = "pastoral_care";
    EmailType["LIFECYCLE_EVENT"] = "lifecycle_event";
    EmailType["HOLIDAY_GREETING"] = "holiday_greeting";
    EmailType["YAHRZEIT_REMINDER"] = "yahrzeit_reminder";
    EmailType["BIRTHDAY_GREETING"] = "birthday_greeting";
    EmailType["GENERAL_ANNOUNCEMENT"] = "general_announcement";
    EmailType["EMERGENCY"] = "emergency";
    EmailType["OTHER"] = "other";
})(EmailType || (exports.EmailType = EmailType = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["NORMAL"] = "normal";
    Priority["HIGH"] = "high";
    Priority["URGENT"] = "urgent";
})(Priority || (exports.Priority = Priority = {}));
let Email = class Email {
    getDisplaySubject() {
        if (this.priority === Priority.URGENT)
            return `[URGENT] ${this.subject}`;
        if (this.priority === Priority.HIGH)
            return `[HIGH] ${this.subject}`;
        return this.subject;
    }
    getFormattedType() {
        return this.emailType.replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    getRecipientName() {
        if (this.toName)
            return this.toName;
        if (this.familyMember)
            return this.familyMember.getFullName();
        if (this.family)
            return this.family.familyName;
        return this.toEmail;
    }
    isSent() {
        return this.status === EmailStatus.SENT;
    }
    isFailed() {
        return this.status === EmailStatus.FAILED;
    }
    isScheduled() {
        return this.status === EmailStatus.SCHEDULED;
    }
    isDraft() {
        return this.status === EmailStatus.DRAFT;
    }
    isOverdue() {
        if (!this.scheduledFor || this.status !== EmailStatus.SCHEDULED)
            return false;
        return new Date(this.scheduledFor) < new Date();
    }
    getCcEmailsArray() {
        return this.ccEmails ? this.ccEmails.split(',').map(email => email.trim()).filter(Boolean) : [];
    }
    getBccEmailsArray() {
        return this.bccEmails ? this.bccEmails.split(',').map(email => email.trim()).filter(Boolean) : [];
    }
    getAttachmentsArray() {
        return this.attachments ? this.attachments.split(',').map(attachment => attachment.trim()).filter(Boolean) : [];
    }
    hasAttachments() {
        return this.getAttachmentsArray().length > 0;
    }
    getBodyPreview(length = 100) {
        if (this.isHtml) {
            const textBody = this.body.replace(/<[^>]*>/g, '');
            return textBody.length > length ? `${textBody.substring(0, length)}...` : textBody;
        }
        return this.body.length > length ? `${this.body.substring(0, length)}...` : this.body;
    }
    isJewishLifecycleEmail() {
        return [
            EmailType.LIFECYCLE_EVENT,
            EmailType.YAHRZEIT_REMINDER,
            EmailType.HOLIDAY_GREETING,
            EmailType.BIRTHDAY_GREETING,
            EmailType.PASTORAL_CARE
        ].includes(this.emailType);
    }
    getRelatedEntity() {
        if (this.family)
            return `Family: ${this.family.familyName}`;
        if (this.familyMember)
            return `Member: ${this.familyMember.getFullName()}`;
        return 'General Email';
    }
};
exports.Email = Email;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Email.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Email.prototype, "fromEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "fromName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Email.prototype, "toEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "toName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "ccEmails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "bccEmails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EmailStatus, default: EmailStatus.DRAFT }),
    (0, class_validator_1.IsEnum)(EmailStatus),
    __metadata("design:type", String)
], Email.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EmailType, default: EmailType.OTHER }),
    (0, class_validator_1.IsEnum)(EmailType),
    __metadata("design:type", String)
], Email.prototype, "emailType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Priority, default: Priority.NORMAL }),
    (0, class_validator_1.IsEnum)(Priority),
    __metadata("design:type", String)
], Email.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Email.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Email.prototype, "scheduledFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Email.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Email.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Email.prototype, "isImportant", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Email.prototype, "isHtml", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Email.prototype, "externalMessageId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Email.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Email.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Family_1.Family, family => family.emails, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyId' }),
    __metadata("design:type", Family_1.Family)
], Email.prototype, "family", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Email.prototype, "familyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => FamilyMember_1.FamilyMember, member => member, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyMemberId' }),
    __metadata("design:type", FamilyMember_1.FamilyMember)
], Email.prototype, "familyMember", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Email.prototype, "familyMemberId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sentBy' }),
    __metadata("design:type", User_1.User)
], Email.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Email.prototype, "sentBy", void 0);
exports.Email = Email = __decorate([
    (0, typeorm_1.Entity)('emails')
], Email);
//# sourceMappingURL=Email.js.map