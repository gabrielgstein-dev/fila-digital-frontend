'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main spinner */}
        <div className={`${sizeClasses[size]} border-4 border-slate-200 dark:border-slate-700 rounded-full animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Inner glow effect */}
        <div className={`absolute inset-1 ${sizeClasses[size]} bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-sm animate-pulse`}></div>
      </div>
      
      {text && (
        <p className={`mt-4 text-slate-600 dark:text-slate-400 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}
