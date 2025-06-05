"use client";

import {
  useState,
  useEffect,
  useCallback,
  useActionState,
  useOptimistic,
  useTransition,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import {
  createInsuranceSchema,
  Insurance,
  updateInsuranceSchema,
} from "@/shared/lib/zod/insurance";
import {
  createInsurance,
  deleteInsurance,
  fetchInsurances,
  updateInsurance,
} from "@/app/insurances/actions";
import { z } from "zod";
import { debounce } from "../utils/debounce";

/* ====== Constants ====== */
const EMOJI = {
  SUCCESS: '🔥',
  ERROR: '♨️',
  OPERATION: {
    CREATE: '🆕',
    UPDATE: '♻️',
    DELETE: '🗑️',
    FETCH: '🔍'
  }
} as const;

/* ====== Types ====== */
interface UseInsurancesProps {
  initialData?: Insurance[];
  page?: number;
  size?: number;
}

interface InsuranceState {
  insurances: Insurance[];
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  selectedEntity: Insurance | null;
}

interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Insurance;
}

type OptimisticUpdate =
  | { type: "add"; insurance: Insurance }
  | { type: "update"; insurance: Insurance }
  | { type: "delete"; id: string };

/* ===== Utility Functions ===== */
/**
 * Handles errors from actions and returns standardized error state
 */
function handleActionError(error: unknown | z.ZodError): {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
} {
  if (error instanceof z.ZodError) {
    const fieldErrors = error.flatten().fieldErrors;
    const errorMsg = `${EMOJI.ERROR} Validation failed`;
    console.error(errorMsg, fieldErrors);
    return {
      success: false,
      error: errorMsg,
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, messages]) => [
          key,
          messages || [],
        ])
      ),
    };
  }
  const errorMsg = `${EMOJI.ERROR} ${error instanceof Error ? error.message : "Operation failed"}`;
  console.error(errorMsg);
  toast.error(errorMsg);
  return { success: false, error: errorMsg };
}

/**
 * Optimistically updates insurances array based on action type
 */
function optimisticInsuranceUpdate(
  insurances: Insurance[],
  update: OptimisticUpdate
): Insurance[] {
  switch (update.type) {
    case "add":
      console.log(`${EMOJI.OPERATION.CREATE} Optimistically adding insurance`);
      return [...insurances, update.insurance];
    case "update":
      console.log(`${EMOJI.OPERATION.UPDATE} Optimistically updating insurance ${update.insurance.id}`);
      return insurances.map((insurance) =>
        insurance.id === update.insurance.id ? update.insurance : insurance
      );
    case "delete":
      console.log(`${EMOJI.OPERATION.DELETE} Optimistically deleting insurance ${update.id}`);
      return insurances.filter((insurance) => insurance.id !== update.id);
    default:
      return insurances;
  }
}

/* ======= Hook ====== */
export function useInsurances({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UseInsurancesProps) {
  /* ====== States ====== */
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totPages, setTotPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<InsuranceState>({
    insurances: initialData ?? [],
    error: null,
    selectedEntity: null,
  });

  /* ======= Form Actions ======== */
  const [createState, createFormAction, createPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      console.log(`${EMOJI.OPERATION.CREATE} Creating new insurance...`);
      
      const validation = createInsuranceSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimisticInsurance: Insurance = {
        id: tempId,
        ...validation.data,
      };
      setOptimisticInsurances({ type: "add", insurance: optimisticInsurance });

      try {
        const response = await createInsurance(formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to create insurance";
          console.log(`${EMOJI.ERROR} Failed to create insurance: ${errorMessage}`);
          setOptimisticInsurances({ type: "delete", id: tempId });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          insurances: [
            ...prev.insurances.filter((insurance) => insurance.id !== tempId),
            response.data,
          ],
        }));
        
        console.log(`${EMOJI.SUCCESS} Insurance created successfully! ID: ${response.data.id}`);
        toast.success("Insurance created successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticInsurances({ type: "delete", id: tempId });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  const [updateState, updateFormAction, updatePending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      if (!state.selectedEntity) {
        const errorMsg = `${EMOJI.ERROR} No insurance selected for update`;
        console.error(errorMsg);
        return handleActionError(new Error(errorMsg));
      }

      console.log(`${EMOJI.OPERATION.UPDATE} Updating insurance ${state.selectedEntity.id}...`);
      
      const validation = updateInsuranceSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const prevInsurance = state.selectedEntity;
      const optimisticInsurance: Insurance = {
        ...state.selectedEntity,
        ...validation.data,
      };
      setOptimisticInsurances({ type: "update", insurance: optimisticInsurance });

      try {
        const response = await updateInsurance(state.selectedEntity.id, formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to update insurance";
          console.log(`${EMOJI.ERROR} Failed to update insurance ${state.selectedEntity.id}: ${errorMessage}`);
          setOptimisticInsurances({ type: "update", insurance: prevInsurance });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          insurances: prev.insurances.map((d) =>
            d.id === state.selectedEntity?.id ? response.data : d
          ),
          selectedEntity: null,
        }));
        
        console.log(`${EMOJI.SUCCESS} Insurance ${state.selectedEntity.id} updated successfully!`);
        toast.success("Insurance updated successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticInsurances({ type: "update", insurance: prevInsurance });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  const [optimisticInsurances, setOptimisticInsurances] = useOptimistic(
    state.insurances,
    optimisticInsuranceUpdate
  );

  /* ======= Memoized Values ======== */
  const isLoading = useMemo(
    () => isPending || createPending || updatePending,
    [isPending, createPending, updatePending]
  );

  /* ======= Fetch Insurances ======== */
  const loadInsurances = useCallback(async (page: number, size: number) => {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching insurances (page ${page}, size ${size})...`);
    
    try {
      const response = await fetchInsurances(page, size);
      if (!response.success) {
        throw new Error(response.status.message || "Failed to fetch insurances");
      }

      setState((prev) => ({
        ...prev,
        insurances: response.data.items || [],
        error: null,
        selectedEntity: null,
      }));
      setTotPages(response.data.totalPages || 1);
      
      console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items?.length || 0} insurances`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `${EMOJI.ERROR} ${error.message}`
          : `${EMOJI.ERROR} An error occurred while fetching insurances.`;
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        selectedEntity: null,
      }));
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    startTransition(() => {
      loadInsurances(page, size);
    });
    return () => abortController.abort();
  }, [page, size, loadInsurances]);

  /* ======= Window Resize (Debounced) ======== */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newSize = width < 640 ? 5 : width < 1024 ? 10 : 15;
      console.log(`${EMOJI.OPERATION.FETCH} Resizing to ${newSize} items per page`);
      setSize(newSize);
    };
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  /* ======= Delete Insurance (With Rollback) ======== */
  const handleDelete = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      console.log(`${EMOJI.OPERATION.DELETE} Deleting insurance ${id}...`);
      
      const prevInsurances = state.insurances;
      setOptimisticInsurances({ type: "delete", id });

      try {
        const response = await deleteInsurance(id);
        if (!response.success) {
          throw new Error(response.status.message || "Failed to delete insurance");
        }

        setState((prev) => ({
          ...prev,
          insurances: prev.insurances.filter((insurance) => insurance.id !== id),
        }));
        
        console.log(`${EMOJI.SUCCESS} Insurance ${id} deleted successfully!`);
        toast.success("Insurance deleted successfully");
        return { success: true };
      } catch (error) {
        console.log(`${EMOJI.ERROR} Failed to delete insurance ${id}`);
        setState((prev) => ({ ...prev, insurances: prevInsurances }));
        const errorResult = handleActionError(error);
        return { success: false, error: errorResult.error };
      }
    },
    [state.insurances, setOptimisticInsurances]
  );

  /* ======= Pagination ======== */
  const handlePagination = (newPage: number, newPageSize: number) => {
    console.log(`${EMOJI.OPERATION.FETCH} Changing to page ${newPage} with ${newPageSize} items`);
    startTransition(() => {
      setPage(newPage);
      setSize(newPageSize);
    });
  };

  return {
    insurances: optimisticInsurances,
    isLoading,
    error: state.error || createState.error || updateState.error,
    fieldErrors:
      state.fieldErrors || createState.fieldErrors || updateState.fieldErrors,
    page,
    size,
    setPage: handlePagination,
    totPages,
    selectedEntity: state.selectedEntity,
    setSelectedEntity: (insurance: Insurance | null) =>
      setState((prev) => ({ ...prev, selectedEntity: insurance })),
    createFormAction,
    updateFormAction,
    handleDelete,
  };
}