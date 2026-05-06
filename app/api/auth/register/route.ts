import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/supabase';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        // Validate inputs
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
        }

        // Check if email already exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
        }

        // Hash password and store user
        const hashedPassword = await bcrypt.hash(password, 12);

        const { error } = await supabase.from('users').insert({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            image: '',
            nickname: '',
            level: '',
            is_onboarded: false,
            provider: 'credentials',
        });

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Account created successfully.' });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
