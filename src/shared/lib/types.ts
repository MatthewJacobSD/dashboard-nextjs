// Pagination parameters for API requests
export interface PaginationParams {
  page: number;   // Page index (starting at 0)
  limit: number;  // Number of items per page
}

// Response structure for paginated data
export interface PaginatedResponse<T> extends PaginationParams {
  content: T[];         // Data for current page
  totalElements: number; // Total count across all pages
  totalPages: number;    // Total number of pages
  last: boolean;         // Whether this is the last page
}

// Standard API response format
export interface ApiResponse<T, M = PaginationParams> {
  success: boolean;     // Request succeeded?
  message: string;      // Brief description of result
  errorCode?: string;   // Optional error code
  data: T;              // Main payload
  metadata: M;          // Extra info like pagination
  timestamp: string;    // Timestamp of response
}

// Base properties for update operations
export interface BaseUpdateProps {
  isPartial?: boolean;  // True if it's a partial update
}

// Insurance-related props (extends base update props)
export interface InsuranceProps extends BaseUpdateProps {
  isInsured?: boolean;  // Whether the patient has insurance
}

// Doctor specialization options
export const Specialization = {
  Ophthalmology: 'Ophthalmology',
  Oncologists: 'Oncologists',
  Emergency: 'Emergency',
  General: 'General',
  Anaesthetists: 'Anaesthetists',
  IntensiveCare: 'IntensiveCare',
  Cardiology: 'Cardiology',
} as const;

// Type derived from Specialization object
export type Specialization = typeof Specialization[keyof typeof Specialization];

// Doctor experience levels
export const Experience = {
  Novice: 'Novice',
  Junior: 'Junior',
  Senior: 'Senior',
  Expert: 'Expert'
} as const;

// Type derived from Experience object
export type Experience = typeof Experience[keyof typeof Experience];

// Configuration for dynamic form fields
export type FieldConfig<T extends Record<string, unknown>> = {
  name: keyof T;                   // Key in the model
  label: string;                   // Display label
  type: 'text' | 'email' | 'select' | 'checkbox' | 'date'; // Input type
  options?: { value: string; label: string }[]; // Dropdown options
  required?: boolean;              // Is field required?
  placeholder?: string;            // Placeholder text
};

// Generic model with flexible fields
export type Model = {
  id: string | Record<string, string>; // Unique identifier
  [key: string]: unknown;               // Other fields can be any type
};

// Strict model with custom extensions
export type StrictModel<T = Record<string, unknown>> = {
  id: string | Record<string, string>;
} & T;