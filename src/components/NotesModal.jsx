import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, StickyNote } from 'lucide-react';

const NotesModal = ({ isOpen, onClose, note, onSave, onDelete, lessonTitle }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (isOpen) {
            setContent(note || '');
        }
    }, [isOpen, note]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(content.trim());
        onClose();
    };

    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content notes-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="notes-header-info">
                        <StickyNote size={20} />
                        <h3>Note</h3>
                    </div>
                    <button className="icon-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="notes-lesson-title">
                    {lessonTitle}
                </div>

                <textarea
                    className="notes-textarea"
                    placeholder="Aggiungi una nota per questa lezione... (es. 'Porta laptop', 'Giorno esame')"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    autoFocus
                />

                <div className="notes-actions">
                    {note && (
                        <button className="btn-danger" onClick={handleDelete}>
                            <Trash2 size={16} />
                            Elimina
                        </button>
                    )}
                    <div className="notes-actions-right">
                        <button className="btn-secondary" onClick={onClose}>
                            Annulla
                        </button>
                        <button className="btn-primary" onClick={handleSave}>
                            <Save size={16} />
                            Salva
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;
