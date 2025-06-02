import { DataDisplay, DataDisplayField } from '@/shared/components/ui/generics/DataDisplay';
import { Doctor } from '@/shared/lib/zod';

function DoctorDisplay({
  doctors,
  isLoading,
  onEdit,
  onDelete,
  view,
}: {
  doctors: Doctor[];
  isLoading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
  view: 'cards' | 'table';
}) {
  const doctorFields: DataDisplayField<Doctor>[] = [
    { key: 'firstName', label: 'Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'address', label: 'Address' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'experience', label: 'Experience' },
  ];

  return (
    <DataDisplay
      data={doctors}
      isLoading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      view={view}
      fields={doctorFields}
      emptyMessage="No doctors found"
    />
  );
}

export default DoctorDisplay;