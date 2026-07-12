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
      router.push('/tasks');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              V
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            VaiRadiology
          </h1>
          <p className="text-xl text-blue-100">
            Task Management & Image Annotation Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Task Management Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <CheckBadgeIcon className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Task Management
            </h2>
            <p className="text-gray-600 mb-4">
              Organize your work with a Kanban board. Create, edit, and manage tasks by date with drag-and-drop support.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Daily task organization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Priority management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Drag & drop interface
              </li>
            </ul>
          </div>

          {/* Image Annotation Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <PencilSquareIcon className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Image Annotation
            </h2>
            <p className="text-gray-600 mb-4">
              Annotate images with polygon drawings. Label regions of interest and persist them to the database.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span> Polygon drawing tools
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span> Multi-image support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span> Annotation management
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
          >
            Login
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-12 text-center text-blue-100">
          <p className="text-sm">
            Designed with ❤️ for efficient workflow management and radiology annotation
          </p>
        </div>
      </div>
    </div>
  );
}
