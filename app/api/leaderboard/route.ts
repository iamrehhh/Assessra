// GET /api/leaderboard
// Returns top 20 users ranked by total score for IGCSE and A Level respectively

import supabase from '@/lib/supabase';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        // Fetch all scores
        const { data: scores, error } = await supabase
            .from('scores')
            .select('username, score, max_marks, subject, submitted_at');

        if (error) {
            console.error('Leaderboard scores error:', error);
            return Response.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 });
        }

        // Aggregate per user in JS
        const userMap: Record<string, any> = {};
        for (const s of (scores || [])) {
            if (!userMap[s.username]) {
                userMap[s.username] = {
                    _id: s.username,
                    totalScore: 0,
                    totalMax: 0,
                    totalAttempts: 0,
                    subjects: new Set(),
                    lastActivity: null,
                };
            }
            const u = userMap[s.username];
            u.totalScore += s.score;
            u.totalMax += s.max_marks;
            u.totalAttempts += 1;
            u.subjects.add(s.subject);
            if (!u.lastActivity || new Date(s.submitted_at) > new Date(u.lastActivity)) {
                u.lastActivity = s.submitted_at;
            }
        }

        let leaderboard = Object.values(userMap).map(u => ({
            ...u,
            subjects: Array.from(u.subjects),
            percentage: u.totalMax > 0 ? Math.round((u.totalScore / u.totalMax) * 100) : 0,
        }));

        // Enrich with user profile data (nickname, image, level) for all aggregated users
        const emails = leaderboard.map(u => u._id);
        if (emails.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('email, nickname, image, level')
                .in('email', emails);

            const userLookup: Record<string, any> = {};
            for (const u of (users || [])) {
                userLookup[u.email] = u;
            }

            for (const entry of leaderboard) {
                const profile = userLookup[entry._id];
                if (profile) {
                    entry.nickname = profile.nickname;
                    entry.image = profile.image;
                    entry.level = profile.level;
                }
            }
        }

        // Split into IGCSE and A Level
        let igcse = leaderboard.filter(u => u.level === 'IGCSE');
        let alevel = leaderboard.filter(u => u.level === 'A Level' || u.level === 'AS Level');

        // Sort by totalScore descending, take top 20
        igcse.sort((a, b) => b.totalScore - a.totalScore);
        igcse = igcse.slice(0, 20);

        alevel.sort((a, b) => b.totalScore - a.totalScore);
        alevel = alevel.slice(0, 20);

        return Response.json({ 
            igcse, 
            alevel,
            // Keep original single leaderboard for backward compatibility while UI updates, if needed
            leaderboard: [...igcse, ...alevel].sort((a, b) => b.totalScore - a.totalScore).slice(0, 20)
        });
    } catch (err) {
        console.error('Leaderboard error:', err);
        return Response.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 });
    }
}
