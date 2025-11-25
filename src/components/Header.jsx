import React from 'react';
import { Calendar, Settings } from 'lucide-react';

const Header = ({ onOpenSettings }) => {
    return (
        <header className="header">
            <div className="logo-container">
                <Calendar className="logo-icon" size={24} />
                <h1>Unibo Orario</h1>
            </div>
            <button className="icon-button" aria-label="Settings" onClick={onOpenSettings}>
                <Settings size={20} />
            </button>
        </header>
    );
};

export default Header;
