// src/shared/lib/zod/visit.ts
import { z } from 'zod';
import { commonFields, compositeKey } from './common';

/**
 * Base visit schema without ID.
 */
const baseVisit = z.object({
  reason: z.string()
    .min(10, 'Reason too short (min 10 chars)')
    .max(500, 'Reason too long (max 500 chars)'),
  notes: z.string()
    .min(10, 'Notes too short (min 10 chars)')
    .max(1000, 'Notes too long (max 1000 chars)'),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).default('Scheduled'),
});

/**
 * Full visit schema including ID and composite key.
 */
export const visitSchema = baseVisit.extend({
  id: commonFields.id,
  ...compositeKey.shape,
});

/**
 * Schema for creating a new visit.
 */
export const createVisitSchema = visitSchema.omit({ id: true });

/**
 * Schema for updating an existing visit.
 */
export const updateVisitSchema = visitSchema.omit({ id: true }).partial().extend({
  id: commonFields.id,
}).strict();

// Types
export type Visit = z.infer<typeof visitSchema>;
export type VisitCreateInput = z.infer<typeof createVisitSchema>;
export type VisitUpdateInput = z.infer<typeof updateVisitSchema>;