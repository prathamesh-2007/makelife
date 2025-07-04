import { LocationCategory } from '../types';

export const categoryStyles = {
  born: {
    color: '#ef4444',
    bgColor: 'bg-red-500',
    textColor: 'text-red-600',
    borderColor: 'border-red-500',
    lightBg: 'bg-red-50',
    icon: '🏡',
    label: 'Born',
  },
  lived: {
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    lightBg: 'bg-blue-50',
    icon: '🏠',
    label: 'Lived',
  },
  traveled: {
    color: '#10b981',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-500',
    lightBg: 'bg-emerald-50',
    icon: '✈️',
    label: 'Traveled',
  },
  studied: {
    color: '#f59e0b',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-500',
    lightBg: 'bg-amber-50',
    icon: '🎓',
    label: 'Studied',
  },
  other: {
    color: '#8b5cf6',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-500',
    lightBg: 'bg-purple-50',
    icon: '📍',
    label: 'Other',
  },
};

export function getCategoryStyle(category: LocationCategory) {
  return categoryStyles[category];
}