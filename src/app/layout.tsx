import type { Metadata } from 'next';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { Navbar } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'FeedbackFlow - Collect & Organize Customer Feedback',
  description:
    'Create feedback boards for your SaaS products. Let users submit ideas, vote on features, and track progress.',
  keywords: ['feedback', 'saas', 'product', 'feature requests', 'roadmap'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@100..900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-primary font-body antialiased">
        <FeedbackProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </FeedbackProvider>
      </body>
    </html>
  );
}
