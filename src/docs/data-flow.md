# Data Flow

1. **User Interaction**

   - User submits form or navigates pages

2. **Client-Side Hook (`useDoctors`)**

   - Manages local state and optimistic updates
   - Triggers server action via `useActionState`

3. **Server Action (`actions/doctors/*`)**

   - Validates input using Zod
   - Calls API service
   - Revalidates cache

4. **API Service (`shared/lib/api.ts`)**

   - Abstracts HTTP calls
   - Handles revalidation and caching

5. **Response Handling**
   - Updates UI optimistically
   - Shows toast notifications
   - Handles errors gracefully
