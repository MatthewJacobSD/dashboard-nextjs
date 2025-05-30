// 🔢 Pagination parameters used in API requests
export interface PaginationParams {
  page: number // Current page number
  size: number // Number of items per page
}

// 📦 Generic paginated response structure
export interface PaginatedResponse<T> {
  content: T[] // Items on the current page
  page: number // Current page index
  size: number // Number of items per page
  totalElements: number // Total count across all pages
  totalPages: number // Total number of pages
  last: boolean // Whether this is the last page
}

// 📡 Standard API response format
export interface ApiResponse<T, M = PaginationParams> {
  success: boolean // Was the request successful?
  message: string // Status or error message
  errorCode?: string // Optional error code
  data: T // Main payload
  metadata: M // Additional info like pagination
  timestamp: string // ISO date-time string
}

// 🧑‍⚕️ Basic props for components — extend as needed
export interface BaseProps {
  isPartial?: boolean // Optional flag for partial rendering/data
}

// 🏥 Extended props with insurance flag
export interface PropsWithInsurance extends BaseProps {
  isInsured?: boolean // Is the patient insured?
}

// 🩺 Doctor specializations (pick one)
export const SpecializationList = {
  Ophthalmology : 'Ophthalmology',
  Oncologists : 'Oncologists',
  Emergency : 'Emergency',
  General : 'General',
  Anaesthetists : 'Anaesthetists',
  IntensiveCare : 'IntensiveCare',
  Cardiology : 'Cardiology',
} as const

export type Specialization = (typeof SpecializationList)

// 🎓 Experience levels (Novice -> Senior)
export const ExperienceLevelList = {
    Novice: 'Novice', 
    Junior: 'Junior', 
    Senior: 'Senior',
    Expert: 'Expert'
} as const

export type ExperienceLevel = (typeof ExperienceLevelList)