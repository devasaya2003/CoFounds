'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreUserSession } from '@/redux/slices/authSlice';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            dispatch(restoreUserSession());
        }
    }, [dispatch, isAuthenticated, user]);

    return null;
}