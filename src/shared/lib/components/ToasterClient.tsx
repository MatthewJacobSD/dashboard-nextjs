'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Default styles for toast

/**
 * 🧨 Toaster Notification Component
 *
 * Uses react-toastify with custom styling to match the global design system.
 * Shows success, error, warning, info messages with themed borders.
 */
export const ToasterClient = () => {
  // 🎨 Border styles mapped by toast type
  const toastStyle = {
    default: 'border-orange',
    success: 'border-green',
    error: 'border-red',
    warning: 'border-yellow',
    info: 'border-cyan',
  } as const;

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName={(context) => {
        const type = context?.type;
        const borderClass = type && (type in toastStyle)
          ? toastStyle[type]
          : toastStyle.default;

        // 🧱 Apply themed alert style with animation
        return `alert relative flex p-space-md my-space-sm rounded-radius-md shadow-md bg-surface text-card-foreground border-l-4 ${borderClass} animate-fadeIn`;
      }}
    />
  );
};