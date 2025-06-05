'use server';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ActionState<T> {
  success: boolean
  error: string | null
  fieldErrors?: Partial<Record<keyof T, string[]>>
  data?: T
}


export async function createUser(
  prevState: ActionState<User>,
  formData: FormData
): Promise<ActionState<User>> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!name || !email || !role) {
    return {
      success: false,
      error: 'All fields are required',
      fieldErrors: {
        ...(name ? {} : { name: ['Name is required'] }),
        ...(email ? {} : { email: ['Email is required'] }),
        ...(role ? {} : { role: ['Role is required'] }),
      },
    };
  }

  try {
    // Mock DB save
    const user = { id: `${Date.now()}`, name, email, role }; // Unique ID for demo
    return { success: true, data: user, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Failed to save user', fieldErrors: {} };
  }
}

export async function editUser(
  prevState: ActionState<User>,
  formData: FormData
): Promise<ActionState<User>> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!id || !name || !email || !role) {
    return {
      success: false,
      error: 'All fields are required',
      fieldErrors: {
        ...(id ? {} : { id: ['ID is required'] }),
        ...(name ? {} : { name: ['Name is required'] }),
        ...(email ? {} : { email: ['Email is required'] }),
        ...(role ? {} : { role: ['Role is required'] }),
      },
    };
  }

  try {
    // Mock DB update
    const user = { id, name, email, role };
    return { success: true, data: user, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Failed to update user', fieldErrors: {} };
  }
}

export async function deleteUser(id: string): Promise<ActionState<User>> {
  if (!id) {
    return { success: false, error: 'ID is required', fieldErrors: {} };
  }

  try {
    // Mock DB delete
    return { success: true, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Failed to delete user', fieldErrors: {} };
  }
}