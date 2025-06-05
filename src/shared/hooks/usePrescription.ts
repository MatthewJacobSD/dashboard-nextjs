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
  createPrescriptionSchema,
  Prescription,
  updatePrescriptionSchema,
} from "@/shared/lib/zod/prescription";
import {
  createPrescription,
  deletePrescription,
  fetchPrescriptions,
  updatePrescription,
} from "@/app/prescriptions/actions";
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
interface UsePrescriptionsProps {
  initialData?: Prescription[];
  page?: number;
  size?: number;
}

interface PrescriptionState {
  prescriptions: Prescription[];
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  selectedEntity: Prescription | null;
}

interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Prescription;
}

type OptimisticUpdate =
  | { type: "add"; prescription: Prescription }
  | { type: "update"; prescription: Prescription }
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
 * Optimistically updates prescriptions array based on action type
 */
function optimisticPrescriptionUpdate(
  prescriptions: Prescription[],
  update: OptimisticUpdate
): Prescription[] {
  switch (update.type) {
    case "add":
      console.log(`${EMOJI.OPERATION.CREATE} Optimistically adding prescription`);
      return [...prescriptions, update.prescription];
    case "update":
      console.log(`${EMOJI.OPERATION.UPDATE} Optimistically updating prescription ${update.prescription.id}`);
      return prescriptions.map((prescription) =>
        prescription.id === update.prescription.id ? update.prescription : prescription
      );
    case "delete":
      console.log(`${EMOJI.OPERATION.DELETE} Optimistically deleting prescription ${update.id}`);
      return prescriptions.filter((prescription) => prescription.id !== update.id);
    default:
      return prescriptions;
  }
}

/* ======= Hook ====== */
export function usePrescriptions({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UsePrescriptionsProps) {
  /* ====== States ====== */
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totPages, setTotPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<PrescriptionState>({
    prescriptions: initialData ?? [],
    error: null,
    selectedEntity: null,
  });

  /* ======= Form Actions ======== */
  const [createState, createFormAction, createPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      console.log(`${EMOJI.OPERATION.CREATE} Creating new prescription...`);
      
      const validation = createPrescriptionSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimisticPrescription: Prescription = {
        id: tempId,
        ...validation.data,
      };
      setOptimisticPrescriptions({ type: "add", prescription: optimisticPrescription });

      try {
        const response = await createPrescription(formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to create prescription";
          console.log(`${EMOJI.ERROR} Failed to create prescription: ${errorMessage}`);
          setOptimisticPrescriptions({ type: "delete", id: tempId });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          prescriptions: [
            ...prev.prescriptions.filter((prescription) => prescription.id !== tempId),
            response.data,
          ],
        }));
        
        console.log(`${EMOJI.SUCCESS} Prescription created successfully! ID: ${response.data.id}`);
        toast.success("Prescription created successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticPrescriptions({ type: "delete", id: tempId });
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
        const errorMsg = `${EMOJI.ERROR} No prescription selected for update`;
        console.error(errorMsg);
        return handleActionError(new Error(errorMsg));
      }

      console.log(`${EMOJI.OPERATION.UPDATE} Updating prescription ${state.selectedEntity.id}...`);
      
      const validation = updatePrescriptionSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const prevPrescription = state.selectedEntity;
      const optimisticPrescription: Prescription = {
        ...state.selectedEntity,
        ...validation.data,
      };
      setOptimisticPrescriptions({ type: "update", prescription: optimisticPrescription });

      try {
        const response = await updatePrescription(state.selectedEntity.id, formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to update prescription";
          console.log(`${EMOJI.ERROR} Failed to update prescription ${state.selectedEntity.id}: ${errorMessage}`);
          setOptimisticPrescriptions({ type: "update", prescription: prevPrescription });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          prescriptions: prev.prescriptions.map((d) =>
            d.id === state.selectedEntity?.id ? response.data : d
          ),
          selectedEntity: null,
        }));
        
        console.log(`${EMOJI.SUCCESS} Prescription ${state.selectedEntity.id} updated successfully!`);
        toast.success("Prescription updated successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticPrescriptions({ type: "update", prescription: prevPrescription });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  const [optimisticPrescriptions, setOptimisticPrescriptions] = useOptimistic(
    state.prescriptions,
    optimisticPrescriptionUpdate
  );

  /* ======= Memoized Values ======== */
  const isLoading = useMemo(
    () => isPending || createPending || updatePending,
    [isPending, createPending, updatePending]
  );

  /* ======= Fetch Prescriptions ======== */
  const loadPrescriptions = useCallback(async (page: number, size: number) => {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching prescriptions (page ${page}, size ${size})...`);
    
    try {
      const response = await fetchPrescriptions(page, size);
      if (!response.success) {
        throw new Error(response.status.message || "Failed to fetch prescriptions");
      }

      setState((prev) => ({
        ...prev,
        prescriptions: response.data.items || [],
        error: null,
        selectedEntity: null,
      }));
      setTotPages(response.data.totalPages || 1);
      
      console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items?.length || 0} prescriptions`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `${EMOJI.ERROR} ${error.message}`
          : `${EMOJI.ERROR} An error occurred while fetching prescriptions.`;
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
      loadPrescriptions(page, size);
    });
    return () => abortController.abort();
  }, [page, size, loadPrescriptions]);

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

  /* ======= Delete Prescription (With Rollback) ======== */
  const handleDelete = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      console.log(`${EMOJI.OPERATION.DELETE} Deleting prescription ${id}...`);
      
      const prevPrescriptions = state.prescriptions;
      setOptimisticPrescriptions({ type: "delete", id });

      try {
        const response = await deletePrescription(id);
        if (!response.success) {
          throw new Error(response.status.message || "Failed to delete prescription");
        }

        setState((prev) => ({
          ...prev,
          prescriptions: prev.prescriptions.filter((prescription) => prescription.id !== id),
        }));
        
        console.log(`${EMOJI.SUCCESS} Prescription ${id} deleted successfully!`);
        toast.success("Prescription deleted successfully");
        return { success: true };
      } catch (error) {
        console.log(`${EMOJI.ERROR} Failed to delete prescription ${id}`);
        setState((prev) => ({ ...prev, prescriptions: prevPrescriptions }));
        const errorResult = handleActionError(error);
        return { success: false, error: errorResult.error };
      }
    },
    [state.prescriptions, setOptimisticPrescriptions]
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
    prescriptions: optimisticPrescriptions,
    isLoading,
    error: state.error || createState.error || updateState.error,
    fieldErrors:
      state.fieldErrors || createState.fieldErrors || updateState.fieldErrors,
    page,
    size,
    setPage: handlePagination,
    totPages,
    selectedEntity: state.selectedEntity,
    setSelectedEntity: (prescription: Prescription | null) =>
      setState((prev) => ({ ...prev, selectedEntity: prescription })),
    createFormAction,
    updateFormAction,
    handleDelete,
  };
}