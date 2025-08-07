'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode'; // ✅ Use default import for v3.x

export default function withAuth(Component, allowedRoles = []) {
    return function AuthWrapper(props) {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const userRole = decoded.role;

                if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                    router.push('/login');
                }
            } catch (err) {
                console.error('Invalid token:', err);
                router.push('/login');
            }
        }, []);

        return <Component {...props} />;
    };
}
