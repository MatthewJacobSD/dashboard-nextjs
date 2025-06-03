import { api } from "./axios";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/shared/lib/types";
import { AxiosError } from "axios";

/**
 * 🔁 Generic ApiService with Type-Safe CRUD operations
 *
 * @template T - Entity type (e.g., Doctor, Patient)
 * @template C - Create payload type (defaults to T)
 * @template U - Update payload type (defaults to Partial<T>)
 * @template F - Filter type (defaults to Record<string, unknown>)
 */
class ApiService<T extends Record<string, unknown>, C = T, U = Partial<T>, F = Record<string, unknown>> {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * 📥 Fetch all entities with optional filters and pagination
   */
  fetchAll = async (
    params?: PaginationParams & F
  ): Promise<ApiResponse<PaginatedResponse<T>, PaginationParams>> => {
    try {
      console.log(`📤 [FETCH] Requesting data from "${this.basePath}"`, { params });
      const response = await api.get<
        ApiResponse<PaginatedResponse<T>, PaginationParams>
      >(this.basePath, { params });

      console.log(`📥 [FETCH] Successfully fetched data from "${this.basePath}"`, {
        total: response.data.data?.totalElements ?? response.data.data.content.length,
        page: params?.page ?? 0,
        limit: params?.limit ?? 10,
      });
      return response.data;
    } catch (error: unknown) {
      const errorDetails =
        error instanceof AxiosError
          ? {
              message: error.message,
              status: error.response?.status,
              responseData: error.response?.data as unknown,
              params,
            }
          : {
              message: error instanceof Error ? error.message : "Unknown error",
              status: undefined,
              responseData: undefined,
              params,
            };
      console.error("💥 [FETCH] Failed to fetch data:", errorDetails);
      throw error;
    }
  };

  /**
   * 🧑‍⚕️ Create a new entity
   */
  create = async (payload: C): Promise<ApiResponse<T>> => {
    try {
      console.log(`🆕 [CREATE] Creating new entity at "${this.basePath}"`);
      const response = await api.post<ApiResponse<T>>(this.basePath, payload);
      console.log(`✅ [CREATE] Successfully created entity ID: ${response.data.data.id}`);
      return response.data;
    } catch (error: unknown) {
      const errorDetails =
        error instanceof AxiosError
          ? {
              message: error.message,
              status: error.response?.status,
              responseData: error.response?.data as unknown,
              payload,
            }
          : {
              message: error instanceof Error ? error.message : "Unknown error",
              status: undefined,
              responseData: undefined,
              payload,
            };
      console.error("❌ [CREATE] Failed to create entity:", errorDetails);
      throw error;
    }
  };

  /**
   * 🔍 Get a single entity by ID or composite key
   */
  get = async (
    id: string | Record<string, unknown>
  ): Promise<ApiResponse<T>> => {
    try {
      const idPath =
        typeof id === "string"
          ? id
          : new URLSearchParams(id as Record<string, string>).toString();
      console.log(`🔍 [GET] Fetching entity by ID: "${idPath}"`);
      const response = await api.get<ApiResponse<T>>(
        `${this.basePath}/${idPath}`
      );
      console.log(`📄 [GET] Retrieved entity ID: "${idPath}"`);
      return response.data;
    } catch (error: unknown) {
      const errorDetails =
        error instanceof AxiosError
          ? {
              message: error.message,
              status: error.response?.status,
              responseData: error.response?.data as unknown,
              id,
            }
          : {
              message: error instanceof Error ? error.message : "Unknown error",
              status: undefined,
              responseData: undefined,
              id,
            };
      console.error("🚫 [GET] Failed to retrieve entity:", errorDetails);
      throw error;
    }
  };

  /**
   * 🛠️ Update an existing entity by ID or composite key
   */
  update = async (
    id: string | Record<string, unknown>,
    payload: Omit<U, "id">
  ): Promise<ApiResponse<T>> => {
    try {
      const idPath =
        typeof id === "string"
          ? id
          : new URLSearchParams(id as Record<string, string>).toString();
      console.log(`🔄 [UPDATE] Updating entity ID: "${idPath}"`);
      const response = await api.patch<ApiResponse<T>>(
        `${this.basePath}/${idPath}`,
        payload
      );
      console.log(`✅ [UPDATE] Successfully updated entity ID: "${idPath}"`);
      return response.data;
    } catch (error: unknown) {
      const errorDetails =
        error instanceof AxiosError
          ? {
              message: error.message,
              status: error.response?.status,
              responseData: error.response?.data as unknown,
              id,
              payload,
            }
          : {
              message: error instanceof Error ? error.message : "Unknown error",
              status: undefined,
              responseData: undefined,
              id,
              payload,
            };
      console.error("⚠️ [UPDATE] Failed to update entity:", errorDetails);
      throw error;
    }
  };

  /**
   * 🗑️ Delete an entity by ID or composite key
   */
  delete = async (
    id: string | Record<string, unknown>
  ): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const idPath =
        typeof id === "string"
          ? id
          : new URLSearchParams(id as Record<string, string>).toString();
      console.log(`🗑️ [DELETE] Deleting entity ID: "${idPath}"`);
      const response = await api.delete<ApiResponse<{ deleted: boolean }>>(
        `${this.basePath}/${idPath}`
      );
      console.log(`✅ [DELETE] Successfully deleted entity ID: "${idPath}"`);
      return response.data;
    } catch (error: unknown) {
      const errorDetails =
        error instanceof AxiosError
          ? {
              message: error.message,
              status: error.response?.status,
              responseData: error.response?.data as unknown,
              id,
            }
          : {
              message: error instanceof Error ? error.message : "Unknown error",
              status: undefined,
              responseData: undefined,
              id,
            };
      console.error("❌ [DELETE] Failed to delete entity:", errorDetails);
      throw error;
    }
  };
}

export default ApiService;