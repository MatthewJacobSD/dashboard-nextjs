'use client';

import { useState } from 'react';
import { CrudForm, FieldConfig } from '@/components/form/CrudForm';
import { DataDisplay, DataDisplayField } from '@/components/state/DataDisplay';
import { StatsGrid, StatsData } from '@/components/stats/StatsGrid';
import { createUser, deleteUser, editUser, User } from './action';
import { toast, ToastContainer } from 'react-toastify';
import { ActionState } from './action';

import 'react-toastify/dist/ReactToastify.css';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: '3', name: 'Alex Brown', email: 'alex@example.com', role: 'Guest' },
  ]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Sample stats data for StatsGrid
  const stats: StatsData = {
    doctors: 10,
    patients: users.length,
    medications: 50,
    appointments: 20,
    prescriptions: 30,
    visits: 15,
    insurances: 5,
  };
  const previousStats: StatsData = {
    doctors: 8,
    patients: users.length - 1,
    medications: 45,
    appointments: 18,
    prescriptions: 28,
    visits: 12,
    insurances: 4,
  };

  const fields: FieldConfig<User>[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: ['Admin', 'User', 'Guest'],
      required: true,
    },
  ];

  const displayFields: DataDisplayField<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  const handleCreate = async (prev: ActionState<User>, formData: FormData) => {
    const result = await createUser(prev, formData);
    if (result.success && result.data) {
      setUsers([...users, result.data]);
      setIsAddOpen(false);
      toast.success('User created successfully!');
    } else {
      toast.error(result.error || 'Failed to create user');
    }
    return result;
  };

  const handleEdit = async (prev: ActionState<User>, formData: FormData) => {
    const result = await editUser(prev, formData);
    if (result.success && result.data) {
      setUsers(users.map((u) => (u.id === result.data!.id ? result.data! : u)));
      setIsEditOpen(false);
      setCurrentEditUser(null);
      toast.success('User updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update user');
    }
    return result;
  };

  const handleDelete = async (user: User) => {
    const result = await deleteUser(user.id);
    if (result.success) {
      setUsers(users.filter((u) => u.id !== user.id));
      toast.success('User deleted successfully!');
    } else {
      toast.error(result.error || 'Failed to delete user');
    }
    return result;
  };

  const totalPages = Math.ceil(users.length / size);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <StatsGrid stats={stats} previousStats={previousStats} />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add User
          </button>
        </div>

        <DataDisplay<User>
          data={users}
          fields={displayFields}
          onEdit={(user) => {
            setCurrentEditUser(user);
            setIsEditOpen(true);
          }}
          onDelete={handleDelete}
          view="cards"
          page={page}
          size={size}
          totalPages={totalPages}
          onPageChange={(newPage, newSize) => {
            setPage(newPage);
            setSize(newSize);
          }}
          emptyMessage="No users found"
        />

        <CrudForm<User>
          initialValues={{ name: '', email: '', role: '' }}
          formAction={handleCreate}
          fields={fields}
          onCancel={() => setIsAddOpen(false)}
          isOpen={isAddOpen}
          title="Create User"
        />

        {currentEditUser && (
          <CrudForm<User>
            initialValues={currentEditUser}
            formAction={handleEdit}
            fields={[
              ...fields,
              { name: 'id', label: 'ID', type: 'text', required: true },
            ]}
            onCancel={() => {
              setIsEditOpen(false);
              setCurrentEditUser(null);
            }}
            isOpen={isEditOpen}
            title="Edit User"
          />
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
