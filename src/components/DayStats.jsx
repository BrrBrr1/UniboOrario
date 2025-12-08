import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Info, Clock, BookOpen, Coffee, X } from 'lucide-react';
import { parseISO, differenceInMinutes, format } from 'date-fns';

const DayStats = ({ events }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    const stats = useMemo(() => {
        if (!events || events.length === 0) {
            return null;
        }

        const sortedEvents = [...events].sort((a, b) =>
            parseISO(a.start) - parseISO(b.start)
        );

        // Total lessons
        const totalLessons = events.length;

        // Calculate total hours
        let totalMinutes = 0;
        events.forEach(event => {
            const start = parseISO(event.start);
            const end = parseISO(event.end);
            totalMinutes += differenceInMinutes(end, start);
        });

        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        // Calculate breaks
        const breaks = [];
        for (let i = 0; i < sortedEvents.length - 1; i++) {
            const currentEnd = parseISO(sortedEvents[i].end);
            const nextStart = parseISO(sortedEvents[i + 1].start);
            const breakMinutes = differenceInMinutes(nextStart, currentEnd);

            if (breakMinutes > 0) {
                breaks.push({
                    duration: breakMinutes,
                    after: sortedEvents[i].title || sortedEvents[i].docente
                });
            }
        }

        const totalBreakMinutes = breaks.reduce((acc, b) => acc + b.duration, 0);

        // First and last lesson times
        const firstLesson = parseISO(sortedEvents[0].start);
        const lastLesson = parseISO(sortedEvents[sortedEvents.length - 1].end);

        // Unique subjects/docenti
        const uniqueSubjects = new Set(events.map(e => e.title || e.docente).filter(Boolean));

        return {
            totalLessons,
            totalHours,
            remainingMinutes,
            totalBreakMinutes,
            breaksCount: breaks.length,
            firstLesson: format(firstLesson, 'HH:mm'),
            lastLesson: format(lastLesson, 'HH:mm'),
            uniqueSubjects: uniqueSubjects.size
        };
    }, [events]);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!stats) {
        return null;
    }

    return (
        <div className="day-stats-container">
            <button
                ref={buttonRef}
                className={`stats-button ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Statistiche giornata"
            >
                <Info size={16} />
            </button>

            {isOpen && (
                <div className="stats-popup" ref={popupRef}>
                    <div className="stats-popup-header">
                        <span>Statistiche</span>
                        <button className="stats-close" onClick={() => setIsOpen(false)}>
                            <X size={14} />
                        </button>
                    </div>
                    <div className="stats-popup-content">
                        <div className="stat-row">
                            <div className="stat-icon">
                                <BookOpen size={16} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.totalLessons}</span>
                                <span className="stat-label">
                                    {stats.totalLessons === 1 ? 'lezione' : 'lezioni'}
                                </span>
                            </div>
                        </div>

                        <div className="stat-row">
                            <div className="stat-icon">
                                <Clock size={16} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">
                                    {stats.totalHours}h {stats.remainingMinutes > 0 ? `${stats.remainingMinutes}m` : ''}
                                </span>
                                <span className="stat-label">totali</span>
                            </div>
                        </div>

                        <div className="stat-row">
                            <div className="stat-icon">
                                <Coffee size={16} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">
                                    {stats.breaksCount > 0
                                        ? `${stats.totalBreakMinutes}m`
                                        : 'Nessuna'}
                                </span>
                                <span className="stat-label">
                                    {stats.breaksCount === 1
                                        ? 'pausa'
                                        : stats.breaksCount > 1
                                            ? `pause (${stats.breaksCount})`
                                            : 'pausa'}
                                </span>
                            </div>
                        </div>

                        <div className="stat-divider"></div>

                        <div className="stat-time-range">
                            <span className="time-label">Orario:</span>
                            <span className="time-value">
                                {stats.firstLesson} – {stats.lastLesson}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DayStats;
