'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/apiService';
import {
  HomeIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/tasks', label: 'Tasks', icon: CheckBadgeIcon },
  { href: '/annotate', label: 'Annotation', icon: PencilSquareIcon },
  { href: '/reports', label: 'Reports', icon: ChartBarIcon },
  { href: '/calendar', label: 'Calendar', icon: CalendarDaysIcon },
  { href: '/settings', label: 'Settings', icon: Cog6ToothIcon },
];

const bottomItems = [
  { href: '/help', label: 'Help', icon: QuestionMarkCircleIcon },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          w-[260px] bg-white border-r border-border flex flex-col h-screen fixed left-0 top-0 z-50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-3 h-[72px] flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-text-primary font-bold text-lg tracking-tight">TaskAnnotate</span>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={`${item.label}-${index}`}
                href={item.href}
                onClick={onClose}
                className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-3 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="sidebar-item sidebar-item-inactive"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="sidebar-item sidebar-item-inactive w-full text-danger hover:text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
