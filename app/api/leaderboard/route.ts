
// GET /api/leaderboard
// Returns top 20 users ranked by total score

import supabase from '@/lib/supabase';

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

        // Aggregate per user in JS (replaces MongoDB aggregation pipeline)
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

        // Sort by totalScore descending, take top 20
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);
        leaderboard = leaderboard.slice(0, 20);

        // Enrich with user profile data (nickname, image, level)
        const emails = leaderboard.map(u => u._id);
        if (emails.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('email, nickname, image, level')
                .in('email', emails);

            const userLookup = {};
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

        return Response.json({ leaderboard });
    } catch (err) {
        console.error('Leaderboard error:', err);
        return Response.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 });
    }
}
