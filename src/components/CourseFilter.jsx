import React from 'react';
import { Search, X, BookOpen, User, MapPin } from 'lucide-react';

const CourseFilter = ({ filter, onFilterChange, filterType, onFilterTypeChange }) => {
    const filterTypes = [
        { value: 'title', label: 'Corso', icon: BookOpen },
        { value: 'teacher', label: 'Docente', icon: User },
        { value: 'location', label: 'Aula', icon: MapPin }
    ];

    return (
        <div className="course-filter-wrapper">
            <div className="filter-type-tabs">
                {filterTypes.map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        className={`filter-tab ${filterType === value ? 'active' : ''}`}
                        onClick={() => onFilterTypeChange(value)}
                    >
                        <Icon size={16} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
            <div className="course-filter">
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    className="filter-input"
                    placeholder={`Cerca per ${filterType === 'title' ? 'corso' : filterType === 'teacher' ? 'docente' : 'aula'}...`}
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value)}
                />
                {filter && (
                    <button
                        className="filter-clear-btn"
                        onClick={() => onFilterChange('')}
                        title="Cancella filtro"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseFilter;
