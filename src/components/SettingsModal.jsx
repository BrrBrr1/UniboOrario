import React from 'react';
import { X, Moon, Sun, Maximize2, Minimize2, Clock, Calendar, Bell, BellOff, RefreshCw, Globe, Info } from 'lucide-react';

const SettingsModal = ({
    isOpen,
    onClose,
    theme,
    onThemeChange,
    compactView,
    onCompactViewChange,
    use24Hour,
    onUse24HourChange,
    showWeekends,
    onShowWeekendsChange,
    notificationsEnabled,
    onNotificationsChange,
    autoRefresh,
    onAutoRefreshChange
}) => {
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
                    {/* Theme Setting */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label-row">
                                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                <span className="setting-label">Tema Scuro</span>
                            </div>
                            <span className="setting-desc">Abilita la modalità scura per l'app</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* Compact View Setting */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label-row">
                                {compactView ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                <span className="setting-label">Vista Compatta</span>
                            </div>
                            <span className="setting-desc">Mostra gli eventi in modalità compatta</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={compactView}
                                onChange={(e) => onCompactViewChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* 24-Hour Time Format */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label-row">
                                <Clock size={18} />
                                <span className="setting-label">Formato 24 Ore</span>
                            </div>
                            <span className="setting-desc">Mostra l'orario in formato 24 ore</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={use24Hour}
                                onChange={(e) => onUse24HourChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* Show Weekends */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label-row">
                                <Calendar size={18} />
                                <span className="setting-label">Mostra Weekend</span>
                            </div>
                            <span className="setting-desc">Include sabato e domenica nella vista settimanale</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showWeekends}
                                onChange={(e) => onShowWeekendsChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* Notifications */}
                    {/* <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label-row">
                                {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                                <span className="setting-label">Notifiche</span>
                            </div>
                            <span className="setting-desc">Ricevi notifiche per aggiornamenti e promemoria</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={(e) => onNotificationsChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>*/}

                    {/* Auto-refresh */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label-row">
                                <RefreshCw size={18} />
                                <span className="setting-label">Aggiornamento Automatico</span>
                            </div>
                            <span className="setting-desc">Aggiorna automaticamente l'orario ogni ora</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => onAutoRefreshChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    {/* About Section */}
                    <div className="setting-item" style={{ alignItems: 'flex-start' }}>
                        <div className="setting-info" style={{ width: '100%' }}>
                            <div className="setting-label-row" style={{ marginBottom: '8px' }}>
                                <Info size={18} />
                                <span className="setting-label">Informazioni</span>
                            </div>
                            <div className="setting-desc" style={{ textAlign: 'center' }}>
                                <p style={{ marginBottom: '16px', lineHeight: '1.4' }}>
                                    Applicazione <strong>NON Ufficiale</strong> dell'Alma Mater Studiorum - Università di Bologna
                                </p>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginTop: '16px',
                                    opacity: 0.7,
                                    fontSize: '1em'
                                }}>
                                    <span>Made by <strong>Sagal</strong></span>
                                    <span style={{
                                        padding: '2px 8px',
                                        background: 'rgba(0,0,0,0.1)',
                                        borderRadius: '4px'
                                    }}>
                                        v0.3.8
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default SettingsModal;