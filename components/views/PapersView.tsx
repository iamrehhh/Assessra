
'use client';

import { useState } from 'react';
import { paperListings, allPaperData, allMCQData, allGeneralPaperData } from '@/data/index';
import PaperView from '../PaperView';
import MCQView from '../MCQView';
import GeneralPaperView from '../GeneralPaperView';

const subjectMeta = {
    'business-p3': { emoji: '💼', title: 'Business: Paper 3', subtitle: 'Business Decision-Making', code: '9609/3', type: 'essay' },
    'business-p4': { emoji: '💼', title: 'Business: Paper 4', subtitle: 'Business Strategy', code: '9609/4', type: 'essay' },
    'economics-p3': { emoji: '📈', title: 'Economics: Paper 3', subtitle: 'Multiple Choice (75 min)', code: '9708/3', type: 'mcq' },
    'economics-p4': { emoji: '📈', title: 'Economics: Paper 4', subtitle: 'Data Response & Essays', code: '9708/4', type: 'essay' },
    'general-p1': { emoji: '🌍', title: 'General Paper 1', subtitle: 'Essay Questions', code: '8021/1', type: 'gp' },
    'general-p2': { emoji: '🌍', title: 'General Paper 2', subtitle: 'Data Response', code: '8021/2', type: 'essay' },
    'biology-p2': { emoji: '🔬', title: 'Biology: Paper 2', subtitle: 'Multiple Choice (Extended)', code: '0610/2', type: 'mcq' },
    'physics-p2': { emoji: '⚛️', title: 'Physics: Paper 2', subtitle: 'Multiple Choice (Extended)', code: '0625/2', type: 'mcq' },
};

export default function PapersView({ subject, paper }: { subject: string, paper: string }) {
    const [openPaperId, setOpenPaperId] = useState(null);
    const key = `${subject}-${paper}`;
    const meta = subjectMeta[key] || { emoji: '📄', title: 'Papers', subtitle: '', code: '', type: 'essay' };
    const papers = paperListings[key] || [];

    // Decide which viewer to use
    if (openPaperId) {
        if (meta.type === 'mcq') {
            return <MCQView paperId={openPaperId} paperData={allMCQData} onBack={() => setOpenPaperId(null)} />;
        }
        if (meta.type === 'gp') {
            return <GeneralPaperView paperId={openPaperId} paperData={allGeneralPaperData} onBack={() => setOpenPaperId(null)} />;
        }
        return <PaperView paperId={openPaperId} paperData={allPaperData} onBack={() => setOpenPaperId(null)} />;
    }

    // Group by year + series
    const grouped = papers.reduce((acc: any, p: any) => {
        const groupKey = `${p.year}|||${p.series}`;
        if (!acc[groupKey]) acc[groupKey] = { year: p.year, series: p.series, papers: [] };
        acc[groupKey].papers.push(p);
        return acc;
    }, {} as Record<string, any>);

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--lime-dark)', fontFamily: 'var(--font-playfair)' }}>
                    {meta.emoji} {meta.title}
                </h2>
                <p style={{ color: '#666' }}>{meta.subtitle}</p>
            </div>

            {papers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                    <p style={{ fontSize: '1.2rem' }}>📂 Papers coming soon for this section.</p>
                </div>
            ) : (
                Object.values(grouped).map((group: any) => (
                    <div key={`${group.year}-${group.series}`}>
                        <div className="series-header">
                            <div className="year-big">{group.year}</div>
                            <div className="series-name">{group.series}</div>
                        </div>
                        <div className="papers-grid">
                            {group.papers.map(p => (
                                <div key={p.id} className="paper-card" onClick={() => setOpenPaperId(p.id)}>
                                    <span className="paper-tag">{p.code}</span>
                                    <h3 style={{ marginTop: '8px', fontFamily: 'var(--font-playfair)', color: '#1e293b' }}>{p.title}</h3>
                                    <p style={{ color: '#888', marginTop: '5px', fontSize: '0.9rem' }}>
                                        {meta.type === 'mcq' ? '30 Questions • 1h 15m' : 'PDF Available'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
