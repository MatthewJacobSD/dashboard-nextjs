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
  createVisitSchema,
  Visit,
  updateVisitSchema,
} from "@/shared/lib/zod/visit";
import {
  createVisit,
  deleteVisit,
  fetchVisits,
  updateVisit,
} from "@/app/visits/actions";
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
interface UseVisitsProps {
  initialData?: Visit[];
  page?: number;
  size?: number;
}

interface VisitState {
  visits: Visit[];
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  selectedEntity: Visit | null;
}

interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Visit;
}

type OptimisticUpdate =
  | { type: "add"; visit: Visit }
  | { type: "update"; visit: Visit }
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
 * Optimistically updates visits array based on action type
 */
function optimisticVisitUpdate(
  visits: Visit[],
  update: OptimisticUpdate
): Visit[] {
  switch (update.type) {
    case "add":
      console.log(`${EMOJI.OPERATION.CREATE} Optimistically adding visit`);
      return [...visits, update.visit];
    case "update":
      console.log(`${EMOJI.OPERATION.UPDATE} Optimistically updating visit ${update.visit.id}`);
      return visits.map((visit) =>
        visit.id === update.visit.id ? update.visit : visit
      );
    case "delete":
      console.log(`${EMOJI.OPERATION.DELETE} Optimistically deleting visit ${update.id}`);
      return visits.filter((visit) => visit.id !== update.id);
    default:
      return visits;
  }
}

/* ======= Hook ====== */
export function useVisits({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UseVisitsProps) {
  /* ====== States ====== */
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totPages, setTotPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<VisitState>({
    visits: initialData ?? [],
    error: null,
    selectedEntity: null,
  });

  /* ======= Form Actions ======== */
  const [createState, createFormAction, createPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      console.log(`${EMOJI.OPERATION.CREATE} Creating new visit...`);
      
      const validation = createVisitSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimisticVisit: Visit = {
        id: tempId,
        ...validation.data,
      };
      setOptimisticVisits({ type: "add", visit: optimisticVisit });

      try {
        const response = await createVisit(formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to create visit";
          console.log(`${EMOJI.ERROR} Failed to create visit: ${errorMessage}`);
          setOptimisticVisits({ type: "delete", id: tempId });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          visits: [
            ...prev.visits.filter((visit) => visit.id !== tempId),
            response.data,
          ],
        }));
        
        console.log(`${EMOJI.SUCCESS} Visit created successfully! ID: ${response.data.id}`);
        toast.success("Visit created successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticVisits({ type: "delete", id: tempId });
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
        const errorMsg = `${EMOJI.ERROR} No visit selected for update`;
        console.error(errorMsg);
        return handleActionError(new Error(errorMsg));
      }

      console.log(`${EMOJI.OPERATION.UPDATE} Updating visit ${state.selectedEntity.id}...`);
      
      const validation = updateVisitSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const prevVisit = state.selectedEntity;
      const optimisticVisit: Visit = {
        ...state.selectedEntity,
        ...validation.data,
      };
      setOptimisticVisits({ type: "update", visit: optimisticVisit });

      try {
        const response = await updateVisit(state.selectedEntity.id, formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to update visit";
          console.log(`${EMOJI.ERROR} Failed to update visit ${state.selectedEntity.id}: ${errorMessage}`);
          setOptimisticVisits({ type: "update", visit: prevVisit });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          visits: prev.visits.map((d) =>
            d.id === state.selectedEntity?.id ? response.data : d
          ),
          selectedEntity: null,
        }));
        
        console.log(`${EMOJI.SUCCESS} Visit ${state.selectedEntity.id} updated successfully!`);
        toast.success("Visit updated successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticVisits({ type: "update", visit: prevVisit });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  const [optimisticVisits, setOptimisticVisits] = useOptimistic(
    state.visits,
    optimisticVisitUpdate
  );

  /* ======= Memoized Values ======== */
  const isLoading = useMemo(
    () => isPending || createPending || updatePending,
    [isPending, createPending, updatePending]
  );

  /* ======= Fetch Visits ======== */
  const loadVisits = useCallback(async (page: number, size: number) => {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching visits (page ${page}, size ${size})...`);
    
    try {
      const response = await fetchVisits(page, size);
      if (!response.success) {
        throw new Error(response.status.message || "Failed to fetch visits");
      }

      setState((prev) => ({
        ...prev,
        visits: response.data.items || [],
        error: null,
        selectedEntity: null,
      }));
      setTotPages(response.data.totalPages || 1);
      
      console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items?.length || 0} visits`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `${EMOJI.ERROR} ${error.message}`
          : `${EMOJI.ERROR} An error occurred while fetching visits.`;
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
      loadVisits(page, size);
    });
    return () => abortController.abort();
  }, [page, size, loadVisits]);

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

  /* ======= Delete Visit (With Rollback) ======== */
  const handleDelete = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      console.log(`${EMOJI.OPERATION.DELETE} Deleting visit ${id}...`);
      
      const prevVisits = state.visits;
      setOptimisticVisits({ type: "delete", id });

      try {
        const response = await deleteVisit(id);
        if (!response.success) {
          throw new Error(response.status.message || "Failed to delete visit");
        }

        setState((prev) => ({
          ...prev,
          visits: prev.visits.filter((visit) => visit.id !== id),
        }));
        
        console.log(`${EMOJI.SUCCESS} Visit ${id} deleted successfully!`);
        toast.success("Visit deleted successfully");
        return { success: true };
      } catch (error) {
        console.log(`${EMOJI.ERROR} Failed to delete visit ${id}`);
        setState((prev) => ({ ...prev, visits: prevVisits }));
        const errorResult = handleActionError(error);
        return { success: false, error: errorResult.error };
      }
    },
    [state.visits, setOptimisticVisits]
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
    visits: optimisticVisits,
    isLoading,
    error: state.error || createState.error || updateState.error,
    fieldErrors:
      state.fieldErrors || createState.fieldErrors || updateState.fieldErrors,
    page,
    size,
    setPage: handlePagination,
    totPages,
    selectedEntity: state.selectedEntity,
    setSelectedEntity: (visit: Visit | null) =>
      setState((prev) => ({ ...prev, selectedEntity: visit })),
    createFormAction,
    updateFormAction,
    handleDelete,
  };
}