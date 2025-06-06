import { Doctor } from '../../zod/doctor'
import { Patient } from '../../zod/patient'
import { Medication } from '../../zod/medication'
import { Appointment } from '../../zod/appointment'
import { Prescription } from '../../zod/prescription'
import { Insurance } from '../../zod/insurance'

// ====== Entity Types ======
/**
 * Union type representing all possible domain entities.
 */
export type Entity =
  | Doctor
  | Patient
  | Medication
  | Appointment
  | Prescription
  | Insurance

/**
 * Type alias for a CRUD service bound to a specific entity.
 *
 * @template T - The entity type.
 */
import { GenericService } from '../crud/service.types'

export type CrudService<T extends Entity> = GenericService<T>

// ====== Shared Hook Helpers ======
import {
  useEntityActions,
  useOptimisticUpdate,
  usePagination,
  useResizeHandler,
  useToastMessages,
} from '../../hooks/helpers'

/**
 * Reusable hook factory for entity-specific hooks (e.g., useDoctors, usePatients).
 *
 * @template T - The entity type.
 */
export function defineEntityHook<T extends Entity>() {
  return {
    entity: {} as T,
    useEntityActions,
    useOptimisticUpdate,
    usePagination,
    useResizeHandler,
    useToastMessages,
  }
}
