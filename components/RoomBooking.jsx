"use client"

import React, { useState } from 'react';
import { CalendarPopup } from './ui/CalendarPopup';
import { Calendar } from 'lucide-react';

export function RoomBooking() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);

  const handleDateSelect = (dates) => {
    setSelectedDates(dates);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Date Selection Button */}
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">
              {selectedDates?.from ? (
                <>
                  {formatDate(selectedDates.from)} - {formatDate(selectedDates.to)}
                </>
              ) : (
                'Select dates'
              )}
            </div>
            <div className="text-xs text-gray-500">
              {selectedDates?.from ? 'Check-in - Check-out' : 'Choose your stay dates'}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {selectedDates?.from ? 'Change' : 'Select'}
        </div>
      </button>

      {/* Calendar Popup */}
      <CalendarPopup
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelect={handleDateSelect}
        selected={selectedDates}
        mode="range"
        numberOfMonths={1}
        showOutsideDays={true}
      />
    </div>
  );
} 