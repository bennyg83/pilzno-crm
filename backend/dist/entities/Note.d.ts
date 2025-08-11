import { Family } from './Family';
import { FamilyMember } from './FamilyMember';
import { User } from './User';
export declare enum NoteType {
    GENERAL = "general",
    PHONE_CALL = "phone_call",
    MEETING = "meeting",
    EMAIL = "email",
    FOLLOW_UP = "follow_up",
    PASTORAL_CARE = "pastoral_care",
    MEMBERSHIP = "membership",
    LIFECYCLE_EVENT = "lifecycle_event",
    DONATION = "donation",
    VOLUNTEER = "volunteer",
    EDUCATION = "education",
    YOUTH = "youth",
    COMMITTEE = "committee",
    BOARD = "board",
    SECURITY = "security",
    FACILITIES = "facilities",
    COMPLAINT = "complaint",
    COMPLIMENT = "compliment",
    YAHRZEIT = "yahrzeit",
    SHIVA = "shiva",
    SIMCHA = "simcha",
    OTHER = "other"
}
export declare enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Note {
    id: string;
    title: string;
    content: string;
    type: NoteType;
    priority: Priority;
    isPrivate: boolean;
    requiresFollowUp: boolean;
    followUpDate?: Date;
    tags?: string;
    createdAt: Date;
    updatedAt: Date;
    accountId?: string;
    contactId?: string;
    family?: Family;
    familyId?: string;
    familyMember?: FamilyMember;
    familyMemberId?: string;
    author?: User;
    createdBy?: string;
    getDisplayTitle(): string;
    getFormattedType(): string;
    getRelatedEntity(): string;
    isOverdue(): boolean;
    isDueToday(): boolean;
    isDueSoon(): boolean;
    getTagsArray(): string[];
    hasTag(tag: string): boolean;
    isSynagogueSpecific(): boolean;
}
//# sourceMappingURL=Note.d.ts.map