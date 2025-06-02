'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from '@/shared/utils/cnUtils';

const TOAST_VARIANTS = {
  default: {
    className: 'border-l-4 border-primary bg-white text-gray-800',
    progress: 'bg-primary'
  },
  success: {
    className: 'border-l-4 border-success bg-green-50 text-gray-800',
    progress: 'bg-success'
  },
  error: {
    className: 'border-l-4 border-danger bg-red-50 text-gray-800',
    progress: 'bg-danger'
  },
  warning: {
    className: 'border-l-4 border-warning bg-yellow-50 text-gray-800',
    progress: 'bg-warning'
  },
  info: {
    className: 'border-l-4 border-info bg-cyan-50 text-gray-800',
    progress: 'bg-info'
  }
} as const;

export const ToasterClient = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName={(context) => {
        const type = context?.type || 'default';
        const variant = TOAST_VARIANTS[type] || TOAST_VARIANTS.default;
        
        return cn(
          'relative flex p-4 my-2 rounded-lg shadow-sm',
          'min-h-16 w-full max-w-xs sm:max-w-md',
          'backdrop-blur-sm bg-opacity-90',
          variant.className,
          'font-medium text-sm'
        );
      }}
      progressClassName={(context) => 
        cn(
          'Toastify__progress-bar',
          context?.type === 'default' ? TOAST_VARIANTS.default.progress :
          context?.type === 'success' ? TOAST_VARIANTS.success.progress :
          context?.type === 'error' ? TOAST_VARIANTS.error.progress :
          context?.type === 'warning' ? TOAST_VARIANTS.warning.progress : 
          TOAST_VARIANTS.info.progress
        )
      }
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          className={cn(
            'absolute top-3 right-3 p-1 rounded-full',
            'text-gray-400 hover:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          )}
          aria-label="Close notification"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    />
  );
};