import { z } from 'zod';
import { Path } from 'react-hook-form';
import { FormFieldType, FormField } from '@/shared/components/ui/generics/Form';

export function zodSchemaToFormFields<T extends z.ZodTypeAny>(
  schema: T
): FormField<z.infer<T>>[] {
  const shape = schema instanceof z.ZodObject ? schema.shape : {};
  
  return Object.entries(shape).map(([name, field]) => {
    const baseField: FormField<z.infer<T>> = {
      name: name as Path<z.infer<T>>,
      label: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
      type: getFieldType(field as z.ZodTypeAny),
      required: isFieldRequired(field as z.ZodTypeAny),
    };

    if (field instanceof z.ZodEnum) {
      baseField.options = field.options.map((value: string) => ({
        value,
        label: value,
      }));
    }

    return baseField;
  });
}

function getFieldType(field: z.ZodTypeAny): FormFieldType {
  if (field instanceof z.ZodEnum) return 'select';
  if (field instanceof z.ZodString) {
    if (field._def.checks.some((c: { kind: string }) => c.kind === 'email')) {
      return 'email';
    }
    return 'text';
  }
  if (field instanceof z.ZodNumber) return 'number';
  if (field instanceof z.ZodBoolean) return 'checkbox';
  if (field instanceof z.ZodDate) return 'date';
  return 'text';
}

function isFieldRequired(field: z.ZodTypeAny): boolean {
  return !field.isOptional();
}