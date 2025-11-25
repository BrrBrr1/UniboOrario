import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Filter } from 'lucide-react';

const LessonFilter = ({ lessons, selectedLessons, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const handleToggle = (lessonId) => {
        if (selectedLessons.includes(lessonId)) {
            onSelectionChange(selectedLessons.filter(id => id !== lessonId));
        } else {
            onSelectionChange([...selectedLessons, lessonId]);
        }
    };

    const handleSelectAll = () => {
        onSelectionChange(lessons.map(l => l.cod_modulo));
    };

    const handleDeselectAll = () => {
        onSelectionChange([]);
    };

    return (
        <div className="lesson-filter-container" ref={dropdownRef}>
            <button
                className={`lesson-filter-button ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} />
                    <span>Filtra lezioni</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="filter-badge">{selectedLessons.length}/{lessons.length}</span>
                    <ChevronDown size={18} style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }} />
                </div>
            </button>

            {isOpen && (
                <div className="lesson-dropdown">
                    <div className="dropdown-header">
                        <button className="text-btn" onClick={handleSelectAll}>
                            Seleziona tutto
                        </button>
                        <button className="text-btn" onClick={handleDeselectAll}>
                            Deseleziona tutto
                        </button>
                    </div>
                    <div className="dropdown-list">
                        {lessons.map(lesson => (
                            <label key={lesson.cod_modulo} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={selectedLessons.includes(lesson.cod_modulo)}
                                    onChange={() => handleToggle(lesson.cod_modulo)}
                                />
                                <div className="checkbox-custom">
                                    {selectedLessons.includes(lesson.cod_modulo) && (
                                        <Check size={14} />
                                    )}
                                </div>
                                <span className="lesson-label" title={lesson.title}>
                                    {lesson.title}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonFilter;
