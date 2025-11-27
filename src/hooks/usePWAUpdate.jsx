import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useNotification } from '../context/NotificationContext';

const usePWAUpdate = () => {
    const { addNotification } = useNotification();
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    useEffect(() => {
        if (needRefresh) {
            // Notify user
            addNotification(
                'info',
                'Nuova versione trovata. Aggiornamento in corso...',
                5000
            );

            const performUpdate = async () => {
                // Wait for user to read notification
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Clear caches (but NOT localStorage)
                if ('caches' in window) {
                    try {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                        console.log('Caches cleared');
                    } catch (err) {
                        console.error('Error clearing caches:', err);
                    }
                }

                // Trigger update and reload
                updateServiceWorker(true);
            };

            performUpdate();
        }
    }, [needRefresh, addNotification, updateServiceWorker]);
};

export default usePWAUpdate;
