import { Family } from './Family';
import { FamilyMember } from './FamilyMember';
import { User } from './User';
export declare enum EmailStatus {
    DRAFT = "draft",
    SENT = "sent",
    FAILED = "failed",
    SCHEDULED = "scheduled"
}
export declare enum EmailType {
    PERSONAL = "personal",
    NEWSLETTER = "newsletter",
    EVENT_ANNOUNCEMENT = "event_announcement",
    DONATION_RECEIPT = "donation_receipt",
    MEMBERSHIP = "membership",
    PASTORAL_CARE = "pastoral_care",
    LIFECYCLE_EVENT = "lifecycle_event",
    HOLIDAY_GREETING = "holiday_greeting",
    YAHRZEIT_REMINDER = "yahrzeit_reminder",
    BIRTHDAY_GREETING = "birthday_greeting",
    GENERAL_ANNOUNCEMENT = "general_announcement",
    EMERGENCY = "emergency",
    OTHER = "other"
}
export declare enum Priority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Email {
    id: string;
    subject: string;
    body: string;
    fromEmail: string;
    fromName?: string;
    toEmail: string;
    toName?: string;
    ccEmails?: string;
    bccEmails?: string;
    status: EmailStatus;
    emailType: EmailType;
    priority: Priority;
    sentAt?: Date;
    scheduledFor?: Date;
    isRead: boolean;
    isArchived: boolean;
    isImportant: boolean;
    isHtml: boolean;
    attachments?: string;
    notes?: string;
    errorMessage?: string;
    externalMessageId?: string;
    createdAt: Date;
    updatedAt: Date;
    family?: Family;
    familyId?: string;
    familyMember?: FamilyMember;
    familyMemberId?: string;
    sender?: User;
    sentBy?: string;
    getDisplaySubject(): string;
    getFormattedType(): string;
    getRecipientName(): string;
    isSent(): boolean;
    isFailed(): boolean;
    isScheduled(): boolean;
    isDraft(): boolean;
    isOverdue(): boolean;
    getCcEmailsArray(): string[];
    getBccEmailsArray(): string[];
    getAttachmentsArray(): string[];
    hasAttachments(): boolean;
    getBodyPreview(length?: number): string;
    isJewishLifecycleEmail(): boolean;
    getRelatedEntity(): string;
}
//# sourceMappingURL=Email.d.ts.map