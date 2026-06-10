-- Create the mcq_timers table to store custom durations for specific subjects
CREATE TABLE IF NOT EXISTS public.mcq_timers (
    subject_id TEXT PRIMARY KEY,
    duration_minutes INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mcq_timers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read access to mcq_timers"
ON public.mcq_timers FOR SELECT
USING (true);

-- Allow inserting/updating for authenticated admins
-- (Assuming your RLS or API handles this, but since we use service_role key for admin writes, 
-- we only need the select policy for public frontend fetches).
