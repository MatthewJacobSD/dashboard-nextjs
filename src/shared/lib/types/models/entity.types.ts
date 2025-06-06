import { Doctor } from '../../zod/doctor'
import { Patient } from '../../zod/patient'
import { Medication } from '../../zod/medication'
import { Appointment } from '../../zod/appointment'
import { Prescription } from '../../zod/prescription'
import { Insurance } from '../../zod/insurance'
import { GenericService } from '../crud/service.types'

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
export type CrudService<T extends Entity> = GenericService<T>
