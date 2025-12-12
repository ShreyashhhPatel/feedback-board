'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui';
import { Loader2, Sparkles } from 'lucide-react';

const demoData = {
  company: {
    name: 'Acme SaaS',
    slug: 'acme-saas',
    description: 'The best SaaS product for your business needs',
    website: 'https://acme.example.com',
  },
  board: {
    name: 'Feature Requests',
    slug: 'feature-requests',
    description: 'Share your ideas and help us build the features you need',
    isPublic: true,
    allowAnonymous: true,
  },
  feedbacks: [
    {
      title: 'Dark mode support',
      description: 'It would be great to have a dark mode option for the app. This would help reduce eye strain during late-night work sessions and save battery on OLED screens.',
      category: 'feature' as const,
      status: 'in-progress' as const,
      authorName: 'Sarah Chen',
      upvoteCount: 47,
    },
    {
      title: 'Export data to CSV',
      description: 'Need the ability to export all my data to CSV format for reporting purposes. This is essential for our quarterly reports.',
      category: 'feature' as const,
      status: 'planned' as const,
      authorName: 'Michael Roberts',
      upvoteCount: 32,
    },
    {
      title: 'Mobile app improvements',
      description: 'The mobile app is slow and sometimes crashes when loading large datasets. Please optimize the performance.',
      category: 'bug' as const,
      status: 'under-review' as const,
      authorName: 'Alex Thompson',
      upvoteCount: 28,
    },
    {
      title: 'Integration with Slack',
      description: 'Would love to receive notifications and updates directly in Slack. This would help our team stay informed without switching contexts.',
      category: 'feature' as const,
      status: 'completed' as const,
      authorName: 'Emily Davis',
      upvoteCount: 56,
    },
    {
      title: 'Better search functionality',
      description: 'The current search is basic. Need advanced filters, boolean operators, and the ability to save search queries.',
      category: 'improvement' as const,
      status: 'planned' as const,
      authorName: 'David Wilson',
      upvoteCount: 24,
    },
    {
      title: 'Team collaboration features',
      description: 'Add real-time collaboration so multiple team members can work on the same project simultaneously.',
      category: 'feature' as const,
      status: 'under-review' as const,
      authorName: 'Jennifer Park',
      upvoteCount: 19,
    },
  ],
};

export default function DemoPage() {
  const router = useRouter();
  const { state, createCompany, createBoard, createFeedback, getCompanyBySlug, getBoardBySlug } = useFeedback();
  const [isCreating, setIsCreating] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (state.isLoading) return;

    const existingCompany = getCompanyBySlug(demoData.company.slug);
    const existingBoard = existingCompany
      ? getBoardBySlug(demoData.company.slug, demoData.board.slug)
      : null;

    if (existingCompany && existingBoard) {
      setIsReady(true);
    }
  }, [state.isLoading, getCompanyBySlug, getBoardBySlug]);

  const setupDemoBoard = async () => {
    setIsCreating(true);

    try {
      // Check if demo company already exists
      let company = getCompanyBySlug(demoData.company.slug);

      if (!company) {
        company = createCompany(demoData.company);
      }

      // Check if demo board already exists
      let board = getBoardBySlug(demoData.company.slug, demoData.board.slug);

      if (!board) {
        board = createBoard({
          ...demoData.board,
          companyId: company.id,
        });

        // Add demo feedbacks
        for (const feedbackData of demoData.feedbacks) {
          const feedback = createFeedback({
            title: feedbackData.title,
            description: feedbackData.description,
            category: feedbackData.category,
            boardId: board.id,
            authorName: feedbackData.authorName,
          });

          // Simulate upvotes (we'll just update the state)
          // In a real app, this would be handled differently
        }
      }

      // Redirect to demo board
      router.push(`/board/${demoData.company.slug}/${demoData.board.slug}`);
    } catch (error) {
      console.error('Error setting up demo:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const goToDemo = () => {
    router.push(`/board/${demoData.company.slug}/${demoData.board.slug}`);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold font-display text-text-primary mb-4">
          Demo Feedback Board
        </h1>

        <p className="text-text-secondary mb-8">
          {isReady
            ? 'Your demo board is ready! Click below to explore the feedback board with sample data.'
            : 'Set up a demo board with sample data to see how FeedbackFlow works. You can explore all features including voting, comments, and status management.'}
        </p>

        {isReady ? (
          <Button
            size="lg"
            onClick={goToDemo}
            className="w-full"
          >
            View Demo Board
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={setupDemoBoard}
            isLoading={isCreating}
            className="w-full"
          >
            {isCreating ? 'Setting up...' : 'Create Demo Board'}
          </Button>
        )}

        <p className="text-sm text-text-tertiary mt-6">
          This demo uses local storage. Your data stays in your browser.
        </p>
      </div>
    </div>
  );
}

