import { axiosInstance } from "./axios";
import type {
  IApiResponse,
  IPaginationRequest,
  IPaginationResponse,
  IErrorResponse,
} from "@/shared/lib/types";
import { isAxiosError } from "axios";
import chalk from "chalk";

//. ---- Emoji Constants ----
const EMOJI = {
  STATE: {
    ERROR: "🔴",      // Red circle for errors
    PROCESSING: "⚡",  // Lightning bolt for operations
    DEBUG: "🐛",      // Bug for debug information
    SUCCESS: "🟢",    // Green circle for success
    WARNING: "♨️",    // Hot springs for warnings
    CRITICAL: "🔥",   // Fire for critical errors
    ALERT: "❗",      // Exclamation mark for alerts
  },
  DATA: {
    PAYLOAD: "📦",    // Package for request payloads
    ID: "🪳",         // Cockroach for IDs
    TIMESTAMP: "🕒",  // Clock for timestamps
  },
  OPERATION: {
    FETCH: "🔍",      // Magnifying glass for fetch
    GET: "📋",        // Clipboard for get
    CREATE: "🆕",     // New button for create
    UPDATE: "♻️",     // Recycling symbol for update
    DELETE: "🗑️",     // Trash can for delete
  }
} as const;

//. ---- API Service Class ----
/**
 * Typed HTTP client for REST API operations with structured logging
 * @template T - Entity type shape
 * @template C - Create payload type (defaults to T)
 * @template U - Update payload type (defaults to Partial<T>)
 * @template F - Filter type for queries (defaults to Record<string, unknown>)
 */
export class ApiService<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = T,
  U extends Record<string, unknown> = Partial<T>,
  F extends Record<string, unknown> = Record<string, unknown>,
> {
  private readonly path: string;

  //. ---- Constructor ----
  /**
   * Creates API service instance for specific endpoint
   * @param path - API endpoint path (auto-normalized with leading slash)
   * @throws {Error} When empty path provided
   */
  constructor(path: string) {
    if (!path.trim()) throw new Error("API path cannot be empty");
    this.path = path.startsWith("/") ? path : `/${path}`;
  }

  // ====== Private Methods ======

  /**
   * Normalizes ID to URL-safe string format
   * @param id - Entity identifier (string or composite key object)
   * @returns Encoded string representation
   */
  private normalizeId(id: string | Record<string, unknown>): string {
    if (typeof id === "string") return encodeURIComponent(id);
    
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(id)) {
      if (value !== undefined) params.append(key, String(value));
    }
    return params.toString();
  }

  /**
   * Logs operation initiation with parameters
   * @param operation - CRUD operation type
   * @param details - Contextual information
   */
  private logOperationStart(
    operation: keyof typeof EMOJI.OPERATION, 
    details: string
  ) {
    console.log(
      chalk.blueBright.bold(
        `${EMOJI.STATE.PROCESSING} ${EMOJI.OPERATION[operation]} ${operation.toUpperCase()}`
      ) + `\n` +
      chalk.gray(`  Endpoint: ${this.path}${details ? `/${details}` : ''}`)
    );
  }

  /**
   * Logs successful operation completion
   * @param operation - Operation type
   * @param response - API response data
   * @param context - Additional debug context
   */
  private logSuccess<D>(
    operation: string,
    response: IApiResponse<D>,
    context?: Record<string, unknown>
  ): void {
    console.log([
      chalk.green.bold(`${EMOJI.STATE.SUCCESS} ${operation.toUpperCase()} SUCCESS`),
      chalk.blue(`  ${EMOJI.DATA.TIMESTAMP} ${response.timestamp}`),
      chalk.blue(`  Status: ${response.status.code} (${response.status.type})`),
      chalk.blue(`  Message: ${response.message}`),
      ...(context ? [
        chalk.yellow(`${EMOJI.STATE.DEBUG} Context:`),
        ...Object.entries(context).map(([k, v]) => 
          chalk.gray(`    ${k}: ${JSON.stringify(v)}`)
        )
      ] : [])
    ].join('\n'));
  }

  /**
   * Logs operation failure with diagnostics
   * @param operation - Failed operation type
   * @param error - Error object
   * @param context - Additional debug context
   */
  private logError(
    operation: string,
    error: unknown,
    context?: Record<string, unknown>
  ): void {
    const errorDetails = isAxiosError(error)
      ? {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
          code: error.code
        }
      : error instanceof Error
      ? { message: error.message }
      : { message: "Unknown error" };

    const isCritical = errorDetails.status && errorDetails.status >= 500;
    
    console.error([
      isCritical 
        ? chalk.red.bold(`${EMOJI.STATE.CRITICAL} ${operation.toUpperCase()} FAILURE`) 
        : chalk.red.bold(`${EMOJI.STATE.ERROR} ${operation.toUpperCase()} ERROR`),
      chalk.yellow(`  ${EMOJI.STATE.WARNING} ${errorDetails.message}`),
      ...(errorDetails.status ? [chalk.gray(`  Status: ${errorDetails.status}`)] : []),
      ...(context ? [
        chalk.yellow(`  ${EMOJI.STATE.DEBUG} Context:`),
        ...Object.entries(context).map(([k, v]) => 
          chalk.gray(`    ${k}: ${JSON.stringify(v)}`)
        )
      ] : []),
      ...(errorDetails.data ? [
        chalk.yellow(`  ${EMOJI.STATE.ALERT} Response:`),
        chalk.gray(`    ${JSON.stringify(errorDetails.data, null, 2)}`)
      ] : [])
    ].join('\n'));
  }

  // ====== Public CRUD Methods ======

  /**
   * Fetches paginated entity list with optional filters
   * @param params - Pagination and filtering parameters
   * @returns Paginated response data
   * @throws {IErrorResponse} On API failure
   */
  async fetchAll(
    params?: IPaginationRequest & F
  ): Promise<IApiResponse<IPaginationResponse<T>>> {
    this.logOperationStart('FETCH', '');
    console.log(chalk.gray(`  ${EMOJI.DATA.PAYLOAD} Params:\n    ${JSON.stringify(params, null, 2)}`));

    try {
      const { data } = await axiosInstance.get<
        IApiResponse<IPaginationResponse<T>>
      >(this.path, { params });

      this.logSuccess("fetch", data, {
        page: data.metadata.page,
        totalItems: data.data.totalItems,
      });
      return data;
    } catch (error) {
      this.logError("fetch", error, { params });
      throw this.normalizeError(error);
    }
  }

  /**
   * Retrieves single entity by identifier
   * @param id - Entity ID (string or composite key)
   * @returns Entity data
   * @throws {IErrorResponse} If entity not found
   */
  async fetchById(
    id: string | Record<string, unknown>
  ): Promise<IApiResponse<T>> {
    const pathId = this.normalizeId(id);
    this.logOperationStart('GET', pathId);

    try {
      const { data } = await axiosInstance.get<IApiResponse<T>>(
        `${this.path}/${pathId}`
      );
      
      this.logSuccess("get", data, { id: pathId });
      return data;
    } catch (error) {
      this.logError("get", error, { id: pathId });
      throw this.normalizeError(error);
    }
  }

  /**
   * Creates new entity
   * @param payload - Entity creation data
   * @returns Created entity
   * @throws {IErrorResponse} On validation failure
   */
  async create(payload: C): Promise<IApiResponse<T>> {
    this.logOperationStart('CREATE', '');
    console.log(chalk.gray(`  ${EMOJI.DATA.PAYLOAD} Payload:\n    ${JSON.stringify(payload, null, 2)}`));

    try {
      const { data } = await axiosInstance.post<IApiResponse<T>>(
        this.path, 
        payload
      );
      
      this.logSuccess("create", data, {
        createdId: (data.data as Record<string, unknown>)?.id,
      });
      return data;
    } catch (error) {
      this.logError("create", error, { payload });
      throw this.normalizeError(error);
    }
  }

  /**
   * Updates existing entity
   * @param id - Entity identifier
   * @param payload - Partial update data
   * @returns Updated entity
   * @throws {IErrorResponse} If update fails
   */
  async update(
    id: string | Record<string, unknown>,
    payload: U
  ): Promise<IApiResponse<T>> {
    const pathId = this.normalizeId(id);
    this.logOperationStart('UPDATE', pathId);
    console.log(chalk.gray(`  ${EMOJI.DATA.PAYLOAD} Payload:\n    ${JSON.stringify(payload, null, 2)}`));

    try {
      const { data } = await axiosInstance.patch<IApiResponse<T>>(
        `${this.path}/${pathId}`,
        payload
      );
      
      this.logSuccess("update", data, { updatedId: pathId });
      return data;
    } catch (error) {
      this.logError("update", error, { id: pathId, payload });
      throw this.normalizeError(error);
    }
  }

  /**
   * Removes entity by identifier
   * @param id - Entity ID to delete
   * @returns Deletion confirmation
   * @throws {IErrorResponse} If deletion fails
   */
  async delete(
    id: string | Record<string, unknown>
  ): Promise<IApiResponse<{ deleted: boolean }>> {
    const pathId = this.normalizeId(id);
    this.logOperationStart('DELETE', pathId);

    try {
      const { data } = await axiosInstance.delete<
        IApiResponse<{ deleted: boolean }>
      >(`${this.path}/${pathId}`);
      
      this.logSuccess("delete", data, { deletedId: pathId });
      return data;
    } catch (error) {
      this.logError("delete", error, { id: pathId });
      throw this.normalizeError(error);
    }
  }

  /**
   * Standardizes API errors to consistent format
   * @param error - Raw error object
   * @returns Normalized error response
   */
  private normalizeError(error: unknown): IErrorResponse {
    if (isAxiosError(error)) {
      return {
        success: false,
        status: {
          code: error.response?.status || 500,
          message: error.response?.data?.message || error.message,
          type: 'error',
          details: error.response?.data?.details
        },
        message: error.message,
        data: null,
        metadata: { limit: 10, page: 1},
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: false,
      status: {
        code: 500,
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'error'
      },
      message: 'Internal client error',
      data: null,
      metadata: {limit: 10, page: 1},
      timestamp: new Date().toISOString()
    };
  }
}