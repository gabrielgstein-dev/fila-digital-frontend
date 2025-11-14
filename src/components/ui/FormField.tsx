import React, { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import { FieldError } from 'react-hook-form'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: FieldError
  helperText?: string
  required?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon: Icon, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative group">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 
              bg-slate-50 dark:bg-slate-700 
              border border-slate-200 dark:border-slate-600 
              rounded-xl text-slate-900 dark:text-white 
              placeholder-slate-500 dark:placeholder-slate-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-200 
              hover:border-slate-300 dark:hover:border-slate-500
              ${error ? 'border-red-300 dark:border-red-600' : ''}
              ${className || ''}
            `}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
            {error.message}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: FieldError
  helperText?: string
  required?: boolean
  children: React.ReactNode
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, required, className, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <select
          ref={ref}
          className={`
            block w-full px-4 py-4 
            bg-slate-50 dark:bg-slate-700 
            border border-slate-200 dark:border-slate-600 
            rounded-xl text-slate-900 dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-200 
            hover:border-slate-300 dark:hover:border-slate-500
            ${error ? 'border-red-300 dark:border-red-600' : ''}
            ${className || ''}
          `}
          {...props}
        >
          {children}
        </select>
        
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
            {error.message}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: FieldError
  helperText?: string
  required?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <textarea
          ref={ref}
          className={`
            block w-full px-4 py-4 
            bg-slate-50 dark:bg-slate-700 
            border border-slate-200 dark:border-slate-600 
            rounded-xl text-slate-900 dark:text-white 
            placeholder-slate-500 dark:placeholder-slate-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-200 
            hover:border-slate-300 dark:hover:border-slate-500
            resize-none
            ${error ? 'border-red-300 dark:border-red-600' : ''}
            ${className || ''}
          `}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
            {error.message}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

