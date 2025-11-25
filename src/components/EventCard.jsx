import React from 'react';
import { MapPin, Clock, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
    // Extract relevant info
    const { title, time, aule, docente, start, end } = event;
    const location = aule?.[0]?.des_risorsa || 'Unknown Location';
    const address = aule?.[0]?.des_indirizzo || '';

    return (
        <motion.div
            className="event-card"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="event-header">
                <div className="event-time">
                    <Clock size={14} />
                    <span>{time}</span>
                </div>
            </div>
            <h3 className="event-title">{title}</h3>
            <div className="event-details">
                <div className="detail-row">
                    <User size={14} />
                    <span>{docente}</span>
                </div>
                <div className="detail-row" title={address}>
                    <MapPin size={14} />
                    <span>{location}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;