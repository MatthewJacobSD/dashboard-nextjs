'use client'

import { useState, JSX } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CheckCircle, AlertTriangle, Info, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

/* ===== Types ===== */
/**
 * Type definition for toast variants
 * @typedef {'success' | 'error' | 'info' | 'warning' | 'default'} ToastType
 */
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default'

/**
 * Interface for toast content with expandable details
 * @interface IToastContent
 * @property {string} heading - Main heading/title of the toast
 * @property {string|JSX.Element} [message] - Optional secondary message content
 * @property {unknown} [data] - Optional detailed data for expandable section
 * @property {boolean} [expandable] - Whether the data section should be expandable
 */
interface IToastContent {
  heading: string
  message?: string | JSX.Element
  data?: unknown
  expandable?: boolean
}

/**
 * Type mapping toast types to their corresponding icon components
 * @typedef {Record<ToastType, JSX.Element>} TIconMap
 */
type TIconMap = Record<ToastType, JSX.Element>

/* ===== Constants ===== */
/**
 * Mapping of toast types to their corresponding Lucide React icons
 * @constant {TIconMap} IconMap
 */
const IconMap: TIconMap = {
  success: <CheckCircle className="h-5 w-5 text-green-400" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
  info: <Info className="h-5 w-5 text-blue-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
  default: <Info className="h-5 w-5 text-gray-400" />,
} as const

/* ===== Helper Functions ===== */
/**
 * Formats complex data for display in toast details section
 * @function formatData
 * @param {unknown} data - The data to be formatted
 * @returns {string} Formatted string representation of the data
 */
const formatData = (data: unknown): string => {
  if (typeof data === 'string') return data
  if (data instanceof Error) return data.message
  return JSON.stringify(data, null, 2)
}

/* ===== Components ===== */
/**
 * ToastWithDetails component renders a toast message with optional expandable details
 * @component
 * @param {Object} props - Component props
 * @param {IToastContent} props.content - Toast content configuration
 * @param {ToastType} props.type - Type of toast (determines styling and icon)
 * @returns {JSX.Element} Rendered toast component
 */
const ToastWithDetails = ({ content, type }: { content: IToastContent; type: ToastType }) => {
  const [expanded, setExpanded] = useState(false)
  const hasDetails = content.data !== undefined && content.expandable

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-start gap-2">
        {IconMap[type]}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{content.heading}</h4>
          {content.message && (
            <p className="text-xs opacity-80 mt-1">{content.message}</p>
          )}
        </div>
        {hasDetails && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      {hasDetails && expanded && (
        <div className="mt-2 p-2 bg-black/20 rounded text-xs overflow-auto max-h-40">
          <pre className="whitespace-pre-wrap break-words">
            {formatData(content.data)}
          </pre>
        </div>
      )}
    </div>
  )
}

/* ===== Toast API ===== */
/**
 * toastClient provides typed methods for showing different toast notifications
 * @namespace toastClient
 * @property {function} success - Show success toast
 * @property {function} error - Show error toast
 * @property {function} info - Show info toast
 * @property {function} warning - Show warning toast
 */
export const toastClient = {
  /**
   * Shows a success toast notification
   * @method success
   * @param {IToastContent|string} content - Toast content (can be simple string or complex object)
   */
  success: (content: IToastContent | string) => 
    toast(typeof content === 'string' ? content : <ToastWithDetails content={content} type="success" />),
  
  /**
   * Shows an error toast notification
   * @method error
   * @param {IToastContent|string} content - Toast content (can be simple string or complex object)
   */
  error: (content: IToastContent | string) => 
    toast(typeof content === 'string' ? content : <ToastWithDetails content={content} type="error" />),
  
  /**
   * Shows an info toast notification
   * @method info
   * @param {IToastContent|string} content - Toast content (can be simple string or complex object)
   */
  info: (content: IToastContent | string) => 
    toast(typeof content === 'string' ? content : <ToastWithDetails content={content} type="info" />),
  
  /**
   * Shows a warning toast notification
   * @method warning
   * @param {IToastContent|string} content - Toast content (can be simple string or complex object)
   */
  warning: (content: IToastContent | string) => 
    toast(typeof content === 'string' ? content : <ToastWithDetails content={content} type="warning" />),
}

/* ===== Toaster Component ===== */
/**
 * ToasterClient component provides the container for all toast notifications
 * @component
 * @returns {JSX.Element} Toast container component
 */
export const ToasterClient = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName={(ctx) => {
        const base = 'flex flex-col gap-2 border rounded-xl px-4 py-3 shadow-lg min-w-[300px] '
        const type = ctx?.type || 'default'
        
        switch (type) {
          case 'success':
            return base + 'bg-gradient-to-br from-green-900/80 to-black border-green-600/50 text-green-200'
          case 'error':
            return base + 'bg-gradient-to-br from-red-900/80 to-black border-red-600/50 text-red-200'
          case 'info':
            return base + 'bg-gradient-to-br from-blue-900/80 to-black border-blue-600/50 text-blue-200'
          case 'warning':
            return base + 'bg-gradient-to-br from-yellow-900/80 to-black border-yellow-600/50 text-yellow-200'
          default:
            return base + 'bg-gradient-to-br from-gray-900/80 to-black border-gray-700/50 text-gray-200'
        }
      }}
      className="p-4"
    />
  )
}