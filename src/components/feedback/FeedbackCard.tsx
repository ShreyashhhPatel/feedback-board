'use client';

import { motion } from 'framer-motion';
import { ChevronUp, MessageCircle, Clock } from 'lucide-react';
import { Feedback, STATUS_CONFIG, CATEGORY_CONFIG } from '@/types';
import { Badge, Card } from '@/components/ui';
import { useFeedback } from '@/context/FeedbackContext';

interface FeedbackCardProps {
  feedback: Feedback;
  onClick?: () => void;
  showStatus?: boolean;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function FeedbackCard({ feedback, onClick, showStatus = true }: FeedbackCardProps) {
  const { toggleUpvote, state } = useFeedback();
  const statusConfig = STATUS_CONFIG[feedback.status];
  const categoryConfig = CATEGORY_CONFIG[feedback.category];

  const hasUpvoted = state.currentUser
    ? feedback.upvotes.includes(state.currentUser.id)
    : false;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvote(feedback.id);
  };

  return (
    <Card
      hover
      padding="none"
      className="overflow-hidden"
      onClick={onClick}
    >
      <div className="flex">
        {/* Upvote Section */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpvote}
          className={`
            flex flex-col items-center justify-center
            px-4 py-6 min-w-[70px]
            border-r border-border-primary
            transition-colors
            ${hasUpvoted
              ? 'bg-primary-50 text-primary-600'
              : 'bg-bg-tertiary text-text-secondary hover:bg-primary-50 hover:text-primary-600'
            }
          `}
        >
          <ChevronUp
            className={`w-5 h-5 ${hasUpvoted ? 'text-primary-500' : ''}`}
          />
          <span className="text-lg font-bold mt-1">{feedback.upvotes.length}</span>
        </motion.button>

        {/* Content Section */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-base font-semibold text-text-primary line-clamp-2 mb-1">
                {feedback.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                {feedback.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Category Badge */}
                <Badge variant="default" size="sm">
                  {categoryConfig.emoji} {categoryConfig.label}
                </Badge>

                {/* Status Badge */}
                {showStatus && (
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
                    size="sm"
                  >
                    {statusConfig.label}
                  </Badge>
                )}

                {/* Comment Count */}
                {feedback.commentCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-text-tertiary">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {feedback.commentCount}
                  </span>
                )}

                {/* Time */}
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimeAgo(feedback.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-primary">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-medium">
              {feedback.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-text-tertiary">{feedback.authorName}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

