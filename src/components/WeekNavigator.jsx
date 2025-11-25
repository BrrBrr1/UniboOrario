import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { it } from 'date-fns/locale';

const WeekNavigator = ({ currentDate, onDateChange }) => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });

    const handlePrev = () => onDateChange(subWeeks(currentDate, 1));
    const handleNext = () => onDateChange(addWeeks(currentDate, 1));

    return (
        <div className="week-navigator">
            <button onClick={handlePrev} className="nav-button">
                <ChevronLeft size={20} />
            </button>
            <div className="date-range">
                {format(start, 'd MMM', { locale: it })} - {format(end, 'd MMM yyyy', { locale: it })}
            </div>
            <button onClick={handleNext} className="nav-button">
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default WeekNavigator;
