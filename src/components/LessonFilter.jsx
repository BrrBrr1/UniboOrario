import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Filter } from 'lucide-react';

const LessonFilter = ({ lessons, selectedLessons, onSelectionChange, loading = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

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

    // Handle escape key to close dropdown
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

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

    const dropdownId = 'lesson-filter-dropdown';

    return (
        <div className="lesson-filter-container" ref={dropdownRef}>
            <button
                ref={buttonRef}
                className={`lesson-filter-button ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={dropdownId}
                aria-haspopup="listbox"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} aria-hidden="true" />
                    <span>Filtra lezioni</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="filter-badge" aria-label={`${selectedLessons.length} di ${lessons.length} selezionate`}>
                        {loading ? '0/0' : `${lessons.filter(l => selectedLessons.includes(l.cod_modulo)).length}/${lessons.length}`}
                    </span>
                    <ChevronDown
                        size={18}
                        aria-hidden="true"
                        style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        }}
                    />
                </div>
            </button>

            {isOpen && (
                <div
                    id={dropdownId}
                    className="lesson-dropdown"
                    role="listbox"
                    aria-label="Seleziona lezioni"
                >
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
                            <label
                                key={lesson.cod_modulo}
                                className="checkbox-item"
                                role="option"
                                aria-selected={selectedLessons.includes(lesson.cod_modulo)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedLessons.includes(lesson.cod_modulo)}
                                    onChange={() => handleToggle(lesson.cod_modulo)}
                                    aria-label={lesson.title}
                                />
                                <div className="checkbox-custom" aria-hidden="true">
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
