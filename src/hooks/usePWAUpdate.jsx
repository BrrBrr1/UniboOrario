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
            addNotification(
                'update',
                <div className="flex flex-col gap-2">
                    <span>Nuova versione disponibile!</span>
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide hover:bg-blue-50 transition-colors self-start"
                    >
                        Aggiorna ora
                    </button>
                </div>,
                0 // Persistent until clicked
            );
        }
    }, [needRefresh, addNotification, updateServiceWorker]);
};

export default usePWAUpdate;
