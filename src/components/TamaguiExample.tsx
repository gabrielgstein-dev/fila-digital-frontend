'use client'

import React from 'react'

export const TamaguiExample: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Exemplo de Componente
      </h2>
      
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Card com Tema Adaptativo
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Este é um exemplo de como usar temas claro e escuro com Tailwind CSS.
          </p>
          
          <div className="flex space-x-3 justify-end">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
              Cancelar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Confirmar
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3 flex-wrap">
        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
          Botão Pequeno
        </button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors">
          Botão Médio
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
          Botão Grande
        </button>
      </div>
    </div>
  )
}
