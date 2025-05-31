'use client';

// Hook form for smooth form handling
import { useForm } from 'react-hook-form';
// Zod resolver for bulletproof validation
import { zodResolver } from '@hookform/resolvers/zod';
// Schema and types for doctor updates
import { updateDoctorSchema, DoctorUpdateInput } from '@/lib/zod';
// Enum lists for specialization and experience
import { SpecializationList, ExperienceLevelList } from '@/lib/types';
// Utility for clean class merging
import { cn } from '@/lib/utils';

// Props for the update form, typed for safety
interface UpdateDoctorFormProps {
  initialValues: DoctorUpdateInput;
  onSubmit: (data: DoctorUpdateInput) => Promise<void>;
  onCancel: () => void;
}

// Form for updating doctor info, looking sharp
export function UpdateDoctorForm({ initialValues, onSubmit, onCancel }: UpdateDoctorFormProps) {
  // Set up form with Zod validation and initial values
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorUpdateInput>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: initialValues,
  });

  // Handle form submission and reset
  const handleFormSubmit = async (data: DoctorUpdateInput) => {
    await onSubmit(data);
    reset();
  };

  // Render form with vibrant, responsive styles
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <input type="hidden" {...register('id')} />
      <div>
        <label className="block text-sm sm:text-base font-medium text-cyan-500 mb-1">First Name</label>
        <input
          {...register('firstName')}
          className={cn(
            "w-full px-4 py-2 bg-white/95 text-gray-800 border border-gray-200/50 rounded-lg shadow-sm",
            "focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200",
            errors.firstName ? "border-red-300" : "hover:border-yellow-300"
          )}
          aria-invalid={errors.firstName ? 'true' : 'false'}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium text-cyan-500 mb-1">Last Name</label>
        <input
          {...register('lastName')}
          className={cn(
            "w-full px-4 py-2 bg-white/95 text-gray-800 border border-gray-200/50 rounded-lg shadow-sm",
            "focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200",
            errors.lastName ? "border-red-300" : "hover:border-yellow-300"
          )}
          aria-invalid={errors.lastName ? 'true' : 'false'}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium text-cyan-500 mb-1">Email</label>
        <input
          {...register('email')}
          className={cn(
            "w-full px-4 py-2 bg-white/95 text-gray-800 border border-gray-200/50 rounded-lg shadow-sm",
            "focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200",
            errors.email ? "border-red-300" : "hover:border-yellow-300"
          )}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium text-cyan-500 mb-1">Address</label>
        <input
          {...register('address')}
          className={cn(
            "w-full px-4 py-2 bg-white/95 text-gray-800 border border-gray-200/50 rounded-lg shadow-sm",
            "focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200",
            errors.address ? "border-red-300" : "hover:border-yellow-300"
          )}
          aria-invalid={errors.address ? 'true' : 'false'}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium text-cyan-500 mb-1">Specialization</label>
        <select
          {...register('specialization')}
          className={cn(
            "w-full px-4 py-2 bg-white/95 text-gray-800 border border-gray-200/50 rounded-lg shadow-sm appearance-none",
            "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200",
            errors.specialization ? "border-red-300" : "hover:border-orange-300"
          )}
          aria-invalid={errors.specialization ? 'true' : 'false'}
        >
          <option value="" disabled className="bg-gray-50 text-gray-800">
            Select Specialization
          </option>
          {Object.values(SpecializationList).map((value) => (
            <option key={value} value={value} className="bg-gray-50 text-gray-800 hover:bg-orange-100">
              {value}
            </option>
          ))}
        </select>
        {errors.specialization && (
          <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium text-cyan-500 mb-1">Experience</label>
        <select
          {...register('experience')}
          className={cn(
            "w-full px-4 py-2 bg-white/95 text-gray-800 border border-gray-200/50 rounded-lg shadow-sm appearance-none",
            "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200",
            errors.experience ? "border-red-300" : "hover:border-orange-300"
          )}
          aria-invalid={errors.experience ? 'true' : 'false'}
        >
          <option value="" disabled className="bg-gray-50 text-gray-800">
            Select Experience
          </option>
          {Object.values(ExperienceLevelList).map((value) => (
            <option key={value} value={value} className="bg-gray-50 text-gray-800 hover:bg-orange-100">
              {value}
            </option>
          ))}
        </select>
        {errors.experience && (
          <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-300 focus:outline-none hover:scale-105 hover:shadow-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={false}
          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-300 focus:outline-none hover:scale-105 hover:shadow-lg disabled:bg-gray-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}