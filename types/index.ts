// Core Type Definitions for Assessra

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export interface SessionUser extends User {
    username?: string | null;
    nickname?: string | null;
}

export interface PastPaper {
    id?: string;
    originalId: string;
    filename: string;
    subject: string;
    level: string;
    type: 'paper' | 'mark_scheme' | 'resource';
    year?: number | string;
    season?: string;
    url?: string;
}

export interface ScoreAttempt {
    id: string;
    userId: string;
    paperId: string;
    paperTitle?: string;
    subject: string;
    questionNumber: string | number;
    score: number;
    maxMarks: number;
    submittedAt: string | Date;
}

export interface ScorecardData {
    username: string;
    attempts: ScoreAttempt[];
    subjectTotals: Record<string, { score: number; maxMarks: number; attempts: number }>;
    grandTotal: number;
    grandMax: number;
    grandPercent: number;
}
