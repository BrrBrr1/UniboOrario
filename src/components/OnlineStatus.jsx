import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const OnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowStatus(true);
            // Hide after 3 seconds
            setTimeout(() => setShowStatus(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowStatus(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Only show when offline or briefly when coming back online
    if (!showStatus && isOnline) return null;

    return (
        <div className={`online-status ${!isOnline ? 'offline' : ''}`}>
            <div className={`status-dot ${!isOnline ? 'offline' : ''}`}></div>
            {isOnline ? (
                <>
                    <Wifi size={16} />
                    <span>Connesso</span>
                </>
            ) : (
                <>
                    <WifiOff size={16} />
                    <span>Offline</span>
                </>
            )}
        </div>
    );
};

export default OnlineStatus;
