'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, MessageCircle, Calendar, User, Send, Shield } from 'lucide-react';
import { Feedback, Comment, STATUS_CONFIG, CATEGORY_CONFIG, FeedbackStatus } from '@/types';
import { Button, Badge, Textarea, Select } from '@/components/ui';
import { useFeedback } from '@/context/FeedbackContext';

interface FeedbackDetailProps {
  feedback: Feedback;
  isOwner?: boolean;
}

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
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-xl
        ${comment.isOfficial
          ? 'bg-primary-50 border border-primary-200'
          : 'bg-bg-tertiary'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${comment.isOfficial
              ? 'bg-primary-500 text-white'
              : 'bg-gradient-to-br from-primary-400 to-accent-400 text-white'
            }
          `}
        >
          {comment.isOfficial ? (
            <Shield className="w-4 h-4" />
          ) : (
            comment.authorName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary text-sm">
              {comment.authorName}
            </span>
            {comment.isOfficial && (
              <Badge variant="primary" size="sm">
                Team
              </Badge>
            )}
            <span className="text-xs text-text-muted">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="mt-2 text-sm text-text-secondary whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function FeedbackDetail({ feedback, isOwner = false }: FeedbackDetailProps) {
  const {
    toggleUpvote,
    updateFeedbackStatus,
    addComment,
    getCommentsByFeedback,
    state,
  } = useFeedback();

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const comments = getCommentsByFeedback(feedback.id);
  const statusConfig = STATUS_CONFIG[feedback.status];
  const categoryConfig = CATEGORY_CONFIG[feedback.category];

  const hasUpvoted = state.currentUser
    ? feedback.upvotes.includes(state.currentUser.id)
    : false;

  const handleUpvote = () => {
    toggleUpvote(feedback.id);
  };

  const handleStatusChange = (newStatus: FeedbackStatus) => {
    updateFeedbackStatus(feedback.id, newStatus);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      addComment({
        content: newComment,
        feedbackId: feedback.id,
        isOfficial: isOwner,
      });
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Upvote Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpvote}
          className={`
            flex flex-col items-center justify-center
            px-4 py-3 rounded-xl min-w-[70px]
            border transition-colors
            ${hasUpvoted
              ? 'bg-primary-50 border-primary-300 text-primary-600'
              : 'bg-bg-tertiary border-border-primary text-text-secondary hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
            }
          `}
        >
          <ChevronUp className="w-6 h-6" />
          <span className="text-xl font-bold">{feedback.upvotes.length}</span>
        </motion.button>

        {/* Title and Meta */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-text-primary font-display">
            {feedback.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="default">
              {categoryConfig.emoji} {categoryConfig.label}
            </Badge>
            <Badge
              variant={
                feedback.status === 'completed'
                  ? 'success'
                  : feedback.status === 'in-progress'
                  ? 'warning'
                  : feedback.status === 'planned'
                  ? 'info'
                  : 'primary'
              }
            >
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-bg-tertiary rounded-xl p-5">
        <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
          {feedback.description}
        </p>
      </div>

      {/* Author and Date */}
      <div className="flex items-center justify-between text-sm text-text-tertiary">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {feedback.authorName}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(feedback.createdAt)}
          </span>
        </div>
        <span className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {comments.length} comments
        </span>
      </div>

      {/* Status Management (Owner Only) */}
      {isOwner && (
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="font-medium text-primary-700 text-sm">Board Owner Actions</span>
          </div>
          <Select
            label="Update Status"
            options={statusOptions}
            value={feedback.status}
            onChange={(e) => handleStatusChange(e.target.value as FeedbackStatus)}
          />
        </div>
      )}

      {/* Comments Section */}
      <div className="border-t border-border-primary pt-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {state.currentUser?.name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <Textarea
                placeholder={
                  state.currentUser
                    ? 'Add a comment...'
                    : 'Sign in to comment'
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
                disabled={!state.currentUser}
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || !state.currentUser}
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-text-tertiary">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

