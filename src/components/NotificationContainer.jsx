import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import NotificationToast from './NotificationToast';
import './NotificationContainer.css';

const NotificationContainer = () => {
    const { notifications } = useNotification();

    return (
        <div className="notification-container">
            <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                    <NotificationToast key={notification.id} notification={notification} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationContainer;
