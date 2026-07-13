'use client';

import { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="bg-white rounded-card shadow-card border border-border p-4 w-[300px]">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 hover:bg-slate-100 rounded-button transition-colors text-text-secondary"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-semibold text-text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 hover:bg-slate-100 rounded-button transition-colors text-text-secondary"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-2">
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-text-secondary py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={i}
              onClick={() => onDateChange(day)}
              className={`
                w-9 h-9 rounded-button text-xs font-medium transition-all duration-150
                ${isSelected
                  ? 'bg-primary text-white shadow-sm'
                  : isToday
                    ? 'bg-primary/10 text-primary font-semibold'
                    : isCurrentMonth
                      ? 'text-text-primary hover:bg-slate-100'
                      : 'text-slate-300'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Today Button */}
      <div className="mt-3 pt-3 border-t border-border">
        <button
          onClick={() => onDateChange(new Date())}
          className="w-full text-center text-xs font-medium text-primary hover:text-primary-hover py-1.5 hover:bg-primary/5 rounded-button transition-colors"
        >
          Today
        </button>
      </div>
    </div>
  );
}
