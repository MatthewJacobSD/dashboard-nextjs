import { api } from "./axios";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/shared/lib/types";
import { AxiosError } from "axios";

/**
 * 🔁 Generic ApiService with Type-Safe CRUD operations
 * @template T - Entity type
 * @template C - Create payload type (defaults to T)
 * @template U - Update payload type (defaults to Partial<T>)
 * @template F - Filter type (defaults to Record<string, unknown>)
 */
class ApiService<T extends Record<string, unknown>, C = T, U = Partial<T>, F = Record<string, unknown>> {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  fetchAll = async (
    params?: PaginationParams & F
  ): Promise<ApiResponse<PaginatedResponse<T>, PaginationParams>> => {
    try {
      console.log("📤 Fetching all:", { basePath: this.basePath, params });
      const response = await api.get<
        ApiResponse<PaginatedResponse<T>, PaginationParams>
      >(this.basePath, { params });
      console.log("📥 Fetched all:", response.data);
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
      console.error("💥 Fetch all error:", errorDetails);
      throw error;
    }
  };

  create = async (payload: C): Promise<ApiResponse<T>> => {
    try {
      console.log("📤 Creating:", payload);
      const response = await api.post<ApiResponse<T>>(this.basePath, payload);
      console.log("📥 Created:", response.data);
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
      console.error("💥 Create error:", errorDetails);
      throw error;
    }
  };

  get = async (
    id: string | Record<string, unknown>
  ): Promise<ApiResponse<T>> => {
    try {
      const idPath =
        typeof id === "string"
          ? id
          : new URLSearchParams(id as Record<string, string>).toString();
      console.log("📤 Fetching by ID:", { basePath: this.basePath, id });
      const response = await api.get<ApiResponse<T>>(
        `${this.basePath}/${idPath}`
      );
      console.log("📥 Fetched by ID:", response.data);
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
      console.error("💥 Fetch by ID error:", errorDetails);
      throw error;
    }
  };

  update = async (
    id: string | Record<string, unknown>,
    payload: Omit<U, "id">
  ): Promise<ApiResponse<T>> => {
    try {
      const idPath =
        typeof id === "string"
          ? id
          : new URLSearchParams(id as Record<string, string>).toString();
      console.log("📤 Updating:", { basePath: this.basePath, id, payload });
      const response = await api.patch<ApiResponse<T>>(
        `${this.basePath}/${idPath}`,
        payload
      );
      console.log("📥 Updated:", response.data);
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
      console.error("💥 Update error:", errorDetails);
      throw error;
    }
  };

  delete = async (
    id: string | Record<string, unknown>
  ): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const idPath =
        typeof id === "string"
          ? id
          : new URLSearchParams(id as Record<string, string>).toString();
      console.log("📤 Deleting:", { basePath: this.basePath, id });
      const response = await api.delete<ApiResponse<{ deleted: boolean }>>(
        `${this.basePath}/${idPath}`
      );
      console.log("📥 Deleted:", response.data);
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
      console.error("💥 Delete error:", errorDetails);
      throw error;
    }
  };
}

export default ApiService;