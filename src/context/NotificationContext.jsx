import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((type, message, duration = 4000, id = null) => {
        const newNotification = {
            id: id || uuidv4(),
            type,
            message,
            duration,
        };

        setNotifications((prev) => {
            if (id && prev.some(n => n.id === id)) {
                return prev;
            }
            return [...prev, newNotification];
        });

        if (duration && duration > 0) {
            setTimeout(() => {
                removeNotification(newNotification.id);
            }, duration);
        }

        return newNotification.id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
