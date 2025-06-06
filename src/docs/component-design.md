# Component Design Principles

All components are designed to be:

- **Reusable**: Built for multiple contexts
- **Self-contained**: No side effects or global dependencies
- **Styled Inline**: Using Tailwind directly in JSX
- **Type-safe**: Using generic types where applicable

Example: `DataDisplay<T>` renders items as cards or table rows dynamically based on props.
