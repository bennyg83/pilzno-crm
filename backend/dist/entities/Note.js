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
exports.Note = exports.Priority = exports.NoteType = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Family_1 = require("./Family");
const FamilyMember_1 = require("./FamilyMember");
const User_1 = require("./User");
var NoteType;
(function (NoteType) {
    NoteType["GENERAL"] = "general";
    NoteType["PHONE_CALL"] = "phone_call";
    NoteType["MEETING"] = "meeting";
    NoteType["EMAIL"] = "email";
    NoteType["FOLLOW_UP"] = "follow_up";
    NoteType["PASTORAL_CARE"] = "pastoral_care";
    NoteType["MEMBERSHIP"] = "membership";
    NoteType["LIFECYCLE_EVENT"] = "lifecycle_event";
    NoteType["DONATION"] = "donation";
    NoteType["VOLUNTEER"] = "volunteer";
    NoteType["EDUCATION"] = "education";
    NoteType["YOUTH"] = "youth";
    NoteType["COMMITTEE"] = "committee";
    NoteType["BOARD"] = "board";
    NoteType["SECURITY"] = "security";
    NoteType["FACILITIES"] = "facilities";
    NoteType["COMPLAINT"] = "complaint";
    NoteType["COMPLIMENT"] = "compliment";
    NoteType["YAHRZEIT"] = "yahrzeit";
    NoteType["SHIVA"] = "shiva";
    NoteType["SIMCHA"] = "simcha";
    NoteType["OTHER"] = "other";
})(NoteType || (exports.NoteType = NoteType = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MEDIUM"] = "medium";
    Priority["HIGH"] = "high";
    Priority["URGENT"] = "urgent";
})(Priority || (exports.Priority = Priority = {}));
let Note = class Note {
    getDisplayTitle() {
        return this.title || `${this.getFormattedType()} Note`;
    }
    getFormattedType() {
        return this.type.replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    getRelatedEntity() {
        if (this.family)
            return `Family: ${this.family.familyName}`;
        if (this.familyMember)
            return `Member: ${this.familyMember.getFullName()}`;
        if (this.accountId)
            return `Account: ${this.accountId}`;
        if (this.contactId)
            return `Contact: ${this.contactId}`;
        return 'General Note';
    }
    isOverdue() {
        if (!this.requiresFollowUp || !this.followUpDate)
            return false;
        return new Date(this.followUpDate) < new Date();
    }
    isDueToday() {
        if (!this.requiresFollowUp || !this.followUpDate)
            return false;
        const today = new Date();
        const followUp = new Date(this.followUpDate);
        return followUp.toDateString() === today.toDateString();
    }
    isDueSoon() {
        if (!this.requiresFollowUp || !this.followUpDate)
            return false;
        const today = new Date();
        const followUp = new Date(this.followUpDate);
        const daysDiff = Math.ceil((followUp.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysDiff >= 0 && daysDiff <= 7;
    }
    getTagsArray() {
        return this.tags ? this.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    }
    hasTag(tag) {
        return this.getTagsArray().includes(tag);
    }
    isSynagogueSpecific() {
        const synagogueTypes = [
            NoteType.PASTORAL_CARE,
            NoteType.MEMBERSHIP,
            NoteType.LIFECYCLE_EVENT,
            NoteType.DONATION,
            NoteType.VOLUNTEER,
            NoteType.EDUCATION,
            NoteType.YOUTH,
            NoteType.COMMITTEE,
            NoteType.BOARD,
            NoteType.YAHRZEIT,
            NoteType.SHIVA,
            NoteType.SIMCHA
        ];
        return synagogueTypes.includes(this.type);
    }
};
exports.Note = Note;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Note.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Note.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Note.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NoteType, default: NoteType.GENERAL }),
    (0, class_validator_1.IsEnum)(NoteType),
    __metadata("design:type", String)
], Note.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Priority, default: Priority.MEDIUM }),
    (0, class_validator_1.IsEnum)(Priority),
    __metadata("design:type", String)
], Note.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Note.prototype, "isPrivate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Note.prototype, "requiresFollowUp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], Note.prototype, "followUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Note.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Note.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Note.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Note.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Note.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Family_1.Family, family => family.notes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyId' }),
    __metadata("design:type", Family_1.Family)
], Note.prototype, "family", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Note.prototype, "familyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => FamilyMember_1.FamilyMember, member => member, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyMemberId' }),
    __metadata("design:type", FamilyMember_1.FamilyMember)
], Note.prototype, "familyMember", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Note.prototype, "familyMemberId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'createdBy' }),
    __metadata("design:type", User_1.User)
], Note.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Note.prototype, "createdBy", void 0);
exports.Note = Note = __decorate([
    (0, typeorm_1.Entity)('notes')
], Note);
//# sourceMappingURL=Note.js.map