'use client'

import { useState, useCallback, useMemo } from 'react'
import { DataDisplay } from '@/components/state/DataDisplay'
import { useDoctors } from '@/shared/hooks/useDoctors'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { CrudForm } from '@/components/form/CrudForm'
import { Doctor } from '@/shared/lib/zod/doctor'
import { createDoctorSchema } from '@/shared/lib/zod/doctor'
import { z } from 'zod'

type CreateDoctor = z.infer<typeof createDoctorSchema>

export default function DoctorsPage() {
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const {
    doctors,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useDoctors({ initialData: [] })

  const displayFields = useMemo(
    () => [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'specialization', label: 'Specialization' },
      { key: 'experience', label: 'Experience' },
    ],
    []
  )

  const formFields = useMemo(
    () => [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
      },
      {
        name: 'specialization',
        label: 'Specialization',
        type: 'select',
        options: ['CARDIOLOGY', 'NEUROLOGY', 'PEDIATRICS'],
      },
      {
        name: 'experience',
        label: 'Experience',
        type: 'select',
        options: ['ENTRY', 'JUNIOR', 'MID', 'SENIOR'],
      },
    ],
    []
  )

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Doctor Management</h1>

      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setShowCreateForm(true)}>Add New Doctor</Button>
      </div>

      <DataDisplay<Doctor>
        data={doctors}
        isLoading={false}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        view={view}
        fields={displayFields}
        emptyMessage="No doctors found. Add one to get started."
      />

      <Dialog open={showCreateForm} onClose={() => setShowCreateForm(false)} title="Add New Doctor">
        <CrudForm<CreateDoctor>
          formAction={handleCreate}
          fields={formFields}
          onCancel={() => setShowCreateForm(false)}
          isOpen={showCreateForm}
        />
      </Dialog>
    </div>
  )
}