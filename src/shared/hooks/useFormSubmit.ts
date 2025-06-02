// shared/hooks/useFormSubmit.ts
import { toast } from 'react-toastify';

interface FormSubmitResult {
  success: boolean;
  errors?: Record<string, string>;
}

export const useFormSubmit = <T,>(
  handler: (data: T) => Promise<FormSubmitResult>
) => {
  return async (data: T): Promise<FormSubmitResult> => {
    try {
      const result = await handler(data);
      if (result.success) {
        toast.success('Operation successful');
      } else if (result.errors) {
        Object.values(result.errors).forEach((error) => {
          toast.error(error);
        });
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Operation failed';
      toast.error(errorMessage);
      return { 
        success: false, 
        errors: { general: errorMessage } 
      };
    }
  };
};