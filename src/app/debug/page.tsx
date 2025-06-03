'use client';

import { createPatientSchema } from '@/shared/lib/zod/patient';
import { zodSchemaToFormFields } from '@/shared/lib/components/form/schemaToForm';

export default function DebugPage() {
  const fields = zodSchemaToFormFields(createPatientSchema);

  return (
    <div>
      <h2>Generated Form Fields</h2>
      <pre>{JSON.stringify(fields, null, 2)}</pre>
    </div>
  );
}