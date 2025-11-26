import { useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';

const useNetworkStatus = () => {
    const { addNotification, removeNotification } = useNotification();
    const offlineNotificationId = useRef(null);

    useEffect(() => {
        const handleOnline = () => {
            if (offlineNotificationId.current) {
                removeNotification(offlineNotificationId.current);
                offlineNotificationId.current = null;
            }
            addNotification('success', 'Connessione ripristinata', 3000);
        };

        const handleOffline = () => {
            offlineNotificationId.current = addNotification('network-error', 'Nessuna connessione internet', 0, 'network-offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check initial status
        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [addNotification, removeNotification]);
};

export default useNetworkStatus;
