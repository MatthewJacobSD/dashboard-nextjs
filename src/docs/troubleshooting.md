# Troubleshooting Guide

| Issue                          | Solution                                                  |
| ------------------------------ | --------------------------------------------------------- |
| Form validation fails silently | Check `fieldErrors` prop and ensure schema matches        |
| Optimistic update not working  | Verify reducer function in `useOptimistic`                |
| Server action not updating UI  | Make sure to call `revalidatePath()`                      |
| Styling breaks on build        | Avoid dynamic class names; prefer static Tailwind classes |
| ESLint/Prettier not formatting | Run `npm run lint --fix` or check `.vscode/settings.json` |

For further help, consult the appropriate team member or open an issue in the repo.
