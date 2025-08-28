import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m`;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatTicketNumber(number: number): string {
  return number.toString().padStart(3, '0');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'WAITING':
      return 'text-yellow-600 bg-yellow-50';
    case 'CALLED':
      return 'text-blue-600 bg-blue-50';
    case 'IN_SERVICE':
      return 'text-purple-600 bg-purple-50';
    case 'COMPLETED':
      return 'text-green-600 bg-green-50';
    case 'NO_SHOW':
    case 'CANCELLED':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'WAITING':
      return 'Aguardando';
    case 'CALLED':
      return 'Chamado';
    case 'IN_SERVICE':
      return 'Em atendimento';
    case 'COMPLETED':
      return 'Concluído';
    case 'NO_SHOW':
      return 'Não compareceu';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
}

export function getPriorityText(priority: number): string {
  switch (priority) {
    case 1:
      return 'Normal';
    case 2:
      return 'Média';
    case 3:
      return 'Alta';
    default:
      return priority > 3 ? 'Urgente' : 'Normal';
  }
}

export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 1:
      return 'text-gray-600 bg-gray-50';
    case 2:
      return 'text-yellow-600 bg-yellow-50';
    case 3:
      return 'text-orange-600 bg-orange-50';
    default:
      return priority > 3 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50';
  }
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateQrCodeUrl(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;
} 