import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Study Platform',
  description: 'Educational study platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
