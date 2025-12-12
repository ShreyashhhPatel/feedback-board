'use client';

import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Filter,
  ArrowUpDown,
  ExternalLink,
  MessageSquare,
  Search,
  X,
} from 'lucide-react';
import { Button, Modal, Badge, Card, Input, Select } from '@/components/ui';
import { FeedbackCard, FeedbackForm, FeedbackDetail } from '@/components/feedback';
import { useFeedback } from '@/context/FeedbackContext';
import { Feedback, FeedbackStatus, FeedbackCategory, STATUS_CONFIG, CATEGORY_CONFIG } from '@/types';

type SortOption = 'newest' | 'oldest' | 'most-votes' | 'most-comments';

const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'under-review', label: '🔍 Under Review' },
  { value: 'planned', label: '📋 Planned' },
  { value: 'in-progress', label: '🚀 In Progress' },
  { value: 'completed', label: '✅ Completed' },
];

const categoryFilterOptions = [
  { value: 'all', label: 'All Categories' },
  ...Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.emoji} ${config.label}`,
  })),
];

const sortOptions = [
  { value: 'most-votes', label: 'Most Votes' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-comments', label: 'Most Comments' },
];

export default function BoardPage() {
  const params = useParams();
  const { state, getCompanyBySlug, getBoardBySlug, getFeedbacksByBoard } = useFeedback();

  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('most-votes');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const companySlug = params.companySlug as string;
  const boardSlug = params.boardSlug as string;

  const company = getCompanyBySlug(companySlug);
  const board = getBoardBySlug(companySlug, boardSlug);

  const feedbacks = useMemo(() => {
    if (!board) return [];
    let items = getFeedbacksByBoard(board.id);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (f) =>
          f.title.toLowerCase().includes(query) ||
          f.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      items = items.filter((f) => f.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      items = items.filter((f) => f.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most-votes':
        items.sort((a, b) => b.upvotes.length - a.upvotes.length);
        break;
      case 'most-comments':
        items.sort((a, b) => b.commentCount - a.commentCount);
        break;
    }

    return items;
  }, [board, getFeedbacksByBoard, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Status counts for filters
  const statusCounts = useMemo(() => {
    if (!board) return {};
    const allFeedbacks = getFeedbacksByBoard(board.id);
    return allFeedbacks.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [board, getFeedbacksByBoard]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!company || !board) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-bg-tertiary rounded-2xl flex items-center justify-center mb-6">
          <MessageSquare className="w-10 h-10 text-text-muted" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Board Not Found</h1>
        <p className="text-text-secondary text-center max-w-md">
          The board you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
  }

  const isOwner = state.currentUser?.id === company.ownerId;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-text-tertiary">{company.name}</span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
                {board.name}
              </h1>
              {board.description && (
                <p className="text-text-secondary mt-1">{board.description}</p>
              )}
            </div>
            <Button
              onClick={() => setIsNewFeedbackModalOpen(true)}
              leftIcon={<Plus className="w-5 h-5" />}
              className="flex-shrink-0"
            >
              New Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border-primary mb-4"
            >
              <span className="flex items-center gap-2 text-text-primary font-medium">
                <Filter className="w-5 h-5" />
                Filters
              </span>
              <span className="text-sm text-text-tertiary">
                {statusFilter !== 'all' || categoryFilter !== 'all' ? 'Active' : 'None'}
              </span>
            </button>

            {/* Filter Panel */}
            <div className={`${isFilterPanelOpen ? 'block' : 'hidden'} lg:block`}>
              <Card className="sticky top-24">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                {/* Status Filter */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-text-secondary">
                    Status
                  </label>
                  <div className="space-y-1">
                    {statusFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                          ${statusFilter === option.value
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-text-secondary hover:bg-bg-tertiary'
                          }
                        `}
                      >
                        <span>{option.label}</span>
                        {option.value !== 'all' && statusCounts[option.value] > 0 && (
                          <Badge variant="default" size="sm">
                            {statusCounts[option.value]}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-text-secondary">
                    Category
                  </label>
                  <Select
                    options={categoryFilterOptions}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  />
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort By
                  </label>
                  <Select
                    options={sortOptions}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                  />
                </div>

                {/* Clear Filters */}
                {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setSearchQuery('');
                    }}
                    className="w-full mt-4 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-bg-tertiary"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-tertiary">
                {feedbacks.length} {feedbacks.length === 1 ? 'feedback' : 'feedbacks'}
                {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && ' (filtered)'}
              </p>
            </div>

            {/* Feedback List */}
            {feedbacks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery
                    ? 'No feedback matches your filters'
                    : 'No feedback yet'}
                </h3>
                <p className="text-text-secondary mb-6">
                  {statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery
                    ? 'Try adjusting your filters or search query'
                    : 'Be the first to share your thoughts!'}
                </p>
                {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
                  <Button
                    onClick={() => setIsNewFeedbackModalOpen(true)}
                    leftIcon={<Plus className="w-5 h-5" />}
                  >
                    Submit Feedback
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {feedbacks.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <FeedbackCard
                        feedback={feedback}
                        onClick={() => setSelectedFeedback(feedback)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* New Feedback Modal */}
      <Modal
        isOpen={isNewFeedbackModalOpen}
        onClose={() => setIsNewFeedbackModalOpen(false)}
        title="Submit New Feedback"
        size="lg"
      >
        <FeedbackForm
          boardId={board.id}
          onSuccess={() => setIsNewFeedbackModalOpen(false)}
          onCancel={() => setIsNewFeedbackModalOpen(false)}
        />
      </Modal>

      {/* Feedback Detail Modal */}
      <Modal
        isOpen={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        title="Feedback Details"
        size="lg"
      >
        {selectedFeedback && (
          <FeedbackDetail feedback={selectedFeedback} isOwner={isOwner} />
        )}
      </Modal>
    </div>
  );
}

