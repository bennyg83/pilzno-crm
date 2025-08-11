import { Family } from './Family';
import { Event } from './Event';
import { Donation } from './Donation';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum RelationshipToHead {
    SELF = "self",
    SPOUSE = "spouse",
    CHILD = "child",
    PARENT = "parent",
    SIBLING = "sibling",
    OTHER = "other"
}
export declare class FamilyMember {
    id: string;
    firstName: string;
    lastName: string;
    hebrewFirstName?: string;
    hebrewLastName?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
    hebrewBirthDate?: string;
    gender?: Gender;
    relationshipToHead: RelationshipToHead;
    isActive: boolean;
    isPrimaryContact: boolean;
    barBatMitzvahDate?: Date;
    hebrewBarBatMitzvahDate?: string;
    isCohen: boolean;
    isLevi: boolean;
    israeliCitizenship: boolean;
    aliyahDate?: Date;
    education?: string;
    profession?: string;
    synagogueRoles?: string;
    skills?: string;
    interests?: string;
    dateOfDeath?: Date;
    hebrewDeathDate?: string;
    memorialInstructions?: string;
    receiveEmails: boolean;
    receiveTexts: boolean;
    emergencyContact: boolean;
    medicalNotes?: string;
    accessibilityNeeds?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    family: Family;
    familyId: string;
    events: Event[];
    donations: Donation[];
    getFullName(): string;
    getHebrewFullName(): string;
    getDisplayName(): string;
    getAge(): number | null;
    isChild(): boolean;
    isTeen(): boolean;
    isAdult(): boolean;
    isSenior(): boolean;
    isBirthdayThisMonth(): boolean;
    isYahrzeitThisMonth(): boolean;
    isUpcomingBarBatMitzvah(): boolean;
    getLifeStage(): string;
    getPriestlyStatus(): string | null;
}
//# sourceMappingURL=FamilyMember.d.ts.map