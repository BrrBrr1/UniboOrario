import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const YearSelector = ({ year, onYearChange, maxYears = 3 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Generate years array based on maxYears
    const years = Array.from({ length: maxYears }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}° Anno`
    }));

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        onYearChange(value);
        setIsOpen(false);
    };

    const selectedLabel = years.find(y => y.value === year)?.label || `${year}° Anno`;

    return (
        <div className="year-selector-dropdown-container" ref={dropdownRef}>
            <div className="dropdown-label">Anno</div>
            <div className="relative-container">
                <button
                    className={`custom-dropdown-button ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="dropdown-value">{selectedLabel}</span>
                    <ChevronDown size={14} className={`dropdown-icon ${isOpen ? 'rotate' : ''}`} />
                </button>

                {isOpen && (
                    <div className="custom-dropdown-menu">
                        {years.map(({ value, label }) => (
                            <button
                                key={value}
                                className={`custom-dropdown-item ${year === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(value)}
                            >
                                <span>{label}</span>
                                {year === value && <Check size={14} className="check-icon" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default YearSelector;
