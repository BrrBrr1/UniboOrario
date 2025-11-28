import React from 'react';
import { GraduationCap } from 'lucide-react';

const YearSelector = ({ year, onYearChange }) => {
    const years = [
        { value: 1, label: '1° Anno' },
        { value: 2, label: '2° Anno' },
        { value: 3, label: '3° Anno' }
    ];

    return (
        <div className="year-selector-wrapper">
            <div className="year-selector-tabs">
                {years.map(({ value, label }) => (
                    <button
                        key={value}
                        className={`year-tab ${year === value ? 'active' : ''}`}
                        onClick={() => onYearChange(value)}
                    >
                        <GraduationCap size={16} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default YearSelector;
