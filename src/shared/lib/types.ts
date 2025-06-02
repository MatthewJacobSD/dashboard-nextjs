// Pagination props used in API requests
export interface PaginationParams {
    page: number;
    limit: number;
}

// Generic interface response for paginated structure
export interface PaginatedResponse<T> extends PaginationParams {
    data: T[]; // Data for the existing page
    totalElements: number; // Total Count across all pages
    totalPages: number; // Total number of pages
    last: boolean; // Is this the last page?
}

// Generic API Response structure based on Spring Boot utils
export interface ApiResponse<T, M = PaginationParams> {
    success: boolean; // Success status
    message: string; // Message
    errorCode?: string; // Optional error code
    data: T; // Data
    metadata: M; // Metadata
    timestamp: string; // Timestamp
}

// Base Props for updates
export interface BaseUpdateProps {
    isPartial?: boolean; // Is this a partial update?
}

// Insurance props
export interface InsuranceProps extends BaseUpdateProps {
    isInsured?: boolean; // Is the patient insured?
}

// Doctor Specialization (pick one)
export const Specialization = {
  Ophthalmology: 'Ophthalmology',
  Oncologists: 'Oncologists',
  Emergency: 'Emergency',
  General: 'General',
  Anaesthetists: 'Anaesthetists',
  IntensiveCare: 'IntensiveCare',
  Cardiology: 'Cardiology',
} as const;

export type Specialization = typeof Specialization[keyof typeof Specialization];

// Doctor Knowledge Experience Level
export const Experience = {
    Novice: 'Novice', 
    Junior: 'Junior', 
    Senior: 'Senior',
    Expert: 'Expert'
} as const;

export type Experience = typeof Experience[keyof typeof Experience];

// Generic field configuration for forms
export type FieldConfig<T extends Record<string, unknown>> = {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'select' | 'checkbox' | 'date';
  options?: { value: string; label: string }[]; // For select fields
  required?: boolean;
  placeholder?: string;
};

// Generic model type (safer version with unknown)
export type Model = {
  id: string | Record<string, string>; // String ID or composite key
  [key: string]: unknown; // All other fields must be explicitly typed
};

// Example of a more strictly typed alternative:
export type StrictModel<T = Record<string, unknown>> = {
  id: string | Record<string, string>;
} & T;