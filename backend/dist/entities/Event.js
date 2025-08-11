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
exports.Event = exports.RecurrenceFrequency = exports.EventStatus = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Family_1 = require("./Family");
const FamilyMember_1 = require("./FamilyMember");
var EventType;
(function (EventType) {
    EventType["BAR_MITZVAH"] = "bar_mitzvah";
    EventType["BAT_MITZVAH"] = "bat_mitzvah";
    EventType["WEDDING"] = "wedding";
    EventType["BABY_NAMING"] = "baby_naming";
    EventType["BRIT_MILAH"] = "brit_milah";
    EventType["YAHRZEIT"] = "yahrzeit";
    EventType["BIRTHDAY"] = "birthday";
    EventType["ANNIVERSARY"] = "anniversary";
    EventType["COMMUNITY"] = "community";
    EventType["HOLIDAY"] = "holiday";
    EventType["SHABBAT"] = "shabbat";
    EventType["OTHER"] = "other";
})(EventType || (exports.EventType = EventType = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["PLANNED"] = "planned";
    EventStatus["CONFIRMED"] = "confirmed";
    EventStatus["IN_PROGRESS"] = "in_progress";
    EventStatus["COMPLETED"] = "completed";
    EventStatus["CANCELLED"] = "cancelled";
    EventStatus["POSTPONED"] = "postponed";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["NONE"] = "none";
    RecurrenceFrequency["DAILY"] = "daily";
    RecurrenceFrequency["WEEKLY"] = "weekly";
    RecurrenceFrequency["MONTHLY"] = "monthly";
    RecurrenceFrequency["YEARLY"] = "yearly";
    RecurrenceFrequency["HEBREW_YEARLY"] = "hebrew_yearly";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
let Event = class Event {
    isUpcoming() {
        return this.dueDate > new Date() && this.status !== EventStatus.COMPLETED;
    }
    isPast() {
        return this.dueDate < new Date();
    }
    isToday() {
        const today = new Date();
        const eventDate = new Date(this.dueDate);
        return eventDate.toDateString() === today.toDateString();
    }
    isThisWeek() {
        const today = new Date();
        const eventDate = new Date(this.dueDate);
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return eventDate >= weekStart && eventDate <= weekEnd;
    }
    isThisMonth() {
        const today = new Date();
        const eventDate = new Date(this.dueDate);
        return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
    }
    getDisplayTitle() {
        return this.hebrewDate ? `${this.title} (${this.hebrewDate})` : this.title;
    }
    isJewishLifecycleEvent() {
        return [
            EventType.BAR_MITZVAH,
            EventType.BAT_MITZVAH,
            EventType.WEDDING,
            EventType.BABY_NAMING,
            EventType.BRIT_MILAH,
            EventType.YAHRZEIT
        ].includes(this.eventType);
    }
    isRecurring() {
        return this.recurrencePattern !== RecurrenceFrequency.NONE;
    }
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventType, default: EventType.OTHER }),
    (0, class_validator_1.IsEnum)(EventType),
    __metadata("design:type", String)
], Event.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], Event.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Event.prototype, "hebrewDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventStatus, default: EventStatus.PLANNED }),
    (0, class_validator_1.IsEnum)(EventStatus),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RecurrenceFrequency, default: RecurrenceFrequency.NONE }),
    (0, class_validator_1.IsEnum)(RecurrenceFrequency),
    __metadata("design:type", String)
], Event.prototype, "recurrencePattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], Event.prototype, "recurrenceEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Event.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isAllDay", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Family_1.Family, family => family.events, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyId' }),
    __metadata("design:type", Family_1.Family)
], Event.prototype, "family", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "familyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => FamilyMember_1.FamilyMember, member => member.events, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'familyMemberId' }),
    __metadata("design:type", FamilyMember_1.FamilyMember)
], Event.prototype, "familyMember", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "familyMemberId", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=Event.js.map