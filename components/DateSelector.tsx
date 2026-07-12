'use client';

import { format, addDays, subDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-md">
      <button
        onClick={handlePreviousDay}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Previous day"
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
      </button>

      <div className="flex items-center gap-4 flex-1">
        <div className="text-center flex-1">
          <p className="text-sm text-gray-600">Selected Date</p>
          <p className="text-2xl font-bold text-gray-800">
            {format(selectedDate, 'MMM dd, yyyy')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {format(selectedDate, 'EEEE')}
          </p>
        </div>

        {!isToday && (
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={handleNextDay}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Next day"
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
