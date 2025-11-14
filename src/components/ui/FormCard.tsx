import React from 'react'
import { LucideIcon, Sparkles } from 'lucide-react'

interface FormCardProps {
  title: string
  subtitle?: string
  badge?: {
    label: string
    icon?: LucideIcon
  }
  children: React.ReactNode
  className?: string
}

export function FormCard({ title, subtitle, badge, children, className }: FormCardProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className || ''}`}>
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
        
        {/* Form Header */}
        <div className="mb-8">
          {badge && (
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full px-4 py-2 mb-4">
              {badge.icon ? (
                <badge.icon className="w-4 h-4 text-blue-500" />
              ) : (
                <Sparkles className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {badge.label}
              </span>
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  )
}

