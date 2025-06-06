/**
 * Makes certain keys required in T.
 *
 * @template T - The original type
 * @template K - Keys to make required
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Makes certain keys optional in T.
 *
 * @template T - The original type
 * @template K - Keys to make optional
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/**
 * Extracts only the fields that match a given type.
 *
 * @template T - The object type
 * @template FieldType - The target type to filter by
 */
export type FilterFieldsByType<T, FieldType> = {
  [K in keyof T]: T[K] extends FieldType ? K : never
}[keyof T]

/**
 * Recursively makes all properties of an object optional.
 *
 * @template T - The object type
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Extracts members of a union where property K equals value V.
 *
 * @template T - The union type
 * @template K - Discriminant key
 * @template V - Expected value for K
 */
export type FilterBy<T, K extends keyof T, V extends T[K]> =
  T extends Record<K, V> ? T : never
