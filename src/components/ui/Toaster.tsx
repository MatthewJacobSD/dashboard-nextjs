'use client';

// Toastify for those poppin' notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toaster component, styled to match the app's vibe
export const ToasterClient = () => {
  // Border styles for different toast types
  const toastStyle = {
    default: 'border-purple-500',
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-cyan-500',
  } as const;

  // Render ToastContainer with custom styles
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
      theme="light" // Switched to light for brighter look
      toastClassName={(context) => {
        const type = context?.type;
        const borderClass = type && (type in toastStyle)
          ? toastStyle[type]
          : toastStyle.default;

        // Custom toast styles, bright and vibrant
        return `relative flex p-3 my-2 rounded-md shadow-lg bg-white/90 text-gray-700 border-l-4 ${borderClass} backdrop-blur-sm text-sm sm:text-base`;
      }}
    />
  );
};