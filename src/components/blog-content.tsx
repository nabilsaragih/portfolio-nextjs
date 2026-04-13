'use client';

import { useEffect, useMemo, useRef } from 'react';

const BLOG_CONTENT_CLASSNAME =
  'blog-prose prose prose-neutral prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-8 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:font-medium prose-a:text-navy-600 prose-a:no-underline hover:prose-a:text-navy-800 dark:prose-a:text-navy-300 dark:hover:prose-a:text-navy-200 prose-strong:text-gray-950 dark:prose-strong:text-white prose-code:rounded-md prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:font-medium prose-code:text-navy-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-navy-500/10 dark:prose-code:text-navy-200 prose-pre:overflow-x-auto prose-pre:rounded-[24px] prose-pre:border prose-pre:border-gray-200 prose-pre:bg-slate-950 prose-pre:px-5 prose-pre:py-4 prose-pre:text-slate-200 dark:prose-pre:border-white/10 prose-blockquote:rounded-[24px] prose-blockquote:border prose-blockquote:border-navy-100 prose-blockquote:bg-navy-50/70 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:font-normal prose-blockquote:not-italic dark:prose-blockquote:border-navy-500/20 dark:prose-blockquote:bg-navy-500/10 prose-img:rounded-[24px] prose-img:border prose-img:border-gray-200 dark:prose-img:border-white/10';

function withCopyButtons(html: string) {
  return html.replace(/<pre\b[\s\S]*?<\/pre>/g, (block) => {
    return `
      <div class="blog-code-block" data-code-block>
        <button type="button" class="blog-copy-button" data-copy-code aria-label="Copy code">
          <span data-copy-label>Copy code</span>
        </button>
        ${block}
      </div>
    `;
  });
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function BlogContent({ className = '', html }: { className?: string; html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const enhancedHtml = useMemo(() => withCopyButtons(html), [html]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const buttonTimers = new Map<HTMLButtonElement, number>();

    const setButtonState = (button: HTMLButtonElement, labelText: string, status: 'idle' | 'copied' | 'error') => {
      const label = button.querySelector<HTMLElement>('[data-copy-label]');
      button.dataset.status = status;

      if (label) {
        label.textContent = labelText;
      }

      const existingTimer = buttonTimers.get(button);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      if (status === 'idle') {
        buttonTimers.delete(button);
        return;
      }

      const resetTimer = window.setTimeout(() => {
        button.dataset.status = 'idle';
        if (label) {
          label.textContent = 'Copy code';
        }
        buttonTimers.delete(button);
      }, 1800);

      buttonTimers.set(button, resetTimer);
    };

    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>('[data-copy-code]');

      if (!button || !root.contains(button)) {
        return;
      }

      const wrapper = button.closest<HTMLElement>('[data-code-block]');
      const codeElement = wrapper?.querySelector<HTMLElement>('pre code');
      const text = codeElement?.textContent?.replace(/\s+$/, '') ?? '';

      if (!text) {
        setButtonState(button, 'No code', 'error');
        return;
      }

      try {
        await copyText(text);
        setButtonState(button, 'Copied', 'copied');
      } catch {
        setButtonState(button, 'Failed', 'error');
      }
    };

    root.addEventListener('click', handleClick);

    return () => {
      root.removeEventListener('click', handleClick);
      buttonTimers.forEach((timer) => window.clearTimeout(timer));
      buttonTimers.clear();
    };
  }, [enhancedHtml]);

  return (
    <div
      ref={rootRef}
      className={`${BLOG_CONTENT_CLASSNAME} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: enhancedHtml }}
    />
  );
}
