import './globals.css';
import { ReactNode } from 'react';
import { ToasterProvider } from '@/components/ToasterProvider';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
