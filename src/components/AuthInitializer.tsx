'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreUserSession } from '@/redux/slices/authSlice';
import { usePathname } from 'next/navigation';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    const pathname = usePathname();
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

    const isSubdomain = hostname.includes('.') &&
        !hostname.startsWith('www.') &&
        hostname !== 'localhost' &&
        hostname !== process.env.NEXT_PUBLIC_DOMAIN;

    const isPublicPath = isSubdomain ||
        pathname.startsWith('/portfolio/') ||
        pathname.startsWith('/api/portfolio/') ||
        pathname.startsWith('/auth/');

    useEffect(() => {
        if (!isPublicPath && (!isAuthenticated || !user)) {
            dispatch(restoreUserSession());
        } else {
            console.log(
                isPublicPath
                    ? (isSubdomain ? 'Skipping auth on subdomain' : 'Skipping auth on public path')
                    : 'Already authenticated, skipping restore'
            );
        }
    }, [dispatch, isAuthenticated, user, isPublicPath, pathname, isSubdomain, hostname]);

    return null;
}