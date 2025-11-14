import React from 'react'
import { Search, Filter } from 'lucide-react'
import { QueueType } from '@/types'

interface FilterOption {
  value: string
  label: string
}

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterValue: string
  onFilterChange: (value: string) => void
  filterOptions: FilterOption[]
  searchPlaceholder?: string
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  searchPlaceholder = "Buscar..."
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

// Componente específico para filas com opções pré-definidas
interface QueueSearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterType: QueueType | 'ALL'
  onFilterChange: (value: QueueType | 'ALL') => void
}

export function QueueSearchAndFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange
}: QueueSearchAndFiltersProps) {
  const filterOptions = [
    { value: 'ALL', label: 'Todos os tipos' },
    { value: QueueType.GENERAL, label: 'Geral' },
    { value: QueueType.PRIORITY, label: 'Prioritária' },
    { value: QueueType.VIP, label: 'VIP' }
  ]

  return (
    <SearchAndFilters
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      filterValue={filterType}
      onFilterChange={(value) => onFilterChange(value as QueueType | 'ALL')}
      filterOptions={filterOptions}
      searchPlaceholder="Buscar filas..."
    />
  )
}
