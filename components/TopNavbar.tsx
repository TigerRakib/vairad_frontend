'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import toast from 'react-hot-toast';

interface TopNavbarProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

export function TopNavbar({ title, subtitle, onMenuToggle }: TopNavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Error logging out');
    }
  };

  const initials = user
    ? (user.username || user.email || 'U').charAt(0).toUpperCase()
    : 'U';

  return (
    <header className="h-[72px] bg-white border-b border-border flex items-center justify-between px-4 sm:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-button hover:bg-slate-100 transition-colors text-text-secondary"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg font-bold text-text-primary">{title}</h1>
          {subtitle && (
            <p className="text-sm text-text-secondary hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification */}
        <button className="relative p-2 rounded-button hover:bg-slate-100 transition-colors text-text-secondary">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-button hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            <span className="text-sm font-medium text-text-primary hidden sm:inline">
              {user?.username || user?.email || 'User'}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-text-secondary hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-card shadow-card py-2 min-w-[180px] z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-text-primary">{user?.username || 'User'}</p>
                <p className="text-xs text-text-secondary">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
