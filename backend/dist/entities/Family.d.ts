import { FamilyTier } from './FamilyTier';
import { FamilyMember } from './FamilyMember';
import { Event } from './Event';
import { Donation } from './Donation';
import { Note } from './Note';
import { Email } from './Email';
export declare enum MembershipStatus {
    MEMBER = "member",
    PROSPECTIVE = "prospective",
    VISITOR = "visitor",
    FORMER = "former"
}
export declare enum FamilyHealth {
    EXCELLENT = "excellent",
    GOOD = "good",
    NEEDS_ATTENTION = "needs-attention",
    AT_RISK = "at-risk"
}
export declare class Family {
    id: string;
    familyName: string;
    hebrewFamilyName?: string;
    primaryEmail?: string;
    secondaryEmail?: string;
    phone?: string;
    emergencyContact?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    membershipStatus: MembershipStatus;
    membershipStartDate?: Date;
    membershipEndDate?: Date;
    annualPledge: number;
    totalDonations: number;
    lastDonationDate?: Date;
    lastContactDate?: Date;
    nextFollowUpDate?: Date;
    familyHealth: FamilyHealth;
    dietaryRestrictions?: string;
    specialNeeds?: string;
    familyNotes?: string;
    receiveNewsletter: boolean;
    receiveEventNotifications: boolean;
    isFoundingFamily: boolean;
    isBoardFamily: boolean;
    createdAt: Date;
    updatedAt: Date;
    familyTier?: FamilyTier;
    familyTierId?: string;
    members: FamilyMember[];
    events: Event[];
    donations: Donation[];
    notes: Note[];
    emails: Email[];
    getDisplayName(): string;
    getFullAddress(): string;
    getMemberCount(): number;
    getChildrenCount(): number;
    getHeadOfHousehold(): FamilyMember | undefined;
    getPrimaryContact(): FamilyMember | undefined;
}
//# sourceMappingURL=Family.d.ts.map