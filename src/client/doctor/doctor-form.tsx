'use client';

/*============Imports============*/
import { useActionState } from 'react';
import { cn } from '@/shared/utils/cn';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Doctor } from '@/shared/lib/zod/doctor';
import { Specialization, Experience } from '@/shared/lib/zod/common';

/*============Types============*/
interface ActionState {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  data?: Doctor;
}

interface DoctorFormProps {
  doctor?: Doctor | null;
  formAction: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  onCancel: () => void;
  isOpen: boolean;
}

/*============DoctorForm Component============*/
/**
 * Modal form for creating or updating a doctor record, using React 19 useActionState.
 * Matches doctorSchema fields and supports validation errors and loading state.
 */
export function DoctorForm({ doctor, formAction, onCancel, isOpen }: DoctorFormProps) {
  const [state, submitAction, isPending] = useActionState(formAction, {
    success: false,
    error: null,
    fieldErrors: {},
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <form
        action={submitAction}
        className={cn(
          'bg-card border border-border rounded-m p-m shadow-md',
          'space-y-m w-full max-w-md mx-4',
          'animate-slide-in'
        )}
      >
        {/* First Name Field */}
        <div className="space-y-xs">
          <label htmlFor="firstName" className="text-gray-900 font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={doctor?.firstName || ''}
            className={cn(
              'w-full p-sm border border-border rounded-m text-base text-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-accent',
              'transition-all duration-200',
              state.fieldErrors?.firstName && 'border-red-500'
            )}
            disabled={isPending}
            required
          />
          {state.fieldErrors?.firstName && (
            <p className="text-red-500 text-xs">{state.fieldErrors.firstName[0]}</p>
          )}
        </div>

        {/* Last Name Field */}
        <div className="space-y-xs">
          <label htmlFor="lastName" className="text-gray-900 font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={doctor?.lastName || ''}
            className={cn(
              'w-full p-sm border border-border rounded-m text-base text-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-accent',
              'transition-all duration-200',
              state.fieldErrors?.lastName && 'border-red-500'
            )}
            disabled={isPending}
            required
          />
          {state.fieldErrors?.lastName && (
            <p className="text-red-500 text-xs">{state.fieldErrors.lastName[0]}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-xs">
          <label htmlFor="address" className="text-gray-900 font-medium">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={doctor?.address || ''}
            className={cn(
              'w-full p-sm border border-border rounded-m text-base text-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-accent',
              'transition-all duration-200',
              state.fieldErrors?.address && 'border-red-500'
            )}
            disabled={isPending}
          />
          {state.fieldErrors?.address && (
            <p className="text-red-500 text-xs">{state.fieldErrors.address[0]}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-xs">
          <label htmlFor="email" className="text-gray-900 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={doctor?.email || ''}
            className={cn(
              'w-full p-sm border border-border rounded-m text-base text-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-accent',
              'transition-all duration-200',
              state.fieldErrors?.email && 'border-red-500'
            )}
            disabled={isPending}
            required
          />
          {state.fieldErrors?.email && (
            <p className="text-red-500 text-xs">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        {/* Specialization Field */}
        <div className="space-y-xs">
          <label htmlFor="specialization" className="text-gray-900 font-medium">
            Specialization
          </label>
          <select
            id="specialization"
            name="specialization"
            defaultValue={doctor?.specialization || 'General'}
            className={cn(
              'w-full p-sm border border-border rounded-m text-base text-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-accent',
              'transition-all duration-200',
              state.fieldErrors?.specialization && 'border-red-500'
            )}
            disabled={isPending}
          >
            {Object.values(Specialization).map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {state.fieldErrors?.specialization && (
            <p className="text-red-500 text-xs">{state.fieldErrors.specialization[0]}</p>
          )}
        </div>

        {/* Experience Field */}
        <div className="space-y-xs">
          <label htmlFor="experience" className="text-gray-900 font-medium">
            Experience
          </label>
          <select
            id="experience"
            name="experience"
            defaultValue={doctor?.experience || 'Novice'}
            className={cn(
              'w-full p-sm border border-border rounded-m text-base text-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-purple-accent',
              'transition-all duration-200',
              state.fieldErrors?.experience && 'border-red-500'
            )}
            disabled={isPending}
          >
            {Object.values(Experience).map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
          {state.fieldErrors?.experience && (
            <p className="text-red-500 text-xs">{state.fieldErrors.experience[0]}</p>
          )}
        </div>

        {/* Error Message */}
        {state.error && !state.fieldErrors && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-xs justify-end mt-m">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
            className="text-gray-575 hover:text-gray-900 hover:bg-gray-350"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? <LoadingSpinner size="sm" variant="primary" /> : doctor ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}