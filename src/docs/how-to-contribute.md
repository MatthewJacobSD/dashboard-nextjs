# How to Contribute

1. **Folder Navigation**

   - All feature-specific logic lives in its own directory
   - Keep changes within scope of relevant folders

2. **Component Creation**

   - Add new components to `/components/ui` or `/components/state`
   - Ensure strong typing and reusable design

3. **Hook Development**

   - Custom hooks go in `/shared/hooks`
   - Use `useOptimistic`, `useTransition`, and `useActionState` appropriately

4. **Testing & Debugging**
   - Use `console.log` with emoji-based logging (e.g., 🔥, ⚠️) for clarity
   - Leverage VS Code settings for auto-fixing linting/formatting issues
