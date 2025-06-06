# Architecture Overview

The application follows a **modular and scalable architecture**, separating concerns into distinct layers:

- **UI Components**: Reusable building blocks (`Button`, `Dialog`, etc.)
- **Layout Components**: Structural elements (`Sidebar`, `PageHeader`)
- **State Management**: Centralized logic using custom hooks (`useDoctors`)
- **Data Layer**: Server-side operations via `actions/` and `shared/lib/api.ts`
- **Validation & Types**: Zod schemas and type definitions in `shared/lib/zod/`
- **Utilities**: Shared helpers like `debounce`, `cn`, and optimistic updates

All files are strongly typed using TypeScript and follow consistent naming conventions.
