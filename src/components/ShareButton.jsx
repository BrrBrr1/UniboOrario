import React, { useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

const ShareButton = ({ targetRef, dayName }) => {
    const [isSharing, setIsSharing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleShare = async () => {
        if (!targetRef?.current || isSharing) return;

        setIsSharing(true);

        try {
            // Generate image from the day column
            const dataUrl = await toPng(targetRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });

            // Convert to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], `orario-${dayName}.png`, { type: 'image/png' });

            // Try Web Share API first (mobile)
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `Orario ${dayName}`,
                    text: `Il mio orario per ${dayName}`,
                    files: [file]
                });
            } else {
                // Fallback: download the image
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `orario-${dayName}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error('Share failed:', error);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <button
            className={`share-button ${isSharing ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
            onClick={handleShare}
            disabled={isSharing}
            title="Condividi orario"
        >
            {showSuccess ? (
                <Check size={16} />
            ) : isSharing ? (
                <div className="spinner-tiny" />
            ) : (
                <Share2 size={16} />
            )}
        </button>
    );
};

export default ShareButton;
