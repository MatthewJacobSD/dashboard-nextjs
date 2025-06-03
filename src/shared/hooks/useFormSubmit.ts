import { toast } from 'react-toastify';

// Result type returned by form submit handler — success status + optional error object
interface FormSubmitResult {
  success: boolean;
  errors?: Record<string, string>;
}

// Generic hook for handling form submissions with unified error/success handling
export const useFormSubmit = <T,>(
  handler: (data: T) => Promise<FormSubmitResult>
) => {
  // Returns an async function that wraps the handler with try/catch & toast notifications
  return async (data: T): Promise<FormSubmitResult> => {
    try {
      // Run the provided handler function with the form data
      const result = await handler(data);

      // Show success message if operation was successful
      if (result.success) {
        toast.success('Operation successful');
      } 
      // Show individual error messages if there are validation errors
      else if (result.errors) {
        Object.values(result.errors).forEach((error) => {
          toast.error(error);
        });
      }

      // Return the result to let the form know what happened
      return result;
    } catch (error) {
      // Catch any unexpected errors and format a user-friendly message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Operation failed';

      // Show a toast error for the user
      toast.error(errorMessage);

      // Return failure result with the error
      return { 
        success: false, 
        errors: { general: errorMessage } 
      };
    }
  };
};