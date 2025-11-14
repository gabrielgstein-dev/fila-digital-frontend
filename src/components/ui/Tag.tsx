import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface TagProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'gray'
  size?: 'sm' | 'md'
  icon?: LucideIcon
  className?: string
}

export function Tag({ 
  children, 
  variant = 'gray', 
  size = 'sm', 
  icon: Icon,
  className = '' 
}: TagProps) {
  const getVariantClasses = (variant: TagProps['variant']) => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'green':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'amber':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'red':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'purple':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getSizeClasses = (size: TagProps['size']) => {
    switch (size) {
      case 'md':
        return 'px-3 py-1.5 text-sm'
      case 'sm':
      default:
        return 'px-2 py-1 text-xs'
    }
  }

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${getVariantClasses(variant)} ${getSizeClasses(size)} ${className}`}
    >
      {Icon && <Icon className={`${size === 'md' ? 'w-4 h-4 mr-2' : 'w-3 h-3 mr-1.5'}`} />}
      {children}
    </span>
  )
}
