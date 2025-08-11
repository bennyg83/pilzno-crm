// Shared types for the Pilzno CRM application

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface Family {
  id: string
  familyName: string
  hebrewFamilyName?: string
  primaryEmail?: string
  phone?: string
  address?: string
  city?: string
  membershipStatus: 'member' | 'prospective' | 'visitor' | 'former'
  familyHealth: string
  totalDonations: number
  annualPledge: number
  currency: 'USD' | 'NIS'
  isFoundingFamily: boolean
  isBoardFamily: boolean
  memberCount: number
  createdAt: string
}

export interface FamilyMember {
  id: string
  firstName: string
  lastName: string
  hebrewFirstName?: string
  hebrewLastName?: string
  nickname?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  relationshipToHead: string
  isActive: boolean
  isPrimaryContact: boolean
  barBatMitzvahDate?: string
  isCohen: boolean
  isLevi: boolean
  israeliCitizenship: boolean
  education?: string
  profession?: string
  synagogueRoles?: string
  familyId: string
  family?: {
    id: string
    familyName: string
  }
}

export interface FamilyFormData {
  // Basic Information
  familyName: string
  hebrewFamilyName?: string
  membershipStatus: 'member' | 'prospective' | 'visitor' | 'former'
  
  // Contact Information
  primaryEmail?: string
  secondaryEmail?: string
  phone?: string
  emergencyContact?: string
  receiveNewsletter: boolean
  receiveEventNotifications: boolean
  
  // Address Information
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country: string
  
  // Financial Information
  currency: 'USD' | 'NIS'
  annualPledge: number
  membershipStartDate?: string
  membershipEndDate?: string
  
  // Pledges
  pledges: Array<{
    amount: number
    currency: 'USD' | 'NIS'
    description: string
    date: string
  }>
  
  // Special Information
  dietaryRestrictions?: string
  specialNeeds?: string
  familyNotes?: string
  isFoundingFamily: boolean
  isBoardFamily: boolean
}
