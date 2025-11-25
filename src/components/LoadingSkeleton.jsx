import React from 'react';

const LoadingSkeleton = ({ viewMode = 'week' }) => {
    const skeletonDays = viewMode === 'week' ? 5 : 1;

    return (
        <div className={`timetable-grid ${viewMode} loading-skeleton`}>
            {Array.from({ length: skeletonDays }).map((_, index) => (
                <div key={index} className="skeleton-day-column">
                    <div className="skeleton-header">
                        <div className="skeleton-day-name"></div>
                    </div>
                    <div className="skeleton-event"></div>
                    <div className="skeleton-event"></div>
                    <div className="skeleton-event"></div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
