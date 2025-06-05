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
  createPatientSchema,
  Patient,
  updatePatientSchema,
} from "@/shared/lib/zod/patient";
import {
  createPatient,
  deletePatient,
  fetchPatients,
  updatePatient,
} from "@/app/patients/actions";
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
interface UsePatientsProps {
  initialData?: Patient[];
  page?: number;
  size?: number;
}

interface PatientState {
  patients: Patient[];
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  selectedEntity: Patient | null;
}

interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Patient;
}

type OptimisticUpdate =
  | { type: "add"; patient: Patient }
  | { type: "update"; patient: Patient }
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
 * Optimistically updates patients array based on action type
 */
function optimisticPatientUpdate(
  patients: Patient[],
  update: OptimisticUpdate
): Patient[] {
  switch (update.type) {
    case "add":
      console.log(`${EMOJI.OPERATION.CREATE} Optimistically adding patient`);
      return [...patients, update.patient];
    case "update":
      console.log(`${EMOJI.OPERATION.UPDATE} Optimistically updating patient ${update.patient.id}`);
      return patients.map((patient) =>
        patient.id === update.patient.id ? update.patient : patient
      );
    case "delete":
      console.log(`${EMOJI.OPERATION.DELETE} Optimistically deleting patient ${update.id}`);
      return patients.filter((patient) => patient.id !== update.id);
    default:
      return patients;
  }
}

/* ======= Hook ====== */
export function usePatients({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UsePatientsProps) {
  /* ====== States ====== */
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totPages, setTotPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<PatientState>({
    patients: initialData ?? [],
    error: null,
    selectedEntity: null,
  });

  /* ======= Form Actions ======== */
  const [createState, createFormAction, createPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      console.log(`${EMOJI.OPERATION.CREATE} Creating new patient...`);
      
      const validation = createPatientSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimisticPatient: Patient = {
        id: tempId,
        ...validation.data,
      };
      setOptimisticPatients({ type: "add", patient: optimisticPatient });

      try {
        const response = await createPatient(formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to create patient";
          console.log(`${EMOJI.ERROR} Failed to create patient: ${errorMessage}`);
          setOptimisticPatients({ type: "delete", id: tempId });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          patients: [
            ...prev.patients.filter((patient) => patient.id !== tempId),
            response.data,
          ],
        }));
        
        console.log(`${EMOJI.SUCCESS} Patient created successfully! ID: ${response.data.id}`);
        toast.success("Patient created successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticPatients({ type: "delete", id: tempId });
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
        const errorMsg = `${EMOJI.ERROR} No patient selected for update`;
        console.error(errorMsg);
        return handleActionError(new Error(errorMsg));
      }

      console.log(`${EMOJI.OPERATION.UPDATE} Updating patient ${state.selectedEntity.id}...`);
      
      const validation = updatePatientSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const prevPatient = state.selectedEntity;
      const optimisticPatient: Patient = {
        ...state.selectedEntity,
        ...validation.data,
      };
      setOptimisticPatients({ type: "update", patient: optimisticPatient });

      try {
        const response = await updatePatient(state.selectedEntity.id, formData);
        if (!response.success) {
          const errorMessage = response.status.message || "Failed to update patient";
          console.log(`${EMOJI.ERROR} Failed to update patient ${state.selectedEntity.id}: ${errorMessage}`);
          setOptimisticPatients({ type: "update", patient: prevPatient });
          return handleActionError(new Error(errorMessage));
        }

        setState((prev) => ({
          ...prev,
          patients: prev.patients.map((d) =>
            d.id === state.selectedEntity?.id ? response.data : d
          ),
          selectedEntity: null,
        }));
        
        console.log(`${EMOJI.SUCCESS} Patient ${state.selectedEntity.id} updated successfully!`);
        toast.success("Patient updated successfully");
        return { success: true, data: response.data, error: null };
      } catch (error) {
        setOptimisticPatients({ type: "update", patient: prevPatient });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  const [optimisticPatients, setOptimisticPatients] = useOptimistic(
    state.patients,
    optimisticPatientUpdate
  );

  /* ======= Memoized Values ======== */
  const isLoading = useMemo(
    () => isPending || createPending || updatePending,
    [isPending, createPending, updatePending]
  );

  /* ======= Fetch Patients ======== */
  const loadPatients = useCallback(async (page: number, size: number) => {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching patients (page ${page}, size ${size})...`);
    
    try {
      const response = await fetchPatients(page, size);
      if (!response.success) {
        throw new Error(response.status.message || "Failed to fetch patients");
      }

      setState((prev) => ({
        ...prev,
        patients: response.data.items || [],
        error: null,
        selectedEntity: null,
      }));
      setTotPages(response.data.totalPages || 1);
      
      console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items?.length || 0} patients`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `${EMOJI.ERROR} ${error.message}`
          : `${EMOJI.ERROR} An error occurred while fetching patients.`;
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
      loadPatients(page, size);
    });
    return () => abortController.abort();
  }, [page, size, loadPatients]);

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

  /* ======= Delete Patient (With Rollback) ======== */
  const handleDelete = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      console.log(`${EMOJI.OPERATION.DELETE} Deleting patient ${id}...`);
      
      const prevPatients = state.patients;
      setOptimisticPatients({ type: "delete", id });

      try {
        const response = await deletePatient(id);
        if (!response.success) {
          throw new Error(response.status.message || "Failed to delete patient");
        }

        setState((prev) => ({
          ...prev,
          patients: prev.patients.filter((patient) => patient.id !== id),
        }));
        
        console.log(`${EMOJI.SUCCESS} Patient ${id} deleted successfully!`);
        toast.success("Patient deleted successfully");
        return { success: true };
      } catch (error) {
        console.log(`${EMOJI.ERROR} Failed to delete patient ${id}`);
        setState((prev) => ({ ...prev, patients: prevPatients }));
        const errorResult = handleActionError(error);
        return { success: false, error: errorResult.error };
      }
    },
    [state.patients, setOptimisticPatients]
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
    patients: optimisticPatients,
    isLoading,
    error: state.error || createState.error || updateState.error,
    fieldErrors:
      state.fieldErrors || createState.fieldErrors || updateState.fieldErrors,
    page,
    size,
    setPage: handlePagination,
    totPages,
    selectedEntity: state.selectedEntity,
    setSelectedEntity: (patient: Patient | null) =>
      setState((prev) => ({ ...prev, selectedEntity: patient })),
    createFormAction,
    updateFormAction,
    handleDelete,
  };
}