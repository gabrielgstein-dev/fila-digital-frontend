import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fila Digital
          </h1>
          <p className="text-gray-600">
            Sistema moderno de gerenciamento de filas
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/app/demo/new"
            className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Tirar Senha (Demo)
          </Link>
          
          <Link
            href="/admin/login"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Acesso Administrativo
          </Link>
          
          <Link
            href="/display/demo"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Painel de Display (Demo)
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Desenvolvido para modernizar o atendimento ao cliente
          </p>
        </div>
      </div>
    </div>
  );
}
