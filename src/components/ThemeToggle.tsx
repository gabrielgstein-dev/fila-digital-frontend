'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`w-6 h-6 transition-all duration-500 ${
            theme === 'light' 
              ? 'text-amber-500 rotate-0 scale-100' 
              : 'text-slate-400 -rotate-90 scale-0'
          }`} 
        />
        <Moon 
          className={`absolute top-0 left-0 w-6 h-6 transition-all duration-500 ${
            theme === 'dark' 
              ? 'text-indigo-400 rotate-0 scale-100' 
              : 'text-slate-400 rotate-90 scale-0'
          }`} 
        />
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  )
}
