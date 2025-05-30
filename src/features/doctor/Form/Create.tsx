// components/ui/CreateDoctorForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDoctorSchema, DoctorCreateInput } from '@/lib/zod';
import { SpecializationList, ExperienceLevelList } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CreateDoctorFormProps {
  onSubmit: (data: DoctorCreateInput) => Promise<void>;
  onCancel: () => void;
}

export function CreateDoctorForm({ onSubmit, onCancel }: CreateDoctorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorCreateInput>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      specialization: SpecializationList.General,
      experience: ExperienceLevelList.Novice,
    },
  });

  const handleFormSubmit = async (data: DoctorCreateInput) => {
  console.log('Submitted data:', data);
  await onSubmit(data);
  reset();
};

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">First Name</label>
        <input
          {...register('firstName')}
          className={cn("w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md")}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Last Name</label>
        <input
          {...register('lastName')}
          className={cn("w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md")}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Email</label>
        <input
          {...register('email')}
          className={cn("w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md")}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Address</label>
        <input
          {...register('address')}
          className={cn("w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md")}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Specialization</label>
        <select
          {...register('specialization')}
          className={cn("w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md")}
        >
          <option value="" disabled>Select Specialization</option>
          {Object.values(SpecializationList).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.specialization && (
          <p className="text-red-500 text-sm">{errors.specialization.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Experience</label>
        <select
          {...register('experience')}
          className={cn("w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md")}
        >
          <option value="" disabled>Select Experience</option>
          {Object.values(ExperienceLevelList).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {errors.experience && (
          <p className="text-red-500 text-sm">{errors.experience.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className={cn("px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white")}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={false} // Controlled by useActionState in DoctorsPage
          className={cn("px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white disabled:bg-gray-600")}
        >
          Save
        </button>
      </div>
    </form>
  );
}