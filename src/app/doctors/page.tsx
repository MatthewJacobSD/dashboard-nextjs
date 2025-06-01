'use client';

// React hooks for state and effects, keeping it snappy
import { useState, useEffect } from 'react';
// Toastify for those poppin' notifications
import { toast } from 'react-toastify';
// Zod for bulletproof validation
import { z } from 'zod';
// Doctor schemas and types for safety
import { Doctor, createDoctorSchema, updateDoctorSchema, DoctorCreateInput, DoctorUpdateInput } from '@/lib/zod';
// Server actions for CRUD vibes
import { fetchDoctors, deleteDoctor, createDoctor, updateDoctor } from './actions';
// Components for table, cards, modal, and forms
import { Table } from '@/features/doctor/Table';
import { Cards } from '@/features/doctor/Cards';
import { Modal } from '@/components/ui/Modal';
import { CreateDoctorForm } from '@/features/doctor/Form/Create';
import { UpdateDoctorForm } from '@/features/doctor/Form/Update';
import Loading from './loading';

// Main DoctorsPage component, the hub for doctor management
export default function DoctorsPage() {
  // State for doctors, loading, errors, and UI controls
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // Fetch doctors on page/size change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchDoctors(page, size);
        setDoctors(response.data.content);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message :'Failed to load doctors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, size]);

  // Open edit modal with selected doctor
  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteRequest = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  // Confirm and delete doctor
  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    try {
      await deleteDoctor(doctorToDelete.id);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete.id));
      toast.success('Doctor deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete doctor');
    } finally {
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
    }
  };

  // Handle adding new doctor
  const handleAddSubmit = async (data: DoctorCreateInput) => {
    try {
      const validated = createDoctorSchema.parse(data);
      const response = await createDoctor(validated);
      setDoctors((prev) => [...prev, response.data]);
      toast.success('Doctor added successfully');
      setIsAddModalOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw err.errors.reduce((acc, e) => ({
          ...acc,
          [e.path[0] as keyof DoctorCreateInput]: e.message,
        }), {});
      }
      toast.error('Failed to save doctor');
    }
  };

  // Handle updating existing doctor
  const handleEditSubmit = async (data: DoctorUpdateInput) => {
    if (!selectedDoctor) return;
    if (data.id !== selectedDoctor.id) {
      throw new Error('Doctor ID mismatch');
    }
    try {
      const validated = updateDoctorSchema.parse(data);
      const response = await updateDoctor(selectedDoctor.id, validated);
      setDoctors((prev) =>
        prev.map((d) => (d.id === selectedDoctor.id ? response.data : d))
      );
      toast.success('Doctor updated successfully');
      setIsEditModalOpen(false);
      setSelectedDoctor(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw err.errors.reduce((acc, e) => ({
          ...acc,
          [e.path[0] as keyof DoctorUpdateInput]: e.message,
        }), {});
      }
      toast.error('Failed to save doctor');
    }
  };

  // Render the doctors management UI
  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 max-w-7xl">
      <div className="bg-white/95 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200/50">
        {/* Header section, bold and vibrant */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-2">Doctors Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage all doctor records in your system</p>
        </div>

        {/* Control bar for view toggle and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-cyan-500">Doctor Records</h2>
            <p className="text-sm text-gray-600">
              {doctors.length} {doctors.length === 1 ? 'record' : 'records'} found
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                view === 'table'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              Table View
            </button>
            <button
              onClick={() => setView('cards')}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                view === 'cards'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              Cards View
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add New Doctor
            </button>
          </div>
        </div>

        {/* Error display, clean and noticeable */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* Add doctor modal, sleek and vibrant */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Doctor"
        >
          <CreateDoctorForm
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {/* Edit doctor modal, tailored to the doctor */}
        {selectedDoctor && (
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedDoctor(null);
            }}
            title={`Edit Doctor: ${selectedDoctor.firstName} ${selectedDoctor.lastName || ''}`}
          >
            <UpdateDoctorForm
              initialValues={{
                id: selectedDoctor.id,
                firstName: selectedDoctor.firstName,
                lastName: selectedDoctor.lastName || '',
                address: selectedDoctor.address || '',
                email: selectedDoctor.email,
                specialization: selectedDoctor.specialization || 'General',
                experience: selectedDoctor.experience || 'Novice',
              }}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedDoctor(null);
              }}
            />
          </Modal>
        )}

        {/* Delete confirmation modal, serious vibes */}
        {doctorToDelete && (
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDoctorToDelete(null);
            }}
            title="Confirm Deletion"
          >
            <div className="space-y-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-gray-800">
                  {doctorToDelete.firstName} {doctorToDelete.lastName || ''}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDoctorToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Content display, table or cards */}
        {isLoading ? (
          <Loading view={view} />
        ) : (
          <>
            {view === 'table' ? (
              <Table data={doctors} onEdit={handleEdit} onDelete={handleDeleteRequest} />
            ) : (
              <Cards data={doctors} onEdit={handleEdit} onDelete={handleDeleteRequest} />
            )}

            {/* Pagination, clean and functional */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm sm:text-base text-gray-600">
                  Showing page {page + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-gray-200 disabled:opacity-50 text-gray-800 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:bg-gray-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-purple-500 disabled:opacity-50 hover:bg-purple-600 text-white rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}