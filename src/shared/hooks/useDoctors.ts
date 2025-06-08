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
  createDoctorSchema,
  Doctor,
  updateDoctorSchema,
} from "@/shared/lib/zod/doctor";

// API Actions
import {
  createDoctor,
  deleteDoctor,
  fetchDoctors,
  updateDoctor,
} from "@/app/doctors/actions";

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
interface UseDoctorsProps {
  initialData?: Doctor[];
  page?: number;
  size?: number;
}

interface DoctorState {
  doctors: Doctor[];
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  selectedEntity: Doctor | null;
}

export interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Doctor;
}

type OptimisticUpdate =
  | { type: "add"; doctor: Doctor }
  | { type: "update"; doctor: Doctor }
  | { type: "delete"; id: string };

// Define return type for the hook
interface UseDoctorsReturn {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
  page: number;
  size: number;
  setPage: (newPage: number, newPageSize: number) => void;
  totPages: number;
  selectedEntity: Doctor | null;
  setSelectedEntity: (doctor: Doctor | null) => void;
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
 * Optimistically updates doctors array based on action type
 */
function optimisticDoctorUpdate(
  doctors: Doctor[],
  update: OptimisticUpdate
): Doctor[] {
  switch (update.type) {
    case "add":
      console.log(`${EMOJI.OPERATION.CREATE} Optimistically adding doctor`);
      return [...doctors, update.doctor];

    case "update":
      console.log(
        `${EMOJI.OPERATION.UPDATE} Optimistically updating doctor ${update.doctor.id}`
      );
      return doctors.map((doctor) =>
        doctor.id === update.doctor.id ? update.doctor : doctor
      );

    case "delete":
      console.log(
        `${EMOJI.OPERATION.DELETE} Optimistically deleting doctor ${update.id}`
      );
      return doctors.filter((doctor) => doctor.id !== update.id);

    default:
      return doctors;
  }
}

/* ===== Hook Definition ===== */

export function useDoctors({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UseDoctorsProps): UseDoctorsReturn {
  /* ===== State Management ===== */
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totPages, setTotPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<DoctorState>({
    doctors: initialData ?? [],
    error: null,
    selectedEntity: null,
  });

  const [optimisticDoctors, setOptimisticDoctors] = useOptimistic(
    state.doctors,
    optimisticDoctorUpdate
  );

  /* ===== Form Actions ===== */

  // Create Doctor
  const [createState, createFormAction, createPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      console.log(`${EMOJI.OPERATION.CREATE} Creating new doctor...`);

      const validation = createDoctorSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimisticDoctor: Doctor = {
        id: tempId,
        ...validation.data,
        specialization: validation.data.specialization,
        experience: validation.data.experience,
      };

      // Wrap optimistic update in startTransition
      startTransition(() => {
        setOptimisticDoctors({ type: "add", doctor: optimisticDoctor });
      });

      try {
        const response = await createDoctor(formData);

        if (!response.success) {
          const errorMessage =
            response.status.message || "Failed to create doctor";
          console.log(
            `${EMOJI.ERROR} Failed to create doctor: ${errorMessage}`
          );
          // Rollback optimistic update in transition
          startTransition(() => {
            setOptimisticDoctors({ type: "delete", id: tempId });
          });
          return handleActionError(new Error(errorMessage));
        }

        // Update state in transition
        startTransition(() => {
          setState((prev) => ({
            ...prev,
            doctors: [
              ...prev.doctors.filter((doctor) => doctor.id !== tempId),
              response.data,
            ],
          }));
        });

        console.log(
          `${EMOJI.SUCCESS} Doctor created successfully! ID: ${response.data.id}`
        );
        toast.success("Doctor created successfully");

        return { success: true, data: response.data, error: null };
      } catch (error) {
        // Rollback optimistic update in transition
        startTransition(() => {
          setOptimisticDoctors({ type: "delete", id: tempId });
        });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  // Update Doctor
  const [updateState, updateFormAction, updatePending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData
    ): Promise<ActionState> => {
      if (!state.selectedEntity) {
        const errorMsg = `${EMOJI.ERROR} No doctor selected for update`;
        console.error(errorMsg);
        return handleActionError(new Error(errorMsg));
      }

      console.log(
        `${EMOJI.OPERATION.UPDATE} Updating doctor ${state.selectedEntity.id}...`
      );

      const validation = updateDoctorSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!validation.success) {
        return handleActionError(validation.error);
      }

      const prevDoctor = state.selectedEntity;
      const optimisticDoctor: Doctor = {
        ...state.selectedEntity,
        ...validation.data,
      };

      // Wrap optimistic update in startTransition
      startTransition(() => {
        setOptimisticDoctors({ type: "update", doctor: optimisticDoctor });
      });

      try {
        const response = await updateDoctor(state.selectedEntity.id, formData);

        if (!response.success) {
          const errorMessage =
            response.status.message || "Failed to update doctor";
          console.log(
            `${EMOJI.ERROR} Failed to update doctor ${state.selectedEntity.id}: ${errorMessage}`
          );
          // Rollback optimistic update in transition
          startTransition(() => {
            setOptimisticDoctors({ type: "update", doctor: prevDoctor });
          });
          return handleActionError(new Error(errorMessage));
        }

        // Update state in transition
        startTransition(() => {
          setState((prev) => ({
            ...prev,
            doctors: prev.doctors.map((d) =>
              d.id === state.selectedEntity?.id ? response.data : d
            ),
            selectedEntity: null,
          }));
        });

        console.log(
          `${EMOJI.SUCCESS} Doctor ${state.selectedEntity.id} updated successfully!`
        );
        toast.success("Doctor updated successfully");

        return { success: true, data: response.data, error: null };
      } catch (error) {
        // Rollback optimistic update in transition
        startTransition(() => {
          setOptimisticDoctors({ type: "update", doctor: prevDoctor });
        });
        return handleActionError(error);
      }
    },
    { success: false, error: null, fieldErrors: {} }
  );

  /* ===== Fetch Doctors ===== */

  const loadDoctors = useCallback(async (page: number, size: number) => {
    console.log(
      `${EMOJI.OPERATION.FETCH} Fetching doctors (page ${page}, size ${size})...`
    );

    try {
      const response = await fetchDoctors(page, size);

      if (!response.success) {
        throw new Error(response.status.message || "Failed to fetch doctors");
      }

      setState((prev) => ({
        ...prev,
        doctors: response.data.items || [],
        error: null,
        selectedEntity: null,
      }));
      setTotPages(response.data.totalPages || 1);

      console.log(
        `${EMOJI.SUCCESS} Fetched ${response.data.items?.length || 0} doctors`
      );
    } catch (error) {
      const errorMessage = `${EMOJI.ERROR} ${
        error instanceof Error
          ? error.message
          : "An error occurred while fetching doctors."
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
      loadDoctors(page, size);
    });

    return () => abortController.abort();
  }, [page, size, loadDoctors]);

  /* ===== Delete Doctor ===== */

  const handleDelete = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      console.log(`${EMOJI.OPERATION.DELETE} Deleting doctor ${id}...`);

      const prevDoctors = [...state.doctors];
      startTransition(() => setOptimisticDoctors({ type: "delete", id }));

      try {
        const response = await deleteDoctor(id);

        if (!response.success) {
          throw new Error(response.status.message || "Failed to delete doctor");
        }

        setState((prev) => ({
          ...prev,
          doctors: prev.doctors.filter((doctor) => doctor.id !== id),
        }));

        console.log(`${EMOJI.SUCCESS} Doctor ${id} deleted successfully!`);
        toast.success("Doctor deleted successfully");

        return { success: true };
      } catch (error) {
        console.log(`${EMOJI.ERROR} Failed to delete doctor ${id}`);

        setState((prev) => ({ ...prev, doctors: prevDoctors }));
        const errorResult = handleActionError(error);

        return { success: false, error: errorResult.error };
      }
    },
    [state.doctors, setOptimisticDoctors]
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
    doctors: optimisticDoctors,
    isLoading,
    error: state.error || createState.error || updateState.error,
    page,
    size,
    setPage: handlePagination,
    totPages,
    selectedEntity: state.selectedEntity,
    setSelectedEntity: (doctor: Doctor | null) =>
      setState((prev) => ({ ...prev, selectedEntity: doctor })),
    createFormAction,
    updateFormAction,
    handleDelete,
    createState,
    updateState,
  };
}