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

// Zod Schemas
import {
  createMedicationSchema,
  Medication,
  updateMedicationSchema,
} from "@/shared/lib/zod/medication";

// API Actions
import {
  createMedication,
  deleteMedication,
  fetchMedications,
  updateMedication,
} from "@/app/medications/actions";

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
interface UseMedicationsProps {
  initialData?: Medication[];
  page?: number;
  size?: number;
}

interface MedicationState {
  medications: Medication[];
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  selectedEntity: Medication | null;
}

export interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Medication;
}

type OptimisticUpdate =
  | { type: "add"; medication: Medication }
  | { type: "update"; medication: Medication }
  | { type: "delete"; id: string };

// Define return type for the hook
interface UseMedicationsReturn {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
  page: number;
  size: number;
  setPage: (newPage: number, newPageSize: number) => void;
  totPages: number;
  selectedEntity: Medication | null;
  setSelectedEntity: (medication: Medication | null) => void;
  createFormAction: (formData: FormData) => void;
  updateFormAction: (formData: FormData) => void;
  handleDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
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
 * Optimistically updates medications array based on action type
 */
function optimisticMedicationUpdate(
  medications: Medication[],
  update: OptimisticUpdate
): Medication[] {
  switch (update.type) {
    case "add":
      console.log(`${EMOJI.OPERATION.CREATE} Optimistically adding medication`);
      return [...medications, update.medication];

    case "update":
      console.log(
        `${EMOJI.OPERATION.UPDATE} Optimistically updating medication ${update.medication.id}`
      );
      return medications.map((medication) =>
        medication.id === update.medication.id ? update.medication : medication
      );

    case "delete":
      console.log(
        `${EMOJI.OPERATION.DELETE} Optimistically deleting medication ${update.id}`
      );
      return medications.filter((medication) => medication.id !== update.id);

    default:
      return medications;
  }
}

/* ===== Hook Definition ===== */

export function useMedications({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UseMedicationsProps): UseMedicationsReturn {
  /* ===== State Management ===== */
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totPages, setTotPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<MedicationState>({
    medications: initialData ?? [],
    error: null,
    selectedEntity: null,
  });

  const [optimisticMedications, setOptimisticMedications] = useOptimistic(
    state.medications,
    optimisticMedicationUpdate
  );

  /* ===== Form Actions ===== */

  // Create Medication
  const [createState, createFormAction, createPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      console.log(`${EMOJI.OPERATION.CREATE} Creating new medication...`);

      const validation = createMedicationSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimisticMedication: Medication = {
        id: tempId,
        ...validation.data,
      };

      // Wrap optimistic update in startTransition
      startTransition(() => {
        setOptimisticMedications({ type: "add", medication: optimisticMedication });
      });

      try {
        const response = await createMedication(formData);

        if (!response.success) {
          const errorMessage =
            response.status.message || "Failed to create medication";
          console.log(
            `${EMOJI.ERROR} Failed to create medication: ${errorMessage}`
          );
          // Rollback optimistic update in transition
          startTransition(() => {
            setOptimisticMedications({ type: "delete", id: tempId });
          });
          return handleActionError(new Error(errorMessage));
        }

        // Update state in transition
        startTransition(() => {
          setState((prev) => ({
            ...prev,
            medications: [
              ...prev.medications.filter((medication) => medication.id !== tempId),
              response.data,
            ],
          }));
        });

        console.log(
          `${EMOJI.SUCCESS} Medication created successfully! ID: ${response.data.id}`
        );
        toast.success("Medication created successfully");

        return { success: true, data: response.data, error: null };
      } catch (error) {
        // Rollback optimistic update in transition
        startTransition(() => {
          setOptimisticMedications({ type: "delete", id: tempId });
        });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  // Update Medication
  const [updateState, updateFormAction, updatePending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      if (!state.selectedEntity) {
        const errorMsg = `${EMOJI.ERROR} No medication selected for update`;
        console.error(errorMsg);
        return handleActionError(new Error(errorMsg));
      }

      console.log(
        `${EMOJI.OPERATION.UPDATE} Updating medication ${state.selectedEntity.id}...`
      );

      const validation = updateMedicationSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const prevMedication = state.selectedEntity;
      const optimisticMedication: Medication = {
        ...state.selectedEntity,
        ...validation.data,
      };

      // Wrap optimistic update in startTransition
      startTransition(() => {
        setOptimisticMedications({ type: "update", medication: optimisticMedication });
      });

      try {
        const response = await updateMedication(state.selectedEntity.id, formData);

        if (!response.success) {
          const errorMessage =
            response.status.message || "Failed to update medication";
          console.log(
            `${EMOJI.ERROR} Failed to update medication ${state.selectedEntity.id}: ${errorMessage}`
          );
          // Rollback optimistic update in transition
          startTransition(() => {
            setOptimisticMedications({ type: "update", medication: prevMedication });
          });
          return handleActionError(new Error(errorMessage));
        }

        // Update state in transition
        startTransition(() => {
          setState((prev) => ({
            ...prev,
            medications: prev.medications.map((d) =>
              d.id === state.selectedEntity?.id ? response.data : d
            ),
            selectedEntity: null,
          }));
        });

        console.log(
          `${EMOJI.SUCCESS} Medication ${state.selectedEntity.id} updated successfully!`
        );
        toast.success("Medication updated successfully");

        return { success: true, data: response.data, error: null };
      } catch (error) {
        // Rollback optimistic update in transition
        startTransition(() => {
          setOptimisticMedications({ type: "update", medication: prevMedication });
        });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  /* ===== Fetch Medications ===== */

  const loadMedications = useCallback(async (page: number, size: number) => {
    console.log(
      `${EMOJI.OPERATION.FETCH} Fetching medications (page ${page}, size ${size})...`
    );

    try {
      const response = await fetchMedications(page, size);

      if (!response.success) {
        throw new Error(response.status.message || "Failed to fetch medications");
      }

      setState((prev) => ({
        ...prev,
        medications: response.data.items || [],
        error: null,
        selectedEntity: null,
      }));
      setTotPages(response.data.totalPages || 1);

      console.log(
        `${EMOJI.SUCCESS} Fetched ${response.data.items?.length || 0} medications`
      );
    } catch (error) {
      const errorMessage = `${EMOJI.ERROR} ${
        error instanceof Error
          ? error.message
          : "An error occurred while fetching medications."
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
      loadMedications(page, size);
    });

    return () => abortController.abort();
  }, [page, size, loadMedications]);

  /* ===== Delete Medication ===== */

  const handleDelete = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      console.log(`${EMOJI.OPERATION.DELETE} Deleting medication ${id}...`);

      const prevMedications = [...state.medications];
      startTransition(() => setOptimisticMedications({ type: "delete", id }));

      try {
        const response = await deleteMedication(id);

        if (!response.success) {
          throw new Error(response.status.message || "Failed to delete medication");
        }

        setState((prev) => ({
          ...prev,
          medications: prev.medications.filter((medication) => medication.id !== id),
        }));

        console.log(`${EMOJI.SUCCESS} Medication ${id} deleted successfully!`);
        toast.success("Medication deleted successfully");

        return { success: true };
      } catch (error) {
        console.log(`${EMOJI.ERROR} Failed to delete medication ${id}`);

        setState((prev) => ({ ...prev, medications: prevMedications }));
        const errorResult = handleActionError(error);

        return { success: false, error: errorResult.error };
      }
    },
    [state.medications, setOptimisticMedications]
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
    medications: optimisticMedications,
    isLoading,
    error: state.error || createState.error || updateState.error,
    page,
    size,
    setPage: handlePagination,
    totPages,
    selectedEntity: state.selectedEntity,
    setSelectedEntity: (medication: Medication | null) =>
      setState((prev) => ({ ...prev, selectedEntity: medication })),
    createFormAction,
    updateFormAction,
    handleDelete,
    createState,
    updateState,
  };
}