'use client';

// 🏗️ Imports
import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Doctor, createDoctorSchema, updateDoctorSchema, DoctorCreateInput } from '@/lib/zod';
import { fetchDoctors, deleteDoctor, createDoctor, updateDoctor } from './actions';
import { Table } from '@/features/doctor/Table';
import { Cards } from '@/features/doctor/Cards';
import Loading from './loading';
import { SpecializationList, ExperienceLevelList } from '@/lib/types';

export default function DoctorsPage() {
  // 🎛️ State management
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // 📝 Form state
  const [formData, setFormData] = useState<DoctorCreateInput>({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    specialization: SpecializationList.General,
    experience: ExperienceLevelList.Novice,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DoctorCreateInput, string>>>({});

  // 📡 Fetch doctors on page/size change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchDoctors(page, size);
        setDoctors(response.data.content);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load doctors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, size]);

  // ✏️ Edit doctor (open modal with doctor data)
  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName || '',
      address: doctor.address || '',
      email: doctor.email,
      specialization: doctor.specialization || SpecializationList.General, // Fallback to default
      experience: doctor.experience || ExperienceLevelList.Novice, // Fallback to default
    });
    setIsEditModalOpen(true);
  };

  // 🗑️ Delete doctor with confirmation
  const handleDelete = async (doctor: Doctor) => {
    if (!confirm(`Delete ${doctor.firstName} ${doctor.lastName || ''}?`)) return;
    try {
      await deleteDoctor(doctor.id);
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
      toast.success('Doctor deleted successfully');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete doctor');
    }
  };

  // 📝 Handle form submission (add or edit)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (selectedDoctor) {
        // ✏️ Update existing doctor
        const validated = updateDoctorSchema.parse({
          id: selectedDoctor.id,
          ...formData,
        });
        const response = await updateDoctor(selectedDoctor.id, validated);
        setDoctors((prev) =>
          prev.map((d) => (d.id === selectedDoctor.id ? response.data : d))
        );
        toast.success('Doctor updated successfully');
      } else {
        // ➕ Create new doctor
        const validated = createDoctorSchema.parse(formData);
        const response = await createDoctor(validated);
        setDoctors((prev) => [...prev, response.data]);
        toast.success('Doctor added successfully');
      }
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        specialization: SpecializationList.General,
        experience: ExperienceLevelList.Novice,
      });
      setSelectedDoctor(null);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const errors: Partial<Record<keyof DoctorCreateInput, string>> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            errors[e.path[0] as keyof DoctorCreateInput] = e.message;
          }
        });
        setFormErrors(errors);
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to save doctor');
      }
    }
  };

  // ✏️ Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof DoctorCreateInput
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">Doctors</h1>

      {/* 🎛️ Control bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-100">Doctors Data</h2>
          <p className="text-sm text-gray-500">View and manage doctor records</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded text-white ${view === 'table' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            Table View
          </button>
          <button
            onClick={() => setView('cards')}
            className={`px-4 py-2 rounded text-white ${view === 'cards' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            Cards View
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Add Doctor
          </button>
        </div>
      </div>

      {/* ❌ Error display */}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {/* ➕ Add doctor modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Add New Doctor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['firstName', 'lastName', 'address', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-400">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field as keyof DoctorCreateInput]}
                    onChange={(e) => handleInputChange(e, field as keyof DoctorCreateInput)}
                    className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  {formErrors[field as keyof DoctorCreateInput] && (
                    <p className="text-red-500 text-sm">{formErrors[field as keyof DoctorCreateInput]}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm text-gray-400">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => handleInputChange(e, 'specialization')}
                  className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {Object.values(SpecializationList).map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400">Experience</label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange(e, 'experience')}
                  className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {Object.values(ExperienceLevelList).map((exp) => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormErrors({});
                    setFormData({
                      firstName: '',
                      lastName: '',
                      address: '',
                      email: '',
                      specialization: SpecializationList.General,
                      experience: ExperienceLevelList.Novice,
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ Edit doctor modal */}
      {isEditModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Edit Doctor: {selectedDoctor.firstName} {selectedDoctor.lastName || ''}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['firstName', 'lastName', 'address', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-400">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field as keyof DoctorCreateInput]}
                    onChange={(e) => handleInputChange(e, field as keyof DoctorCreateInput)}
                    className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  {formErrors[field as keyof DoctorCreateInput] && (
                    <p className="text-red-500 text-sm">{formErrors[field as keyof DoctorCreateInput]}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm text-gray-400">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => handleInputChange(e, 'specialization')}
                  className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {Object.values(SpecializationList).map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400">Experience</label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange(e, 'experience')}
                  className="w-full p-2 bg-gray-800 text-gray-100 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {Object.values(ExperienceLevelList).map((exp) => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setFormErrors({});
                    setSelectedDoctor(null);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      address: '',
                      email: '',
                      specialization: SpecializationList.General,
                      experience: ExperienceLevelList.Novice,
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👀 Content display */}
      {isLoading ? (
        <Loading view={view} />
      ) : (
        <>
          {view === 'table' ? (
            <Table data={doctors} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <Cards data={doctors} onEdit={handleEdit} onDelete={handleDelete} />
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-4">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-gray-100">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}