// ========================================
// Core Data Types for Feedback Board
// ========================================

export type FeedbackStatus = 'under-review' | 'planned' | 'in-progress' | 'completed';

export type FeedbackCategory = 'feature' | 'bug' | 'improvement' | 'question' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  primaryColor?: string;
  ownerId: string;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string;
  companyId: string;
  isPublic: boolean;
  allowAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  boardId: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  upvotes: string[]; // Array of user IDs who upvoted
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  feedbackId: string;
  authorId: string;
  authorName: string;
  isOfficial: boolean; // From company
  createdAt: string;
}

// ========================================
// UI Helper Types
// ========================================

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const STATUS_CONFIG: Record<FeedbackStatus, StatusConfig> = {
  'under-review': {
    label: 'Under Review',
    color: 'text-accent-600',
    bgColor: 'bg-accent-100',
    borderColor: 'border-accent-300',
  },
  'planned': {
    label: 'Planned',
    color: 'text-info',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-warning',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
  },
  'completed': {
    label: 'Completed',
    color: 'text-success',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
};

export const CATEGORY_CONFIG: Record<FeedbackCategory, { label: string; emoji: string }> = {
  'feature': { label: 'Feature Request', emoji: '✨' },
  'bug': { label: 'Bug Report', emoji: '🐛' },
  'improvement': { label: 'Improvement', emoji: '📈' },
  'question': { label: 'Question', emoji: '❓' },
  'other': { label: 'Other', emoji: '💬' },
};

