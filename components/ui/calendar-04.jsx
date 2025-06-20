"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Check } from 'lucide-react';

// Enhanced DayPicker component
const DayPicker = ({ 
  mode, 
  selected, 
  onSelect, 
  showOutsideDays, 
  className, 
  classNames,
  fromYear,
  toYear,
  defaultMonth,
  ...props 
}) => {
  const [currentMonth, setCurrentMonth] = useState(defaultMonth || new Date());
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const today = new Date();
  
  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date) => {
    if (!selected) return false;
    if (mode === 'range') {
      if (selected.from && selected.to) {
        return date >= selected.from && date <= selected.to;
      } else if (selected.from) {
        return date.toDateString() === selected.from.toDateString();
      }
    }
    return false;
  };
  
  const isRangeStart = (date) => {
    return selected?.from && date.toDateString() === selected.from.toDateString();
  };
  
  const isRangeEnd = (date) => {
    return selected?.to && date.toDateString() === selected.to.toDateString();
  };
  
  const isRangeMiddle = (date) => {
    if (!selected?.from || !selected?.to) return false;
    return date > selected.from && date < selected.to;
  };
  
  const handleDateClick = (date) => {
    if (mode === 'range') {
      if (!selected?.from || (selected.from && selected.to)) {
        onSelect({ from: date, to: undefined });
      } else if (selected.from && !selected.to) {
        if (date >= selected.from) {
          onSelect({ from: selected.from, to: date });
        } else {
          onSelect({ from: date, to: selected.from });
        }
      }
    } else {
      onSelect(date);
    }
  };
  
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const renderDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-1">
          <div className="h-10 w-10"></div>
        </div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      
      let dayClasses = "h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105";
      
      if (isToday(date)) {
        dayClasses += " ring-2 ring-blue-500 ring-offset-2 bg-blue-50 text-blue-700 font-bold";
      } else if (isRangeStart(date) || isRangeEnd(date)) {
        dayClasses += " bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg";
      } else if (isRangeMiddle(date)) {
        dayClasses += " bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800";
      } else if (isSelected(date)) {
        dayClasses += " bg-blue-600 text-white font-bold";
      } else {
        dayClasses += " hover:bg-gray-100 text-gray-700";
      }
      
      days.push(
        <div key={day} className="p-1">
          <button
            className={dayClasses}
            onClick={() => handleDateClick(date)}
            type="button"
          >
            {day}
          </button>
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className={"w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto p-2 sm:p-4 md:p-6 " + (className || "")}>
      {/* Month Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-6 gap-2 sm:gap-0">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <select 
            value={currentMonth.getMonth()}
            onChange={(e) => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(parseInt(e.target.value));
              setCurrentMonth(newMonth);
            }}
            className="text-xs sm:text-base font-semibold bg-transparent border-none outline-none cursor-pointer hover:bg-gray-50 px-1 sm:px-2 py-1 rounded"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select 
            value={currentMonth.getFullYear()}
            onChange={(e) => {
              const newMonth = new Date(currentMonth);
              newMonth.setFullYear(parseInt(e.target.value));
              setCurrentMonth(newMonth);
            }}
            className="text-xs sm:text-base font-semibold bg-transparent border-none outline-none cursor-pointer hover:bg-gray-50 px-1 sm:px-2 py-1 rounded"
          >
            {Array.from({ length: (toYear || 2030) - (fromYear || 1900) + 1 }, (_, i) => fromYear + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2 text-xs sm:text-sm">
        {dayNames.map((dayName, index) => (
          <div key={index} className="h-8 sm:h-10 flex items-center justify-center font-semibold text-gray-500 uppercase tracking-wider">
            {dayName}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 overflow-x-auto">
        {renderDays()}
      </div>
    </div>
  );
};

// Professional Calendar Component
export function Calendar({
  className,
  mode = "range",
  selected,
  onSelect,
  showOutsideDays = true,
  fromYear = 1900,
  toYear = 2030,
  defaultMonth,
  ...props
}) {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto p-2 sm:p-4 md:p-6">
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        showOutsideDays={showOutsideDays}
        fromYear={fromYear}
        toYear={toYear}
        defaultMonth={defaultMonth}
        className="w-full"
        {...props}
      />
    </div>
  );
}