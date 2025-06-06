# SanaSpace Dashboard

> Admin dashboard for managing doctors and more

A clean, scalable, and strongly-typed Next.js + TypeScript + TailwindCSS application with reusable components, server actions, and a modular architecture. Designed with scalability in mind and built for maintainability using documentation over excessive inline comments.

---

## 🧾 Overview

SanaSpace is an admin dashboard designed for managing healthcare professionals and related entities like patients, medications, and prescriptions. It follows modern best practices for component design, state management, and type safety using TypeScript, Zod, React Hook Form patterns, and ESLint + Prettier for code consistency.

### Key Features

- ✅ Strongly typed components and utilities
- 🧱 Reusable UI primitives (Button, Dialog, Alert, etc.)
- 🔁 Optimistic updates & form handling
- 📊 Data display with sorting, pagination, and view toggles
- 🗂 Modular folder structure with access restrictions
- 🧪 Server Actions for CRUD operations
- 📄 Extensive documentation in `/docs`

---

## 🧰 Tech Stack

| Tool                      | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| **Next.js 14 App Router** | SSR, routing, layout system                      |
| **TypeScript**            | Type safety across the app                       |
| **Tailwind CSS**          | Utility-first styling                            |
| **Zod**                   | Validation schemas                               |
| **ESLint + Prettier**     | Code linting and formatting                      |
| **React Hook APIs**       | Custom hooks (`useOptimistic`, `useActionState`) |
| **Lucide Icons**          | Clean, consistent icons                          |
| **react-toastify**        | Toast notifications                              |
| **clsx + tailwind-merge** | Class utility (`cn`)                             |

---

## 📁 Project Structure

```
my-nextjs-project/
├── app/                  # Pages and layouts (Next.js App Router)
├── components/           # Reusable UI components
│   ├── ui/               # Primitive components: Button, Dialog, etc.
│   ├── layout/             # Layout components: Sidebar, PageHeader
│   ├── stats/              # StatCard for dashboard
│   ├── state/              # Generic data display + pagination
│   └── form/               # CRUD forms
├── shared/               # Shared logic and types
│   ├── lib/                # Types, API client, Zod schemas
│   ├── utils/              # Helper functions (debounce, cn)
│   └── hooks/              # Custom hooks (e.g., useDoctors)
├── actions/              # Server Actions (createDoctor, fetchDoctors)
├── docs/                 # Architecture, flow, troubleshooting guides
├── public/               # Static assets (favicon)
├── styles/               # Global CSS (with Tailwind directives)
└── ...
```

---

## 🛠 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js >= 18.x
- npm or yarn
- Git (for version control)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourname/sanaspace-dashboard.git
cd sanaspace-dashboard

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🚀 Scripts

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start development server         |
| `npm run build`  | Build production-ready app       |
| `npm run start`  | Run built app in production mode |
| `npm run lint`   | Lint files using ESLint          |
| `npm run format` | Format code using Prettier       |

---

## 📚 Documentation

All architectural and implementation details are documented in the `/docs` folder:

| File                   | Description                           |
| ---------------------- | ------------------------------------- |
| `architecture.md`      | System architecture overview          |
| `data-flow.md`         | How data flows through the app        |
| `component-design.md`  | Principles behind reusable components |
| `how-to-contribute.md` | Contribution and coding standards     |
| `troubleshooting.md`   | Common issues and fixes               |

---

## 🧪 Code Quality

We enforce high-quality code via:

- 🔍 ESLint with import restrictions
- 💅 Prettier for consistent formatting
- 🧠 TypeScript strict mode
- 📐 Zod validation for all forms and API responses

Run linting and formatting:

```bash
npm run lint
npm run format
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contribution Guide](docs/how-to-contribute.md) before opening a PR.

---

## 📌 Design Decisions

### Why this stack?

- **Next.js App Router**: Modern routing and layout system
- **TailwindCSS**: Utility-first styling keeps CSS simple and scoped
- **Server Actions**: Simplifies backend integration
- **Zod**: For schema validation and type inference
- **Generics**: Used heavily for reusable components like `DataDisplay<T>` and `CrudForm<T>`
- **Documentation over JSDoc**: Reduces clutter while keeping clarity

---

## 🧪 Future Improvements

- Add authentication layer
- Integrate Zustand or Redux Toolkit for global state (if needed)
- Add unit tests using Jest + React Testing Library
- Add CI/CD pipelines
- Add Storybook or Chromatic for component library

---

## ❤️ Support

If you found this project helpful or would like to contribute, feel free to give it a star ⭐ on GitHub!

---
