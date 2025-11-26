import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import './NotificationToast.css';

const NotificationToast = ({ notification }) => {
    const { removeNotification } = useNotification();
    const { id, type, message } = notification;

    const getConfig = () => {
        switch (type) {
            case 'network-error':
                return {
                    emoji: '🔴',
                    className: 'notification-error',
                };
            case 'error':
                return {
                    emoji: '⚠️',
                    className: 'notification-warning',
                };
            case 'success':
                return {
                    emoji: '✅',
                    className: 'notification-success',
                };
            case 'warning':
                return {
                    emoji: '⚡',
                    className: 'notification-alert',
                };
            case 'update':
                return {
                    emoji: '✨',
                    className: 'notification-update',
                };
            case 'info':
            default:
                return {
                    emoji: 'ℹ️',
                    className: 'notification-info',
                };
        }
    };

    const config = getConfig();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }
            }}
            exit={{
                opacity: 0,
                x: 300,
                scale: 0.8,
                transition: {
                    duration: 0.3,
                    ease: 'easeInOut'
                }
            }}
            className={`notification-toast ${config.className}`}
            role="alert"
        >
            <div className="notification-accent" />

            <div className="notification-content">
                <div className="notification-emoji">
                    {config.emoji}
                </div>

                <div className="notification-message">
                    {message}
                </div>

                <button
                    onClick={() => removeNotification(id)}
                    className="notification-close"
                    aria-label="Close"
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
            </div>
        </motion.div>
    );
};

export default NotificationToast;
