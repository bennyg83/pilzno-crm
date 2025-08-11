import { Family } from './Family';
import { FamilyMember } from './FamilyMember';
export declare enum PaymentMethod {
    CASH = "cash",
    CHECK = "check",
    CREDIT_CARD = "credit_card",
    BANK_TRANSFER = "bank_transfer",
    ONLINE = "online",
    PAYPAL = "paypal",
    VENMO = "venmo",
    ZELLE = "zelle",
    OTHER = "other"
}
export declare enum DonationType {
    GENERAL = "general",
    BUILDING = "building",
    TORAH = "torah",
    MEMORIAL = "memorial",
    HOLIDAY = "holiday",
    EDUCATION = "education",
    YOUTH = "youth",
    SECURITY = "security",
    SOCIAL_ACTION = "social_action",
    SPECIAL_EVENT = "special_event",
    PLEDGE = "pledge",
    OTHER = "other"
}
export declare enum RecurringFrequency {
    ONE_TIME = "one-time",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi-annual",
    ANNUAL = "annual"
}
export declare class Donation {
    id: string;
    amount: number;
    donationDate: Date;
    paymentMethod: PaymentMethod;
    donationType: DonationType;
    recurringFrequency: RecurringFrequency;
    fundName?: string;
    isAnonymous: boolean;
    receiptSent: boolean;
    checkNumber?: string;
    transactionId?: string;
    notes?: string;
    dedicationMessage?: string;
    honoringMemory?: string;
    isTaxDeductible: boolean;
    taxDeductibleAmount?: number;
    isRecurring: boolean;
    recurringStartDate?: Date;
    recurringEndDate?: Date;
    recurringDonationId?: string;
    createdAt: Date;
    updatedAt: Date;
    family?: Family;
    familyId?: string;
    familyMember?: FamilyMember;
    familyMemberId?: string;
    getDisplayAmount(): string;
    getDonorName(): string;
    isThisYear(): boolean;
    isThisMonth(): boolean;
    getQuarter(): number;
    isMemorialDonation(): boolean;
    requiresReceipt(): boolean;
    getFormattedDonationType(): string;
}
//# sourceMappingURL=Donation.d.ts.map