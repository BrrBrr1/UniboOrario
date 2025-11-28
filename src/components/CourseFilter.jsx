import React from 'react';
import { Search, X, BookOpen, User, MapPin, ChevronDown } from 'lucide-react';

const CourseFilter = ({ filter, onFilterChange, filterType, onFilterTypeChange }) => {
    const filterTypes = [
        { value: 'title', label: 'Corso', icon: BookOpen },
        { value: 'teacher', label: 'Docente', icon: User },
        { value: 'location', label: 'Aula', icon: MapPin }
    ];

    const currentFilter = filterTypes.find(f => f.value === filterType);
    const CurrentIcon = currentFilter.icon;

    return (
        <div className="course-filter">
            <Search className="search-icon" size={18} />
            <input
                type="text"
                className="filter-input"
                placeholder={`Cerca per ${filterType === 'title' ? 'corso' : filterType === 'teacher' ? 'docente' : 'aula'}...`}
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
            />
            <div className="filter-type-dropdown">
                <CurrentIcon size={16} />
                <select
                    className="filter-type-select"
                    value={filterType}
                    onChange={(e) => onFilterTypeChange(e.target.value)}
                >
                    {filterTypes.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="dropdown-chevron" />
            </div>
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
    );
};

export default CourseFilter;
