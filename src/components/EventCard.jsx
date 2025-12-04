import React, { memo } from 'react';
import { MapPin, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '../utils/timeFormat';

// Simple hash function to get consistent color index from title
const getColorIndex = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 10;
};

const EventCard = memo(({ event, compactView = false, use24Hour = true }) => {
    // Extract relevant info
    const { title, time, aule, docente, cod_modulo } = event;
    const location = aule?.[0]?.des_risorsa || 'Aula non specificata';
    const address = aule?.[0]?.des_indirizzo || '';

    // Format time based on user preference
    const displayTime = formatTime(time, use24Hour);

    // Get consistent color based on lesson code or title
    const colorIndex = getColorIndex(cod_modulo || title);

    return (
        <motion.div
            className={`event-card ${compactView ? 'compact' : ''}`}
            data-color-index={colorIndex}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="event-header">
                <div className="event-time">
                    <Clock size={14} />
                    <span>{displayTime}</span>
                </div>
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
        </motion.div>
    );
});

EventCard.displayName = 'EventCard';

export default EventCard;