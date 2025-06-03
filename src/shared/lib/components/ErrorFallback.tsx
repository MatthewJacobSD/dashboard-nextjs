'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export function ErrorFallback({ error }: { error: Error }) {
  return (
    <Alert
      variant="error"
      message={error.message}
      action={
        <Button variant="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      }
    />
  );
}