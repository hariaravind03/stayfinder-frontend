"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Mock DayPicker component for demonstration
const DayPicker = ({ 
  mode, 
  selected, 
  onSelect, 
  showOutsideDays, 
  className, 
  classNames,
  captionLayout,
  fromYear,
  toYear,
  defaultMonth,
  numberOfMonths,
  components,
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
  
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  
  const renderDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className={classNames?.cell}>
          <div className={`${classNames?.day} ${classNames?.day_outside}`}></div>
        </div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayClasses = [
        classNames?.day,
        isToday(date) ? classNames?.day_today : '',
        isSelected(date) ? classNames?.day_selected : '',
        isRangeStart(date) ? classNames?.day_range_start : '',
        isRangeEnd(date) ? classNames?.day_range_end : '',
        isRangeMiddle(date) ? classNames?.day_range_middle : ''
      ].filter(Boolean).join(' ');
      
      days.push(
        <div key={day} className={classNames?.cell}>
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
    <div className={className}>
      <div className={classNames?.months}>
        <div className={classNames?.month}>
          <div className={classNames?.caption}>
            <button
              onClick={() => navigateMonth(-1)}
              className={`${classNames?.nav_button} ${classNames?.nav_button_previous}`}
              type="button"
            >
              {components?.IconLeft ? <components.IconLeft /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            
            <div className={classNames?.caption_label}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            
            <button
              onClick={() => navigateMonth(1)}
              className={`${classNames?.nav_button} ${classNames?.nav_button_next}`}
              type="button"
            >
              {components?.IconRight ? <components.IconRight /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
          
          <div className={classNames?.table}>
            <div className={classNames?.head_row}>
              {dayNames.map((dayName, index) => (
                <div key={index} className={classNames?.head_cell}>
                  {dayName}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {renderDays()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Calendar Component
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode = "range",
  selected,
  onSelect,
  numberOfMonths = 1,
  ...props
}) {
  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Decorative background elements */}
      <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-cyan-600/10 rounded-lg sm:rounded-2xl blur-md sm:blur-xl opacity-60" />
      <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-500/20 rounded-lg sm:rounded-2xl blur-sm sm:blur-lg opacity-40" />
      
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        showOutsideDays={showOutsideDays}
        className={cn(
          "relative bg-white/95 backdrop-blur-xl rounded-lg sm:rounded-2xl shadow-2xl border border-white/20 p-2 sm:p-4 md:p-6 w-full min-w-0",
          "before:absolute before:inset-0 before:rounded-lg sm:before:rounded-2xl before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none",
          className
        )}
        captionLayout="dropdown"
        fromYear={1900} 
        toYear={2100}
        numberOfMonths={numberOfMonths}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0 w-full min-w-0",
          month: "space-y-4 sm:space-y-6 w-full min-w-0",
          caption: cn(
            "flex justify-center pt-2 relative items-center mb-2 sm:mb-4",
            "bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg",
            "before:absolute before:inset-0 before:rounded-lg sm:before:rounded-xl before:bg-gradient-to-r before:from-violet-600/50 before:via-blue-600/50 before:to-cyan-600/50 before:blur-sm before:-z-10"
          ),
          caption_label: "text-xs sm:text-base font-bold tracking-wide drop-shadow-sm",
          caption_dropdowns: "flex gap-2 sm:gap-3 items-center",
          nav: "space-x-1 sm:space-x-2 flex items-center",
          nav_button: cn(
            "h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-all duration-300 ease-out",
            "bg-white/20 backdrop-blur-sm border border-white/30 text-white",
            "hover:bg-white/30 hover:scale-110 hover:shadow-lg hover:shadow-white/25",
            "focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
            "active:scale-95"
          ),
          nav_button_previous: "absolute left-1 sm:left-2",
          nav_button_next: "absolute right-1 sm:right-2",
          dropdown: cn(
            "inline-flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold",
            "bg-white/20 backdrop-blur-sm border border-white/30 text-white",
            "hover:bg-white/30 transition-all duration-200",
            "focus:ring-2 focus:ring-white/50 focus:outline-none",
            "px-2 sm:px-3 py-1 min-w-[60px] sm:min-w-[80px]"
          ),
          dropdown_month: "mr-1 sm:mr-2",
          dropdown_year: "",
          table: "w-full border-collapse space-y-1 sm:space-y-2 mt-1 sm:mt-2 min-w-0",
          head_row: "flex mb-1 sm:mb-3",
          head_cell: cn(
            "text-slate-600 rounded-lg w-[calc(100%/7)] font-bold text-[10px] sm:text-xs uppercase tracking-widest",
            "py-2 sm:py-3 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm",
            "border border-slate-200/50 flex items-center justify-center"
          ),
          cell: cn(
            "relative p-0.5 text-center text-xs sm:text-sm",
            "h-8 w-[calc(100%/7)] sm:h-11 sm:w-[calc(100%/7)]",
            "focus-within:relative focus-within:z-20",
            "[&:has([aria-selected].day-range-end)]:bg-gradient-to-l [&:has([aria-selected].day-range-end)]:from-violet-500/20 [&:has([aria-selected].day-range-end)]:to-transparent",
            "[&:has([aria-selected].day-range-start)]:bg-gradient-to-r [&:has([aria-selected].day-range-start)]:from-violet-500/20 [&:has([aria-selected].day-range-start)]:to-transparent",
            "[&:has([aria-selected])]:bg-gradient-to-br [&:has([aria-selected])]:from-violet-100/50 [&:has([aria-selected])]:to-blue-100/50"
          ),
          day: cn(
            "h-8 w-8 sm:h-11 sm:w-11 p-0 font-medium rounded-lg sm:rounded-xl transition-all duration-300 ease-out",
            "relative overflow-hidden group",
            "hover:scale-110 hover:shadow-lg hover:shadow-violet-500/25",
            "focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-none",
            "active:scale-95",
            "bg-gradient-to-br from-white to-slate-50 border border-slate-200/50",
            "hover:bg-gradient-to-br hover:from-violet-50 hover:to-blue-50 hover:border-violet-300/50"
          ),
          day_selected: cn(
            "bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 text-white font-bold",
            "shadow-lg shadow-violet-500/50 border-violet-400",
            "hover:from-violet-600 hover:via-blue-600 hover:to-cyan-600",
            "hover:shadow-xl hover:shadow-violet-500/60",
            "focus:from-violet-600 focus:via-blue-600 focus:to-cyan-600",
            "relative z-10",
            "before:absolute before:inset-0 before:rounded-lg sm:before:rounded-xl before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
            "hover:before:opacity-100"
          ),
          day_today: cn(
            "bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold",
            "shadow-lg shadow-amber-500/50 border-amber-400",
            "hover:from-amber-500 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/60",
            "ring-2 ring-amber-300 ring-offset-2 ring-offset-white",
            "relative z-10",
            "after:absolute after:top-1 after:right-1 after:w-1 after:h-1 sm:after:w-1.5 sm:after:h-1.5 after:bg-yellow-200 after:rounded-full after:animate-pulse"
          ),
          day_range_middle: cn(
            "bg-gradient-to-r from-violet-100 via-blue-100 to-cyan-100",
            "text-violet-700 border-violet-200",
            "shadow-sm"
          ),
          day_outside: cn(
            "text-slate-400 opacity-40",
            "hover:opacity-60 hover:text-slate-500",
            "aria-selected:bg-gradient-to-br aria-selected:from-violet-50 aria-selected:to-blue-50",
            "aria-selected:text-violet-400 aria-selected:opacity-70"
          ),
          day_disabled: "text-slate-300 opacity-30 cursor-not-allowed hover:scale-100 hover:shadow-none",
          day_hidden: "invisible",
          day_range_end: "day-range-end",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => (
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
          ),
          IconRight: ({ ...props }) => (
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
          ),
        }}
        {...props}
      />
      
      {/* Floating sparkle decorations */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-violet-400 opacity-60 animate-pulse">
        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
      </div>
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-blue-400 opacity-40 animate-pulse delay-1000">
        <Sparkles className="h-2 w-2 sm:h-3 sm:w-3" />
      </div>
      
    </div>
  );
}

Calendar.displayName = "Calendar";