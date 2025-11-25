import React from 'react';
import { format, isSameDay, startOfWeek, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import useSwipe from '../hooks/useSwipe';

const DayTabs = ({ currentDate, onDateChange }) => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

    // Get current day index in week
    const currentDayIndex = weekDays.findIndex(day => isSameDay(day, currentDate));

    // Swipe handlers for mobile navigation
    const handleSwipeLeft = () => {
        // Go to next day
        if (currentDayIndex < weekDays.length - 1) {
            onDateChange(weekDays[currentDayIndex + 1]);
        }
    };

    const handleSwipeRight = () => {
        // Go to previous day
        if (currentDayIndex > 0) {
            onDateChange(weekDays[currentDayIndex - 1]);
        }
    };

    const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

    return (
        <div className="day-tabs" {...swipeHandlers}>
            {weekDays.map((day) => {
                const isActive = isSameDay(day, currentDate);
                return (
                    <button
                        key={day.toISOString()}
                        className={`day-tab ${isActive ? 'active' : ''}`}
                        onClick={() => onDateChange(day)}
                    >
                        <span className="tab-day">{format(day, 'EEE', { locale: it })}</span>
                        <span className="tab-date">{format(day, 'd')}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default DayTabs;
