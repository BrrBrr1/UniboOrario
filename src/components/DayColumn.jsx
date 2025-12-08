import React, { memo } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarX } from 'lucide-react';
import EventCard from './EventCard';
import DayStats from './DayStats';

const DayColumn = memo(({
    date,
    events,
    compactView = false,
    use24Hour = true,
    notes = {},
    onNoteClick
}) => {
    const dayEvents = events.filter(event => {
        const eventDate = parseISO(event.start);
        return isSameDay(eventDate, date);
    }).sort((a, b) => parseISO(a.start) - parseISO(b.start));

    const isToday = isSameDay(date, new Date());

    const getNoteKey = (event) => {
        return `${event.cod_modulo}_${format(date, 'yyyy-MM-dd')}`;
    };

    return (
        <div className={`day-column ${isToday ? 'today' : ''}`}>
            <div className="day-header">
                <div className="day-header-left">
                    <span className="day-name">{format(date, 'EEEE', { locale: it })}</span>
                    <div className="day-date-info">
                        <span className="day-number">{format(date, 'd')}</span>
                        <span className="day-month">{format(date, 'MMM', { locale: it })}</span>
                    </div>
                </div>
                <DayStats events={dayEvents} />
            </div>
            <div className="events-container">
                {dayEvents.length > 0 ? (
                    dayEvents.map((event, index) => {
                        const noteKey = getNoteKey(event);
                        return (
                            <EventCard
                                key={`${event.cod_modulo}-${index}`}
                                event={event}
                                compactView={compactView}
                                use24Hour={use24Hour}
                                note={notes[noteKey]}
                                onNoteClick={() => onNoteClick && onNoteClick(event, noteKey)}
                            />
                        );
                    })
                ) : (
                    <div className="no-events">
                        <CalendarX className="no-events-icon" size={48} strokeWidth={1.5} />
                        <span className="no-events-text">Nessuna lezione</span>
                        <span className="no-events-subtext">Goditi la giornata libera! (Forse)</span>
                    </div>
                )}
            </div>
        </div>
    );
});

DayColumn.displayName = 'DayColumn';

export default DayColumn;

