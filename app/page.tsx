'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { CheckBadgeIcon, PencilSquareIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #5B5CEB 0%, #4949D4 50%, #7C3AED 100%)',
      }}
    >
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block w-16 h-16 bg-white/15 rounded-card flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            TaskAnnotate
          </h1>
          <p className="text-lg text-white/70">
            Task Management & Image Annotation Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="bg-white rounded-card shadow-card p-7 hover:shadow-card-hover transition-shadow border border-white/20">
            <CheckBadgeIcon className="w-10 h-10 text-primary mb-3" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Task Management</h2>
            <p className="text-sm text-text-secondary mb-4">
              Organize work with a Kanban board. Create, edit, and manage tasks with drag-and-drop.
            </p>
            <ul className="space-y-1.5 text-sm text-text-primary">
              <li className="flex items-center gap-2"><span className="text-primary font-bold">&#10003;</span> Daily task organization</li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">&#10003;</span> Priority management</li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">&#10003;</span> Drag & drop interface</li>
            </ul>
          </div>

          <div className="bg-white rounded-card shadow-card p-7 hover:shadow-card-hover transition-shadow border border-white/20">
            <PencilSquareIcon className="w-10 h-10 text-primary mb-3" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Image Annotation</h2>
            <p className="text-sm text-text-secondary mb-4">
              Annotate images with polygon drawings. Label regions and persist annotations.
            </p>
            <ul className="space-y-1.5 text-sm text-text-primary">
              <li className="flex items-center gap-2"><span className="text-primary font-bold">&#10003;</span> Polygon drawing tools</li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">&#10003;</span> Multi-image support</li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">&#10003;</span> Annotation management</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-primary font-semibold rounded-button hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2 shadow-lg"
          >
            Login
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white/10 text-white font-semibold rounded-button hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2 border border-white/30"
          >
            Create Account
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
