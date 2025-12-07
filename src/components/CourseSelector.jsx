import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, BookOpen, Link as LinkIcon, X, Trash2, EyeOff, Eye, GripVertical } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { courses } from '../data/courses';

const CourseSelector = ({
    selectedCourse,
    onCourseChange,
    customCourses = [],
    hiddenCourseIds = [],
    onAddCustomCourse,
    onRemoveCustomCourse,
    onToggleCourseVisibility,
    courseOrder = [],
    onOrderChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customUrl, setCustomUrl] = useState('');
    const [customName, setCustomName] = useState('');
    const [customCurricula, setCustomCurricula] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [manageMode, setManageMode] = useState(false);

    const allCourses = useMemo(() => [...courses, ...customCourses], [customCourses]);

    const orderedCourses = useMemo(() => {
        if (!courseOrder || courseOrder.length === 0) return allCourses;

        const orderMap = new Map(courseOrder.map((id, index) => [id, index]));

        return [...allCourses].sort((a, b) => {
            const indexA = orderMap.has(a.id) ? orderMap.get(a.id) : 9999;
            const indexB = orderMap.has(b.id) ? orderMap.get(b.id) : 9999;
            return indexA - indexB;
        });
    }, [allCourses, courseOrder]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    const filteredCourses = orderedCourses.filter(course => {
        if (!manageMode && !searchTerm && hiddenCourseIds.includes(course.id)) return false;

        return course.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const isReorderEnabled = manageMode && !searchTerm && onOrderChange;

    const handleReorder = (newOrder) => {
        const newOrderIds = newOrder.map(c => c.id);
        onOrderChange(newOrderIds);
    };

    const handleSelectCourse = (course) => {
        if (manageMode) return;
        onCourseChange(course);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleCustomSubmit = async (e) => {
        e.preventDefault();
        if (customUrl && customName) {
            setIsSubmitting(true);
            const success = await onAddCustomCourse({
                name: customName,
                type: 'Custom',
                url: customUrl,
                curricula: customCurricula,
                years: 3
            });
            setIsSubmitting(false);

            if (success) {
                setIsOpen(false);
                setShowCustomInput(false);
                setCustomUrl('');
                setCustomName('');
                setCustomCurricula('');
            }
        }
    };

    const SortableCourseItem = ({ course, isReorderEnabled, onSelect, dragControls }) => {
        return (
            <div
                className={`course-item ${selectedCourse?.id === course.id ? 'active' : ''} ${hiddenCourseIds.includes(course.id) ? 'hidden-item' : ''}`}
                onClick={() => onSelect(course)}
            >
                {isReorderEnabled && (
                    <div
                        className="drag-handle"
                        onPointerDown={(e) => dragControls.start(e)}
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical size={20} className="text-gray-400" />
                    </div>
                )}
                <div className="course-icon">
                    <BookOpen size={20} />
                </div>
                <div className="course-details">
                    <span className="course-name">{course.name}</span>
                    <span className="course-type">{course.type}</span>
                </div>

                {manageMode && (
                    <div className="course-actions" onClick={e => e.stopPropagation()}>
                        <button
                            className={`action-btn ${hiddenCourseIds.includes(course.id) ? 'show-btn' : 'hide-btn'}`}
                            onClick={() => onToggleCourseVisibility(course.id)}
                            title={hiddenCourseIds.includes(course.id) ? "Mostra corso" : "Nascondi corso"}
                        >
                            {hiddenCourseIds.includes(course.id) ? (
                                <Eye size={18} className="opacity-50" />
                            ) : (
                                <EyeOff size={18} />
                            )}
                        </button>

                        {course.type === 'Custom' ? (
                            <button
                                className="action-btn delete-btn"
                                onClick={() => onRemoveCustomCourse(course.id)}
                                title="Elimina corso"
                            >
                                <Trash2 size={18} />
                            </button>
                        ) : (
                            <div className="action-btn" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
                                <Trash2 size={18} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const ReorderableCourseItem = ({ course }) => {
        const dragControls = useDragControls();

        return (
            <Reorder.Item
                key={course.id}
                value={course}
                className="reorder-item"
                dragListener={false}
                dragControls={dragControls}
                style={{ position: 'relative' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 999 }}
            >
                <SortableCourseItem
                    course={course}
                    isReorderEnabled={true}
                    onSelect={handleSelectCourse}
                    dragControls={dragControls}
                />
            </Reorder.Item>
        );
    };

    return (
        <>
            <button
                className="course-selector-btn"
                onClick={() => setIsOpen(true)}
                aria-label="Seleziona corso"
            >
                <div className="course-info">
                    <span className="course-label">Corso</span>
                    <span className="course-value" title={selectedCourse?.name}>
                        {selectedCourse?.name || 'Seleziona Corso'}
                    </span>
                </div>
                <ChevronDown size={16} className="chevron-icon" />
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content course-search-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Seleziona Corso di Studi</h3>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {!showCustomInput ? (
                            <>
                                <div className="search-bar-container">
                                    <Search size={18} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Cerca il tuo corso..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="courses-list">
                                    {isReorderEnabled ? (
                                        <Reorder.Group axis="y" values={filteredCourses} onReorder={handleReorder} className="reorder-group">
                                            {filteredCourses.map(course => (
                                                <ReorderableCourseItem key={course.id} course={course} />
                                            ))}
                                        </Reorder.Group>
                                    ) : (
                                        filteredCourses.map(course => (
                                            <button
                                                key={course.id}
                                                className="course-item-wrapper-btn"
                                                onClick={() => handleSelectCourse(course)}
                                                style={{ display: 'block', width: '100%', padding: 0, border: 'none', background: 'none', textAlign: 'left' }}
                                            >
                                                <SortableCourseItem
                                                    course={course}
                                                    isReorderEnabled={false}
                                                    onSelect={handleSelectCourse}
                                                />
                                            </button>
                                        ))
                                    )}

                                    {filteredCourses.length === 0 && (
                                        <div className="no-results">
                                            Nessun corso trovato.
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="text-btn"
                                        onClick={() => setShowCustomInput(true)}
                                    >
                                        Non trovi il tuo corso? Aggiungi URL manuale
                                    </button>
                                    <div className="manage-toggle-container">
                                        <span className="manage-label">Gestisci lista</span>
                                        <label className="toggle-switch small">
                                            <input
                                                type="checkbox"
                                                checked={manageMode}
                                                onChange={() => setManageMode(!manageMode)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleCustomSubmit} className="custom-course-form">
                                <p className="form-description">
                                    Inserisci l'URL del JSON dell'orario. Lo puoi trovare ispezionando la rete sul sito degli orari di unibo.
                                </p>

                                <div className="form-group">
                                    <label>Nome Corso</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Es. Ingegneria Meccanica"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>URL JSON Orario</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://corsi.unibo.it/laurea/.../@@orario_reale_json"
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Codice Curricula</label>
                                    <input
                                        type="text"
                                        placeholder="Es. C60-000 (Lascia vuoto se non richiesto)"
                                        value={customCurricula}
                                        onChange={(e) => setCustomCurricula(e.target.value)}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowCustomInput(false)}
                                    >
                                        Indietro
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Conferma
                                    </button>
                                    {isSubmitting && <div className="spinner-small" style={{ marginLeft: 10 }}></div>}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseSelector;