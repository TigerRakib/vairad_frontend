'use client';

import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { useState } from 'react';
import {
  CheckBadgeIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const faqs = [
  {
    q: 'How do I create a task?',
    a: 'Go to Tasks, select a date, and click "Add Task". Fill in the title, priority, and status, then save.',
  },
  {
    q: 'How do I move a task between columns?',
    a: 'Drag and drop the task card from one column (To Do, In Progress, Done) to another.',
  },
  {
    q: 'How do I change the date for tasks?',
    a: 'Use the date picker or the prev/next arrows in the Tasks page header to navigate between dates.',
  },
  {
    q: 'How do I annotate an image?',
    a: 'Go to Annotation, upload an image, then click on it to open the annotation editor. Use the polygon tool to draw regions.',
  },
  {
    q: 'What do the priority colors mean?',
    a: 'Red is High priority, Yellow is Medium, Green is Low. They help you quickly identify task urgency.',
  },
  {
    q: 'Where can I see my progress?',
    a: 'The Dashboard shows task counts and annotation stats. Reports has detailed analytics with charts.',
  },
];

const features = [
  {
    icon: CheckBadgeIcon,
    title: 'Task Management',
    description: 'Create, edit, and organize tasks with a Kanban board. Drag and drop to change status.',
    link: '/tasks',
  },
  {
    icon: PencilSquareIcon,
    title: 'Image Annotation',
    description: 'Upload radiology images and annotate regions with polygon tools.',
    link: '/annotate',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Calendar View',
    description: 'See tasks organized by date on a monthly calendar.',
    link: '/calendar',
  },
  {
    icon: ChartBarIcon,
    title: 'Reports & Analytics',
    description: 'Track completion rates, priority breakdowns, and weekly productivity.',
    link: '/reports',
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px]">
        <TopNavbar
          title="Help"
          subtitle="How to use TaskAnnotate"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl space-y-8">
          {/* Features */}
          <section>
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.title}
                    onClick={() => router.push(f.link)}
                    className="card p-5 text-left hover:shadow-card-hover transition-shadow group"
                  >
                    <Icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-sm font-bold text-text-primary mb-1 flex items-center gap-2">
                      {f.title}
                      <ArrowRightIcon className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{f.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="text-sm font-medium text-text-primary pr-4">{faq.q}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-text-secondary flex-shrink-0 transition-transform duration-200 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="card p-6 text-center">
            <QuestionMarkCircleIcon className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-base font-bold text-text-primary mb-1">Still need help?</h3>
            <p className="text-sm text-text-secondary">
              Reach out to your admin for account or access issues.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
