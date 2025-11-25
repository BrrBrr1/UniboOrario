import React from 'react';
import { Calendar, List } from 'lucide-react';

const ViewToggle = ({ viewMode, onViewChange }) => {
    return (
        <div className="view-toggle">
            <button
                className={`toggle-button ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => onViewChange('week')}
                aria-label="Week View"
            >
                <Calendar size={18} />
                <span>Settimana</span>
            </button>
            <button
                className={`toggle-button ${viewMode === 'day' ? 'active' : ''}`}
                onClick={() => onViewChange('day')}
                aria-label="Day View"
            >
                <List size={18} />
                <span>Giorno</span>
            </button>
        </div>
    );
};

export default ViewToggle;
