import './globals.css';
import { ReactNode } from 'react';
import { ToasterProvider } from '@/components/ToasterProvider';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>TaskAnnotate</title>
      </head>
      <body className="bg-[#F7F8FC]">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
