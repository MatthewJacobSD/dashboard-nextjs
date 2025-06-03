import { toast } from 'react-toastify';

interface FormSubmitResult {
  success: boolean;
  errors?: Record<string, string>;
}

/**
 * Generic hook for handling form submissions with toast notifications and error capturing.
 * Wrap your async form handlers with this to standardize feedback behavior.
 *
 * @param handler - The async function that handles the actual form submission logic.
 * @returns A wrapped handler with toast notifications and structured error management.
 */
export const useFormSubmit = <T,>(
  handler: (data: T) => Promise<FormSubmitResult>
) => {
  return async (data: T): Promise<FormSubmitResult> => {
    try {
      const result = await handler(data);

      if (result.success) {
        toast.success('Saved successfully!');
      } else if (result.errors) {
        toast.error(
          result.errors.general || 'There were issues with your submission.'
        );
      }

      return result;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMsg);
      return {
        success: false,
        errors: { general: errorMsg },
      };
    }
  };
};
