'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Select } from '@/components/ui';
import { FeedbackCategory, CATEGORY_CONFIG } from '@/types';
import { useFeedback } from '@/context/FeedbackContext';

interface FeedbackFormProps {
  boardId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
  value,
  label: `${config.emoji} ${config.label}`,
}));

export function FeedbackForm({ boardId, onSuccess, onCancel }: FeedbackFormProps) {
  const { createFeedback, state } = useFeedback();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'feature' as FeedbackCategory,
    authorName: state.currentUser?.name || '',
    authorEmail: state.currentUser?.email || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!state.currentUser && !formData.authorName.trim()) {
      newErrors.authorName = 'Your name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      createFeedback({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        boardId,
        authorName: formData.authorName || state.currentUser?.name || 'Anonymous',
        authorEmail: formData.authorEmail || state.currentUser?.email,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'feature',
        authorName: state.currentUser?.name || '',
        authorEmail: state.currentUser?.email || '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Title"
        placeholder="Short, descriptive title for your feedback"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        required
      />

      <Textarea
        label="Description"
        placeholder="Provide details about your feedback. What problem does it solve? How would it help?"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        required
      />

      <Select
        label="Category"
        options={categoryOptions}
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value as FeedbackCategory })}
      />

      {!state.currentUser && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            placeholder="John Doe"
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            error={errors.authorName}
            required
          />
          <Input
            label="Email (optional)"
            type="email"
            placeholder="john@example.com"
            value={formData.authorEmail}
            onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
            helperText="For updates on your feedback"
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          Submit Feedback
        </Button>
      </div>
    </form>
  );
}

