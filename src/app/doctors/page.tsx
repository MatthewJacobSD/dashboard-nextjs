'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Doctor, createDoctorSchema, updateDoctorSchema, DoctorCreateInput, DoctorUpdateInput } from '@/lib/zod';
import { fetchDoctors, deleteDoctor, createDoctor, updateDoctor } from './actions';
import { Table } from '@/features/doctor/Table';
import { Cards } from '@/features/doctor/Cards';
import { Modal } from '@/components/ui/Modal';
import { CreateDoctorForm } from '@/features/doctor/Form/Create';
import { UpdateDoctorForm } from '@/features/doctor/Form/Update';
import Loading from './loading';

export default function DoctorsPage() {
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

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    try {
      await deleteDoctor(doctorToDelete.id);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete.id));
      toast.success('Doctor deleted successfully');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete doctor');
    } finally {
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
    }
  };

  const handleAddSubmit = async (data: DoctorCreateInput) => {
    try {
      const validated = createDoctorSchema.parse(data);
      const response = await createDoctor(validated);
      setDoctors((prev) => [...prev, response.data]);
      toast.success('Doctor added successfully');
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        throw err.errors.reduce((acc, e) => ({
          ...acc,
          [e.path[0] as keyof DoctorCreateInput]: e.message,
        }), {});
      }
      toast.error(err instanceof Error ? err.message : 'Failed to save doctor');
    }
  };

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
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        throw err.errors.reduce((acc, e) => ({
          ...acc,
          [e.path[0] as keyof DoctorUpdateInput]: e.message,
        }), {});
      }
      toast.error(err instanceof Error ? err.message : 'Failed to save doctor');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-7xl">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Doctors Management</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all doctor records in your system</p>
        </div>

        {/* Control bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Doctor Records</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {doctors.length} {doctors.length === 1 ? 'record' : 'records'} found
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'table'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              } hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Table View
            </button>
            <button
              onClick={() => setView('cards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'cards'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              } hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Cards View
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add New Doctor
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Add doctor modal */}
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

        {/* Edit doctor modal */}
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

        {/* Delete confirmation modal */}
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
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
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
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Content display */}
        {isLoading ? (
          <Loading view={view} />
        ) : (
          <>
            {view === 'table' ? (
              <Table data={doctors} onEdit={handleEdit} onDelete={handleDeleteRequest} />
            ) : (
              <Cards data={doctors} onEdit={handleEdit} onDelete={handleDeleteRequest} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing page {page + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 disabled:opacity-50 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
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