import React from 'react';
import { X, Moon, Sun } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, theme, onThemeChange }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Impostazioni</h2>
                    <button className="icon-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="settings-list">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Tema Scuro</span>
                            <span className="setting-desc">Abilita la modalità scura per l'app</span>
                        </div>
                        <button
                            className={`theme-toggle ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>
                </div>

                <div className="modal-footer">
                    <p>Unibo Timetable PWA v1.0</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
