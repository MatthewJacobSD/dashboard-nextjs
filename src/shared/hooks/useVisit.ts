'use client'

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

// Zod Schemas
import {
  createVisitSchema,
  Visit,
  updateVisitSchema,
} from "@/shared/lib/zod/visit";

// API Actions
import {
  createVisit,
  deleteVisit,
  fetchVisits,
  updateVisit,
} from "@/app/visits/actions";

// Utils
import { debounce } from "../utils/debounce";
import z from "zod";

/* ===== Constants ===== */
const EMOJI = {
  SUCCESS: "🔥",
  ERROR: "♨️",
  OPERATION: {
    CREATE: "🆕",
    UPDATE: "♻️",
    DELETE: "🗑️",
    FETCH: "🔍",
  },
} as const;

/* ===== Types ===== */
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

export interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Visit;
}

type OptimisticUpdate =
  | { type: "add"; visit: Visit }
  | { type: "update"; visit: Visit }
  | { type: "delete"; compositeKey: { patientId: string; doctorId: string; visitDate: string } };

interface UseVisitsReturn {
  visits: Visit[];
  isLoading: boolean;
  error: string | null;
  page: number;
  size: number;
  setPage: (newPage: number, newPageSize: number) => void;
  totPages: number;
  selectedEntity: Visit | null;
  setSelectedEntity: (visit: Visit | null) => void;
  createFormAction: (formData: FormData) => void;
  updateFormAction: (formData: FormData) => void;
  handleDelete: (compositeKey: { patientId: string; doctorId: string; visitDate: string }) => Promise<{ success: boolean; error?: string }>;
  createState: ActionState;
  updateState: ActionState;
}

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
 * Generates a temporary composite key for optimistic updates
 */
function generateTempCompositeKey(): { patientId: string; doctorId: string; visitDate: string } {
  return {
    patientId: `temp-${crypto.randomUUID()}`,
    doctorId: `temp-${crypto.randomUUID()}`,
    visitDate: new Date().toISOString(),
  };
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
      console.log(
        `${EMOJI.OPERATION.UPDATE} Optimistically updating visit for patient ${update.visit.patientId}, doctor ${update.visit.doctorId}, date ${update.visit.visitDate}`
      );
      return visits.map((visit) =>
        visit.patientId === update.visit.patientId &&
        visit.doctorId === update.visit.doctorId &&
        visit.visitDate.toISOString() === update.visit.visitDate.toISOString()
          ? update.visit
          : visit
      );

    case "delete":
      console.log(
        `${EMOJI.OPERATION.DELETE} Optimistically deleting visit for patient ${update.compositeKey.patientId}, doctor ${update.compositeKey.doctorId}, date ${update.compositeKey.visitDate}`
      );
      return visits.filter(
        (visit) =>
          !(
            visit.patientId === update.compositeKey.patientId &&
            visit.doctorId === update.compositeKey.doctorId &&
            visit.visitDate.toISOString() === update.compositeKey.visitDate
          )
      );

    default:
      return visits;
  }
}

/* ===== Hook Definition ===== */

export function useVisits({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UseVisitsProps): UseVisitsReturn {
  /* ===== State Management ===== */
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totPages, setTotPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<VisitState>({
    visits: initialData ?? [],
    error: null,
    selectedEntity: null,
  });

  const [optimisticVisits, setOptimisticVisits] = useOptimistic(
    state.visits,
    optimisticVisitUpdate
  );

  /* ===== Form Actions ===== */

  // Create Visit
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

      const tempCompositeKey = generateTempCompositeKey();
      const optimisticVisit: Visit = {
        ...validation.data,
        patientId: tempCompositeKey.patientId,
        doctorId: tempCompositeKey.doctorId,
        visitDate: new Date(tempCompositeKey.visitDate),
      };

      // Wrap optimistic update in startTransition
      startTransition(() => {
        setOptimisticVisits({ type: "add", visit: optimisticVisit });
      });

      try {
        const response = await createVisit(formData);

        if (!response.success) {
          const errorMessage =
            response.status.message || "Failed to create visit";
          console.log(
            `${EMOJI.ERROR} Failed to create visit: ${errorMessage}`
          );
          // Rollback optimistic update in transition
          startTransition(() => {
            setOptimisticVisits({
              type: "delete",
              compositeKey: tempCompositeKey,
            });
          });
          return handleActionError(new Error(errorMessage));
        }

        // Update state in transition
        startTransition(() => {
          setState((prev) => ({
            ...prev,
            visits: [
              ...prev.visits.filter(
                (visit) =>
                  !(
                    visit.patientId === tempCompositeKey.patientId &&
                    visit.doctorId === tempCompositeKey.doctorId &&
                    visit.visitDate.toISOString() === tempCompositeKey.visitDate
                  )
              ),
              response.data,
            ],
          }));
        });

        console.log(
          `${EMOJI.SUCCESS} Visit created successfully for patient ${response.data.patientId}, doctor ${response.data.doctorId}, date ${response.data.visitDate}`
        );
        toast.success("Visit created successfully");

        return { success: true, data: response.data, error: null };
      } catch (error) {
        // Rollback optimistic update in transition
        startTransition(() => {
          setOptimisticVisits({
            type: "delete",
            compositeKey: tempCompositeKey,
          });
        });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  // Update Visit
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

      console.log(
        `${EMOJI.OPERATION.UPDATE} Updating visit for patient ${state.selectedEntity.patientId}, doctor ${state.selectedEntity.doctorId}, date ${state.selectedEntity.visitDate}...`
      );

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

      // Wrap optimistic update in startTransition
      startTransition(() => {
        setOptimisticVisits({ type: "update", visit: optimisticVisit });
      });

      try {
        const response = await updateVisit(
          {
            patientId: state.selectedEntity.patientId,
            doctorId: state.selectedEntity.doctorId,
            visitDate: state.selectedEntity.visitDate.toISOString(),
          } as unknown as string,
          formData
        );

        if (!response.success) {
          const errorMessage =
            response.status.message || "Failed to update visit";
          console.log(
            `${EMOJI.ERROR} Failed to update visit: ${errorMessage}`
          );
          // Rollback optimistic update in transition
          startTransition(() => {
            setOptimisticVisits({ type: "update", visit: prevVisit });
          });
          return handleActionError(new Error(errorMessage));
        }

        // Update state in transition
        startTransition(() => {
          setState((prev) => ({
            ...prev,
            visits: prev.visits.map((d) =>
              d.patientId === state.selectedEntity?.patientId &&
              d.doctorId === state.selectedEntity?.doctorId &&
              d.visitDate.toISOString() === state.selectedEntity?.visitDate.toISOString()
                ? response.data
                : d
            ),
            selectedEntity: null,
          }));
        });

        console.log(
          `${EMOJI.SUCCESS} Visit updated successfully for patient ${state.selectedEntity.patientId}, doctor ${state.selectedEntity.doctorId}, date ${state.selectedEntity.visitDate}`
        );
        toast.success("Visit updated successfully");

        return { success: true, data: response.data, error: null };
      } catch (error) {
        // Rollback optimistic update in transition
        startTransition(() => {
          setOptimisticVisits({ type: "update", visit: prevVisit });
        });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  /* ===== Fetch Visits ===== */

  const loadVisits = useCallback(async (page: number, size: number) => {
    console.log(
      `${EMOJI.OPERATION.FETCH} Fetching visits (page ${page}, size ${size})...`
    );

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

      console.log(
        `${EMOJI.SUCCESS} Fetched ${response.data.items?.length || 0} visits`
      );
    } catch (error) {
      const errorMessage = `${EMOJI.ERROR} ${
        error instanceof Error
          ? error.message
          : "An error occurred while fetching visits."
      }`;

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

  /* ===== Delete Visit ===== */

  const handleDelete = useCallback(
    async (compositeKey: { patientId: string; doctorId: string; visitDate: string }): Promise<{ success: boolean; error?: string }> => {
      console.log(
        `${EMOJI.OPERATION.DELETE} Deleting visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}...`
      );

      const prevVisits = [...state.visits];
      startTransition(() => setOptimisticVisits({ type: "delete", compositeKey }));

      try {
        const response = await deleteVisit(compositeKey);

        if (!response.success) {
          throw new Error(response.status.message || "Failed to delete visit");
        }

        setState((prev) => ({
          ...prev,
          visits: prev.visits.filter(
            (visit) =>
              !(
                visit.patientId === compositeKey.patientId &&
                visit.doctorId === compositeKey.doctorId &&
                visit.visitDate.toISOString() === compositeKey.visitDate
              )
          ),
        }));

        console.log(
          `${EMOJI.SUCCESS} Visit deleted successfully for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}`
        );
        toast.success("Visit deleted successfully");

        return { success: true };
      } catch (error) {
        console.log(
          `${EMOJI.ERROR} Failed to delete visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}`
        );

        setState((prev) => ({ ...prev, visits: prevVisits }));
        const errorResult = handleActionError(error);

        return { success: false, error: errorResult.error };
      }
    },
    [state.visits]
  );

  /* ===== Resize Handling ===== */

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newSize = width < 640 ? 5 : width < 1024 ? 10 : 15;

      console.log(
        `${EMOJI.OPERATION.FETCH} Resizing to ${newSize} items per page`
      );
      setSize(newSize);
    };

    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  /* ===== Pagination ===== */

  const handlePagination = useCallback(
    (newPage: number, newPageSize: number) => {
      console.log(
        `${EMOJI.OPERATION.FETCH} Changing to page ${newPage} with ${newPageSize} items`
      );
      startTransition(() => {
        setPage(newPage);
        setSize(newPageSize);
      });
    },
    []
  );

  /* ===== Derived Values ===== */

  const isLoading = useMemo(
    () => isPending || createPending || updatePending,
    [isPending, createPending, updatePending]
  );

  /* ===== Exposed Return Values ===== */

  return {
    visits: optimisticVisits,
    isLoading,
    error: state.error || createState.error || updateState.error,
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
    createState,
    updateState,
  };
}