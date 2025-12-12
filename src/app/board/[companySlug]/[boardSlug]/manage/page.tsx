'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Settings,
  Trash2,
  MessageSquare,
  ChevronUp,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Button, Card, Badge, Select, Input, Textarea, Modal } from '@/components/ui';
import { useFeedback } from '@/context/FeedbackContext';
import { FeedbackStatus, STATUS_CONFIG, CATEGORY_CONFIG } from '@/types';

const statusOptions = [
  { value: 'under-review', label: '🔍 Under Review' },
  { value: 'planned', label: '📋 Planned' },
  { value: 'in-progress', label: '🚀 In Progress' },
  { value: 'completed', label: '✅ Completed' },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ManageBoardPage() {
  const params = useParams();
  const router = useRouter();
  const {
    state,
    getCompanyBySlug,
    getBoardBySlug,
    getFeedbacksByBoard,
    updateBoard,
    updateFeedbackStatus,
    deleteFeedback,
    deleteBoard,
  } = useFeedback();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const companySlug = params.companySlug as string;
  const boardSlug = params.boardSlug as string;

  const company = getCompanyBySlug(companySlug);
  const board = getBoardBySlug(companySlug, boardSlug);

  const feedbacks = useMemo(() => {
    if (!board) return [];
    let items = getFeedbacksByBoard(board.id);

    if (statusFilter !== 'all') {
      items = items.filter((f) => f.status === statusFilter);
    }

    return items.sort((a, b) => b.upvotes.length - a.upvotes.length);
  }, [board, getFeedbacksByBoard, statusFilter]);

  const stats = useMemo(() => {
    if (!board) return { total: 0, underReview: 0, planned: 0, inProgress: 0, completed: 0, totalVotes: 0 };
    const allFeedbacks = getFeedbacksByBoard(board.id);
    return {
      total: allFeedbacks.length,
      underReview: allFeedbacks.filter((f) => f.status === 'under-review').length,
      planned: allFeedbacks.filter((f) => f.status === 'planned').length,
      inProgress: allFeedbacks.filter((f) => f.status === 'in-progress').length,
      completed: allFeedbacks.filter((f) => f.status === 'completed').length,
      totalVotes: allFeedbacks.reduce((acc, f) => acc + f.upvotes.length, 0),
    };
  }, [board, getFeedbacksByBoard]);

  const handleStatusChange = (feedbackId: string, newStatus: FeedbackStatus) => {
    updateFeedbackStatus(feedbackId, newStatus);
  };

  const handleEditBoard = () => {
    if (board) {
      setEditForm({ name: board.name, description: board.description });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (board && editForm.name) {
      updateBoard({
        ...board,
        name: editForm.name,
        description: editForm.description,
      });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteBoard = () => {
    if (board) {
      deleteBoard(board.id);
      router.push('/dashboard');
    }
  };

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
        <h1 className="text-2xl font-bold text-text-primary mb-2">Board Not Found</h1>
        <p className="text-text-secondary mb-4">The board you're looking for doesn't exist.</p>
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-text-tertiary mb-1">
                <span>{company.name}</span>
                <span>/</span>
                <span className="text-text-primary font-medium">{board.name}</span>
              </div>
              <h1 className="text-2xl font-bold font-display text-text-primary flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary-500" />
                Manage Board
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/board/${companySlug}/${boardSlug}`}>
                <Button variant="secondary" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                  View Public Board
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleEditBoard}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: MessageSquare, color: 'text-text-primary' },
            { label: 'Votes', value: stats.totalVotes, icon: ChevronUp, color: 'text-primary-500' },
            { label: 'Under Review', value: stats.underReview, icon: AlertCircle, color: 'text-accent-500' },
            { label: 'Planned', value: stats.planned, icon: Calendar, color: 'text-info' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-warning' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-success' },
          ].map((stat) => (
            <Card key={stat.label} padding="sm" className="text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-tertiary">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card>
          {/* Filter */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Feedback Items</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-tertiary" />
              <Select
                options={[{ value: 'all', label: 'All Statuses' }, ...statusOptions]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              />
            </div>
          </div>

          {/* Table */}
          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No feedback items to manage</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-primary">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                      Feedback
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-text-secondary w-24">
                      Votes
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary w-32">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary w-44">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary w-28">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {feedbacks.map((feedback) => {
                      const categoryConfig = CATEGORY_CONFIG[feedback.category];
                      return (
                        <motion.tr
                          key={feedback.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-border-primary hover:bg-bg-tertiary transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-text-primary line-clamp-1">
                                {feedback.title}
                              </p>
                              <p className="text-sm text-text-tertiary line-clamp-1">
                                {feedback.description}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-text-primary font-medium">
                              <ChevronUp className="w-4 h-4" />
                              {feedback.upvotes.length}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="default" size="sm">
                              {categoryConfig.emoji} {categoryConfig.label}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Select
                              options={statusOptions}
                              value={feedback.status}
                              onChange={(e) =>
                                handleStatusChange(feedback.id, e.target.value as FeedbackStatus)
                              }
                              className="text-sm"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-text-tertiary">
                              {formatDate(feedback.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => deleteFeedback(feedback.id)}
                              className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Edit Board Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Board"
      >
        <form onSubmit={handleSaveBoard} className="space-y-5">
          <Input
            label="Board Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Board"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Are you sure you want to delete this board? This action cannot be undone and will
            remove all feedback associated with it.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteBoard}>
              Delete Board
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

