import { z } from 'zod';
import { Path } from 'react-hook-form';
import { FormFieldType, FormField } from '@/components/form/GenericForm';

/**
 * Extracts inner schema from wrapped types like ZodEffects, ZodPipeline, ZodLazy, etc.
 */
function getInnerSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if ('schema' in schema && schema instanceof z.ZodEffects) {
    return getInnerSchema(schema.schema);
  }

  if ('_def' in schema && schema._def.type === 'pipeline') {
    return getInnerSchema(schema._def.pipeType);
  }

  if (schema instanceof z.ZodLazy) {
    return getInnerSchema(schema.schema());
  }

  return schema;
}

/**
 * Converts a Zod schema into an array of form field definitions.
 * Supports ZodEffects, ZodPipeline, ZodLazy, and deeply nested object schemas.
 */
export function zodSchemaToFormFields<T extends z.ZodTypeAny>(
  schema: T
): FormField<z.infer<T>>[] {
  const innerSchema = getInnerSchema(schema);

  if (!(innerSchema instanceof z.ZodObject)) {
    console.warn('⚠️ Schema is not a ZodObject - returning empty fields array');
    return [];
  }

  const shape = innerSchema.shape;
  const fields: FormField<z.infer<T>>[] = [];

  for (const [name, field] of Object.entries(shape)) {
    try {
      const baseField: FormField<z.infer<T>> = {
        name: name as Path<z.infer<T>>,
        label: formatLabel(name),
        type: getFieldType(field as z.ZodTypeAny),
        required: isFieldRequired(field as z.ZodTypeAny),
        placeholder: getPlaceholder(field as z.ZodTypeAny),
      };

      // Handle enum/select fields
      if (field instanceof z.ZodEnum) {
        baseField.options = field.options.map((value: string | number) => ({
          value: String(value),
          label: formatLabel(String(value)),
        }));
      }

      // Handle string with specific formats
      if (field instanceof z.ZodString) {
        const checks = field._def.checks || [];
        for (const check of checks) {
          if (check.kind === 'email') {
            baseField.placeholder = 'example@domain.com';
          } else if (check.kind === 'url') {
            baseField.placeholder = 'https://example.com'; 
          }
        }
      }

      fields.push(baseField);
    } catch (error) {
      console.error(`❌ Error processing field ${name}:`, error);
    }
  }

  return fields;
}

/**
 * Maps Zod types to supported form field types with enhanced type detection.
 */
function getFieldType(field: z.ZodTypeAny): FormFieldType {
  if (field instanceof z.ZodEnum) return 'select';
  if (field instanceof z.ZodNativeEnum) return 'select';
  if (field instanceof z.ZodString) {
    const checks = field._def.checks || [];
    if (checks.some((c: { kind: string }) => c.kind === 'email')) return 'email';
    if (checks.some((c: { kind: string }) => c.kind === 'url')) return 'text';
    return 'text';
  }
  if (field instanceof z.ZodNumber) return 'number';
  if (field instanceof z.ZodBoolean) return 'checkbox';
  if (field instanceof z.ZodDate) return 'date';
  if (field instanceof z.ZodOptional) return getFieldType(field.unwrap());
  if (field instanceof z.ZodDefault) return getFieldType(field.removeDefault());
  if (field instanceof z.ZodArray) return getFieldType(field.element);
  if (field instanceof z.ZodObject) return 'text'; // Could be JSON input later
  return 'text'; // Default fallback
}

/**
 * Formats field names into human-readable labels.
 */
function formatLabel(name: string): string {
  return (
    name
      .replace(/([A-Z])/g, ' $1') // camelCase -> "camel Case"
      .replace(/_/g, ' ') // snake_case -> "snake case"
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize words
      .trim()
  );
}

/**
 * Checks if the field is required in the schema.
 */
function isFieldRequired(field: z.ZodTypeAny): boolean {
  return !(field.isOptional() || field instanceof z.ZodDefault);
}

/**
 * Generates placeholder text based on field type and validation.
 */
function getPlaceholder(field: z.ZodTypeAny): string | undefined {
  if (field instanceof z.ZodNumber) return 'Enter a number';
  if (field instanceof z.ZodDate) return 'Select a date';
  if (field instanceof z.ZodString) {
    const checks = field._def.checks || [];
    if (checks.some((c: { kind: string }) => c.kind === 'email'))
      return 'example@domain.com';
    if (checks.some((c: { kind: string }) => c.kind === 'url'))
      return 'https://example.com'; 
  }
  return undefined;
}