"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Calendar } from './calendar';

export function CalendarPopup({ 
  isOpen, 
  onClose, 
  onSelect,
  selected,
  mode = "range",
  ...props 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Calendar Container */}
      <div className="relative z-50 w-full max-w-md mx-auto p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Select Dates
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Calendar */}
          <div className="p-4">
            <Calendar
              mode={mode}
              selected={selected}
              onSelect={onSelect}
              className="w-full"
              {...props}
            />
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selected?.from && selected?.to) {
                    onClose();
                  }
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  selected?.from && selected?.to
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!selected?.from || !selected?.to}
              >
                Confirm Dates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 