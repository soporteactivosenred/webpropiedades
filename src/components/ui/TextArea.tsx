'use client';

import { forwardRef, TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { cn } from '@/lib';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  autoResize?: boolean;
  maxHeight?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, label, error, hint, autoResize = false, maxHeight = 400, id, ...props },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        
        const adjustHeight = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        };

        adjustHeight();
        textarea.addEventListener('input', adjustHeight);
        
        return () => textarea.removeEventListener('input', adjustHeight);
      }
    }, [autoResize, maxHeight, textareaRef]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={textareaRef}
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
            'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            'dark:focus:ring-primary-400 dark:focus:border-primary-400',
            'resize-none',
            autoResize && 'overflow-hidden',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextArea };
export type { TextAreaProps };