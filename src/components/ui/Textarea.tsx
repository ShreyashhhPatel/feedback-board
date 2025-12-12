'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-2.5
            bg-bg-secondary
            border border-border-primary
            rounded-lg
            text-text-primary
            placeholder:text-text-muted
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
            hover:border-border-secondary
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y min-h-[100px]
            ${error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-text-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

