'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { User } from '@/types';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, setUser, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await apiService.getCurrentUser();
      setProfileUser(data);
      setUser(data);
    } catch {
      if (user) setProfileUser(user);
    }
  };

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

  const initials = profileUser
    ? (profileUser.username || profileUser.email || 'U').charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px]">
        <TopNavbar
          title="Settings"
          subtitle="Manage your account"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl space-y-6">
          {/* Profile Card */}
          <section className="card p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
              Profile
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">{initials}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">
                  {profileUser?.username || 'User'}
                </p>
                <p className="text-sm text-text-secondary">{profileUser?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-button">
                <UserCircleIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-0.5">
                    Username
                  </p>
                  <p className="text-sm text-text-primary truncate">
                    {profileUser?.username || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-button">
                <EnvelopeIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-0.5">
                    Email
                  </p>
                  <p className="text-sm text-text-primary truncate">
                    {profileUser?.email || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-button">
                <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-0.5">
                    Account Status
                  </p>
                  <p className="text-sm text-success font-medium">Active</p>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="card p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
              Security
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-button hover:bg-slate-50 transition-colors text-left">
                <KeyIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Change Password</p>
                  <p className="text-xs text-text-secondary">Update your account password</p>
                </div>
              </button>
            </div>
          </section>

          {/* Account Actions */}
          <section className="card p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
              Account Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-button hover:bg-slate-50 transition-colors text-left"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Log Out</p>
                  <p className="text-xs text-text-secondary">Sign out of your account</p>
                </div>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 p-3 rounded-button hover:bg-red-50 transition-colors text-left"
              >
                <TrashIcon className="w-5 h-5 text-danger flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-danger">Delete Account</p>
                  <p className="text-xs text-text-secondary">Permanently delete your account and data</p>
                </div>
              </button>
            </div>
          </section>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
              <div
                className="bg-white rounded-modal shadow-2xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-text-primary mb-2">Delete Account</h3>
                <p className="text-sm text-text-secondary mb-6">
                  This action is permanent and cannot be undone. All your data will be lost.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-outline btn-small"
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger btn-small">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
