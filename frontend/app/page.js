'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';

export default function RedirectToDashboard() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const role = decoded.role;

            if (role === 'employee') {
                router.push('/employee/dashboard');
            } else if (role === 'manager') {
                router.push('/manager/dashboard');
            } else {
                router.push('/login'); // fallback for unknown roles
            }
        } catch (err) {
            console.error('Invalid token', err);
            router.push('/login');
        }
    }, [router]);

    return null; // or a loading spinner
}
