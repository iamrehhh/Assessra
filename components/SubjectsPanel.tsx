'use client';

import { useToast } from '@/components/ToastContext';

export default function SubjectsPanel({ isOpen, onClose, onSelect }) {
    const subjects = [
        {
            category: 'AS & A Level',
            items: [
                {
                    name: 'Business (9609)',
                    papers: ['p3', 'p4'],
                    labels: ['Paper 3', 'Paper 4'],
                    key: 'business',
                },
                {
                    name: 'Economics (9708)',
                    papers: ['p3', 'p4'],
                    labels: ['Paper 3', 'Paper 4'],
                    key: 'economics',
                },
                {
                    name: 'Mathematics (9709)',
                    papers: ['p3'],
                    labels: ['Paper 3'],
                    key: 'math',
                    disabled: true,
                },
                {
                    name: 'General Paper (8021)',
                    papers: ['p1', 'p2'],
                    labels: ['Paper 1', 'Paper 2'],
                    key: 'general',
                },
            ],
        },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`panel-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`side-panel ${isOpen ? 'active' : ''}`}>
                <div className="panel-header">
                    <h3>Subjects</h3>
                    <button className="panel-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="panel-subject">
                    {subjects.map((group) => (
                        <div key={group.category}>
                            <div
                                className="panel-subject-title"
                                style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                            >
                                {group.category}
                            </div>

                            {group.items.map((subject) => (
                                <SubjectAccordion
                                    key={subject.key}
                                    subject={subject}
                                    onSelect={onSelect}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function SubjectAccordion({ subject, onSelect }) {
    const toast = useToast();

    return (
        <div style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div className="panel-subject-title">
                {subject.name}
                <span style={{ color: '#ccc' }}>›</span>
            </div>
            <div style={{ paddingLeft: '10px', paddingBottom: '5px' }}>
                {subject.papers.map((paper, i) => (
                    <div
                        key={paper}
                        className="paper-item"
                        onClick={() => {
                            if (subject.name === 'Mathematics (9709)') { // Changed condition to match the name
                                toast('Mathematics is currently disabled.', 'info');
                                return;
                            }
                            onSelect(subject.key, paper);
                        }}
                        style={subject.disabled ? { color: '#ccc', cursor: 'not-allowed' } : {}}
                    >
                        {subject.labels[i]}
                    </div>
                ))}
            </div>
        </div>
    );
}
