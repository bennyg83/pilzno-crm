import { Family } from './Family';
import { FamilyMember } from './FamilyMember';
export declare enum EventType {
    BAR_MITZVAH = "bar_mitzvah",
    BAT_MITZVAH = "bat_mitzvah",
    WEDDING = "wedding",
    BABY_NAMING = "baby_naming",
    BRIT_MILAH = "brit_milah",
    YAHRZEIT = "yahrzeit",
    BIRTHDAY = "birthday",
    ANNIVERSARY = "anniversary",
    COMMUNITY = "community",
    HOLIDAY = "holiday",
    SHABBAT = "shabbat",
    OTHER = "other"
}
export declare enum EventStatus {
    PLANNED = "planned",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    POSTPONED = "postponed"
}
export declare enum RecurrenceFrequency {
    NONE = "none",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
    HEBREW_YEARLY = "hebrew_yearly"
}
export declare class Event {
    id: string;
    title: string;
    description?: string;
    eventType: EventType;
    dueDate: Date;
    hebrewDate?: string;
    location?: string;
    status: EventStatus;
    recurrencePattern: RecurrenceFrequency;
    recurrenceEndDate?: Date;
    notes?: string;
    isAllDay: boolean;
    createdAt: Date;
    updatedAt: Date;
    family?: Family;
    familyId?: string;
    familyMember?: FamilyMember;
    familyMemberId?: string;
    isUpcoming(): boolean;
    isPast(): boolean;
    isToday(): boolean;
    isThisWeek(): boolean;
    isThisMonth(): boolean;
    getDisplayTitle(): string;
    isJewishLifecycleEvent(): boolean;
    isRecurring(): boolean;
}
//# sourceMappingURL=Event.d.ts.map