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
exports.FamilyTier = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Family_1 = require("./Family");
let FamilyTier = class FamilyTier {
};
exports.FamilyTier = FamilyTier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FamilyTier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyTier.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyTier.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FamilyTier.prototype, "minimumDonation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyTier.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FamilyTier.prototype, "priorityLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], FamilyTier.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FamilyTier.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FamilyTier.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Family_1.Family, family => family.familyTier),
    __metadata("design:type", Array)
], FamilyTier.prototype, "families", void 0);
exports.FamilyTier = FamilyTier = __decorate([
    (0, typeorm_1.Entity)('family_tiers')
], FamilyTier);
//# sourceMappingURL=FamilyTier.js.map