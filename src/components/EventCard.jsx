import React, { memo } from 'react';
import { MapPin, Clock, User, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '../utils/timeFormat';

const getColorIndex = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 10;
};

const EventCard = ({
    event,
    compactView = false,
    use24Hour = true,
    note,
    onNoteClick
}) => {
    const { title, time, aule, docente, cod_modulo } = event;
    const location = aule?.[0]?.des_risorsa || 'Aula non specificata';
    const address = aule?.[0]?.des_indirizzo || '';
    const displayTime = formatTime(time, use24Hour);
    const colorIndex = getColorIndex(cod_modulo || title);

    const handleClick = () => {
        if (onNoteClick) {
            onNoteClick();
        }
    };

    return (
        <motion.div
            className={`event-card ${compactView ? 'compact' : ''} ${note ? 'has-note' : ''}`}
            data-color-index={colorIndex}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClick}
        >
            <div className="event-header">
                <div className="event-time">
                    <Clock size={14} />
                    <span>{displayTime}</span>
                </div>
                {note && (
                    <div className="note-indicator" title="Hai una nota per questa lezione">
                        <StickyNote size={14} />
                    </div>
                )}
            </div>
            <h3 className="event-title">{title}</h3>
            <div className="event-details">
                {docente && (
                    <div className="detail-row">
                        <User size={14} />
                        <span>{docente}</span>
                    </div>
                )}
                <div className="detail-row" title={address}>
                    <MapPin size={14} />
                    <span>{location}</span>
                </div>
            </div>
            {note && (
                <div className="event-note-preview">
                    <StickyNote size={12} />
                    <span>{note.length > 50 ? note.substring(0, 50) + '...' : note}</span>
                </div>
            )}
        </motion.div>
    );
};

EventCard.displayName = 'EventCard';

export default EventCard;