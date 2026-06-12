'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function NotesView() {
    const [tree, setTree] = useState<Record<string, Record<string, string[]>> | null>(null);
    const [level, setLevel] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('theory'); // theory, definitions, formulae
    
    const [content, setContent] = useState<any>(null);
    const [fileType, setFileType] = useState<string>('');
    const [loadingContent, setLoadingContent] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Fetch tree on mount
    useEffect(() => {
        fetch('/api/notes/tree')
            .then(res => res.json())
            .then(data => {
                if (data.tree) {
                    setTree(data.tree);
                    const levels = Object.keys(data.tree);
                    if (levels.length > 0) {
                        setLevel(levels[0]);
                        const subjects = Object.keys(data.tree[levels[0]]);
                        if (subjects.length > 0) {
                            setSubject(subjects[0]);
                        }
                    }
                }
            })
            .catch(err => console.error('Failed to load notes tree:', err));
    }, []);

    // Update subjects when level changes
    useEffect(() => {
        if (tree && level && tree[level]) {
            const subjects = Object.keys(tree[level]);
            if (subjects.length > 0 && !subjects.includes(subject)) {
                setSubject(subjects[0]);
            }
        }
    }, [level, tree]);

    // Fetch content when level, subject, or tab changes
    useEffect(() => {
        if (!level || !subject || !activeTab) return;
        
        setLoadingContent(true);
        setError('');
        setContent(null);

        fetch(`/api/notes/content?level=${encodeURIComponent(level)}&subject=${encodeURIComponent(subject)}&type=${encodeURIComponent(activeTab)}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError('This resource is not available yet.');
                } else {
                    setFileType(data.fileType);
                    if (data.fileType === 'json') {
                        try {
                            setContent(JSON.parse(data.content));
                        } catch (e) {
                            setError('Error parsing JSON content.');
                        }
                    } else {
                        setContent(data.content);
                    }
                }
            })
            .catch(err => {
                console.error('Failed to load content:', err);
                setError('Failed to load content.');
            })
            .finally(() => {
                setLoadingContent(false);
            });
    }, [level, subject, activeTab]);

    if (!tree) {
        return <div className="flex justify-center items-center h-64"><span className="animate-pulse text-text-muted">Loading notes...</span></div>;
    }

    const levels = Object.keys(tree);
    const subjects = level && tree[level] ? Object.keys(tree[level]) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border-main pb-6">
                <div>
                    <h2 className="text-3xl font-black text-text-main font-playfair tracking-tight mb-2">Study Notes</h2>
                    <p className="text-text-muted text-sm">Comprehensive theory, definitions, and formulae.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <select 
                        value={level} 
                        onChange={e => setLevel(e.target.value)}
                        className="flex-1 md:flex-none glass px-4 py-2 rounded-xl text-sm font-bold text-text-main border border-border-main focus:border-primary outline-none"
                    >
                        {levels.map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>

                    <select 
                        value={subject} 
                        onChange={e => setSubject(e.target.value)}
                        className="flex-1 md:flex-none glass px-4 py-2 rounded-xl text-sm font-bold text-text-main border border-border-main focus:border-primary outline-none"
                        disabled={!subjects.length}
                    >
                        {subjects.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-xl w-fit">
                {['theory', 'definitions', 'formulae'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-[#1e293b] text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {loadingContent ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="animate-pulse text-text-muted">Loading content...</span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-border-main">
                        <p className="text-text-muted font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500 space-y-8">
                        {activeTab === 'theory' && content && Array.isArray(content) && (
                            <div className="space-y-4">
                                {content.map((section: any, idx: number) => (
                                    <details key={idx} className="glass rounded-2xl group border border-border-main overflow-hidden">
                                        <summary className="font-playfair font-bold text-lg md:text-xl text-text-main p-6 cursor-pointer list-none flex justify-between items-center group-open:bg-black/5 dark:group-open:bg-white/5 transition-colors">
                                            {section.title}
                                            <span className="text-primary opacity-60 group-open:rotate-180 transition-transform duration-300">▼</span>
                                        </summary>
                                        <div className="p-6 pt-0 mt-4 prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed">
                                            <ReactMarkdown>{section.content}</ReactMarkdown>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        )}
                        
                        {/* Fallback for markdown theory that wasn't parsed into JSON */}
                        {fileType === 'markdown' && content && activeTab === 'theory' && (
                            <div className="prose prose-slate dark:prose-invert max-w-none glass p-8 rounded-3xl">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                        )}

                        {fileType === 'json' && content && activeTab === 'definitions' && (
                            <div className="space-y-12">
                                {(content.length > 0 && content[0].definitions ? content : [{ section: "General Definitions", definitions: content }]).map((group: any, groupIdx: number) => (
                                    <div key={groupIdx} className="space-y-6">
                                        <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md py-4 border-b border-border-main">
                                            <h3 className="font-playfair text-2xl font-bold text-primary">{group.section}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {group.definitions?.map((item: any, idx: number) => (
                                                <div key={idx} className="glass p-6 rounded-2xl border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform">
                                                    <h4 className="font-bold text-lg mb-2 text-text-main">{item.term}</h4>
                                                    <p className="text-sm text-text-muted leading-relaxed">{item.definition}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {fileType === 'json' && content && activeTab === 'formulae' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {content.map((item: any, idx: number) => (
                                    <div key={idx} className="glass p-6 rounded-2xl hover:-translate-y-1 transition-transform border border-border-main">
                                        <h4 className="font-bold text-primary mb-3">{item.name}</h4>
                                        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg font-mono text-sm text-center mb-3 border border-dashed border-border-main">
                                            {item.formula}
                                        </div>
                                        <p className="text-xs text-text-muted leading-relaxed">{item.meaning}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
