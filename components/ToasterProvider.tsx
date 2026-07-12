'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export function ToasterProvider() {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      useAuthStore.setState({
        token,
        user: JSON.parse(user),
      });
    }
  }, []);

  return <Toaster position="top-right" />;
}
