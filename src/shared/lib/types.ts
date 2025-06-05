//. ---- Pagination Types ----
/**
 * Pagination request parameters
 * @property {number} page - Current page number (1-based index)
 * @property {number} limit - Number of items per page
 */
export interface IPaginationRequest {
  page: number;
  limit: number;
}

/**
 * Paginated response structure
 * @template T - Type of items in the response
 * @extends IPaginationRequest
 */
export interface IPaginationResponse<T> extends IPaginationRequest {
  /** Array of items for the current page */
  items: T[];
  /** Total number of items across all pages */
  totalItems: number;
  /** Total number of pages available */
  totalPages: number;
  /** Indicates if this is the last page */
  isLastPage: boolean;
}

//. ---- API Response Types ----
/**
 * Standardized API status information
 */
interface IResponseStatus {
  /** HTTP status code */
  code: number;
  /** Brief status message */
  message: string;
  /** Response type classification */
  type: 'success' | 'error' | 'warning';
}

/**
 * Standardized API response format
 * @template T - Type of the main response data
 * @template M - Type of metadata (defaults to IPaginationRequest)
 * @template U - Type of status information (defaults to IResponseStatus)
 */
export interface IApiResponse<T, M = IPaginationRequest, U = IResponseStatus> {
  /** Indicates if the request was successful */
  success: boolean;
  /** Detailed status information */
  status: U;
  /** Human-readable message */
  message: string;
  /** The primary response payload */
  data: T;
  /** Additional metadata (often pagination info) */
  metadata: M;
  /** ISO-8601 timestamp of when the response was generated */
  timestamp: string;
}

// ====== Type Utilities ======
/**
 * Creates a type for error responses with optional error details
 */
export interface IErrorResponse<T = unknown> extends IApiResponse<T> {
  success: false;
  status: {
    code: number;
    message: string;
    type: 'error';
    details?: Record<string, unknown>;
  };
}

/**
 * Creates a type for success responses with optional metadata
 */
export interface ISuccessResponse<T, M = IPaginationRequest> extends IApiResponse<T, M> {
  success: true;
  status: {
    code: number;
    message: string;
    type: 'success';
  };
}