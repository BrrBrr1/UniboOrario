import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek } from 'date-fns';
import { it } from 'date-fns/locale';

const WeekNavigator = ({ currentDate, onDateChange }) => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const isCurrentWeek = isSameWeek(currentDate, new Date(), { weekStartsOn: 1 });

    const handlePrev = () => onDateChange(subWeeks(currentDate, 1));
    const handleNext = () => onDateChange(addWeeks(currentDate, 1));
    const handleToday = () => onDateChange(new Date());

    return (
        <div className="week-navigator" role="navigation" aria-label="Navigazione settimane">
            <button
                onClick={handlePrev}
                className="nav-button"
                aria-label="Settimana precedente"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="date-range-container">
                <span className={`date-range ${isCurrentWeek ? 'current-week' : ''}`}>
                    {format(start, 'd MMM', { locale: it })} - {format(end, 'd MMM yyyy', { locale: it })}
                </span>
                {!isCurrentWeek && (
                    <button
                        className="today-chip"
                        onClick={handleToday}
                        aria-label="Torna a questa settimana"
                    >
                        <CalendarDays size={14} />
                        <span>Oggi</span>
                    </button>
                )}
            </div>
            <button
                onClick={handleNext}
                className="nav-button"
                aria-label="Settimana successiva"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default WeekNavigator;
