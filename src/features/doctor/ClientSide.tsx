'use client'

import { useState, useEffect, useCallback, useOptimistic, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { debounce } from 'lodash'

import {
  Doctor,
  PartialDoctor,
  createDoctorSchema,
  updateDoctorSchema,
} from '@/lib/zod'

import {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
} from '@/app/doctors/actions'

import { Table } from '@/features/doctor/Table'
import { Cards } from '@/features/doctor/Cards'
import { DoctorForm } from './Form'

interface ClientSideProps {
  genesisData: Doctor[]
  wrappedPages: number
}

export function DoctorClientSide({ genesisData, wrappedPages }: ClientSideProps) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>(genesisData)
  const [totalPages, setTotalPages] = useState(wrappedPages)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDoctor, setCurrentDoctor] = useState<PartialDoctor | null>(null)

  // Optimistic rendering
  const [optimisticDoctors, addOptimisticDoctor] = useOptimistic(
    doctors,
    (state, action: { type: 'add' | 'update' | 'delete'; doctor?: PartialDoctor; id?: string }) => {
      switch (action.type) {
        case 'add':
          return action.doctor ? [...state, action.doctor as Doctor] : state
        case 'update':
          return action.doctor
            ? state.map((d) => (d.id === action.doctor!.id ? (action.doctor as Doctor) : d))
            : state
        case 'delete':
          return state.filter((d) => d.id !== action.id)
        default:
          return state
      }
    }
  )

  // Fetch doctors based on page and search query
  const fetchDoctors = useCallback(async (page = 1, query = '') => {
    try {
      const res = await getDoctors(page, 10)
      setDoctors(res.content)
      setTotalPages(res.totalPages)
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
    }
  }, [])

  useEffect(() => {
    const delayedFetch = debounce(() => fetchDoctors(currentPage, searchQuery), 300)
    delayedFetch()
    return () => delayedFetch.cancel()
  }, [searchQuery, currentPage])

  // Handle pagination
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // Open modal for create/edit
  const openModal = (doctor: PartialDoctor | null = null) => {
    setCurrentDoctor(doctor)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentDoctor(null)
  }

  // Submit form using Zod validation and server actions
  const handleSubmit = async (formData: FormData) => {
    const rawFormData = Object.fromEntries(formData.entries())
    const parsed = currentDoctor?.id
      ? updateDoctorSchema.safeParse(rawFormData)
      : createDoctorSchema.safeParse(rawFormData)

    if (!parsed.success) {
      const errorMessage = parsed.error.errors.map((e) => e.message).join(', ')
      alert(`Validation failed: ${errorMessage}`)
      return
    }

    try {
      if (currentDoctor?.id) {
        // Update
        addOptimisticDoctor({ type: 'update', doctor: parsed.data })
        const updated = await updateDoctor(currentDoctor.id, parsed.data)
        setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
      } else {
        // Create
        addOptimisticDoctor({ type: 'add', doctor: parsed.data })
        const created = await createDoctor(parsed.data)
        setDoctors((prev) => [...prev, created])
      }
      closeModal()
    } catch (error) {
      alert(`Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Delete handler
  const handleDelete = async (doctor: PartialDoctor) => {
    if (!confirm(`Are you sure you want to delete ${doctor.firstName}?`)) return

    addOptimisticDoctor({ type: 'delete', id: doctor.id })
    try {
      await deleteDoctor(doctor.id!)
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id))
    } catch (error) {
      alert(`Failed to delete doctor: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="p-6">
      {/* Search + Add */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button onClick={() => openModal()}>Add Doctor</button>
      </div>

      {/* Table / Cards View */}
      <Table
        data={optimisticDoctors}
        onEdit={(doctor) => openModal(doctor)}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            disabled={currentPage === i + 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              {currentDoctor?.id ? 'Edit Doctor' : 'Create New Doctor'}
            </h2>
            <DoctorForm
              initialValues={currentDoctor ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  )
}