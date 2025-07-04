import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, FileText, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LocationCategory } from '../types';
import { getCategoryStyle } from '../utils/categoryStyles';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude?: number;
  longitude?: number;
  defaultName?: string;
}

export function AddLocationModal({ isOpen, onClose, latitude, longitude, defaultName }: AddLocationModalProps) {
  const { addLocation } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as LocationCategory,
    date: '',
    note: '',
    image: '',
  });

  // Update form data when defaultName changes
  useEffect(() => {
    if (defaultName) {
      setFormData(prev => ({ ...prev, name: defaultName }));
    }
  }, [defaultName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !latitude || !longitude) return;

    addLocation({
      name: formData.name,
      category: formData.category,
      latitude,
      longitude,
      date: formData.date || undefined,
      note: formData.note || undefined,
      image: formData.image || undefined,
    });

    // Reset form
    setFormData({
      name: '',
      category: 'other',
      date: '',
      note: '',
      image: '',
    });
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      category: 'other',
      date: '',
      note: '',
      image: '',
    });
    onClose();
  };

  const categories: { value: LocationCategory; label: string; icon: string }[] = [
    { value: 'born', label: 'Born', icon: '🏡' },
    { value: 'lived', label: 'Lived', icon: '🏠' },
    { value: 'traveled', label: 'Traveled', icon: '✈️' },
    { value: 'studied', label: 'Studied', icon: '🎓' },
    { value: 'other', label: 'Other', icon: '📍' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add Location</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., New York City"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const style = getCategoryStyle(category.value);
                    return (
                      <label
                        key={category.value}
                        className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.category === category.value
                            ? `${style.borderColor} ${style.lightBg}`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as LocationCategory })}
                          className="sr-only"
                        />
                        <span className="text-base sm:text-lg">{category.icon}</span>
                        <span className="text-xs sm:text-sm font-medium">{category.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                  Memory or Note (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Share a memory about this place..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base resize-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                >
                  Add Location
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}