
import React from 'react';
import { Button } from './ui/Button';
import { X, User, Linkedin } from './Icons';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorModal = ({ isOpen, onClose }: CreatorModalProps) => {
  if (!isOpen) return null;

  // This base64 string represents the photo of the creator.
  const creatorImageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEgARIDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAECBAMFBgf/xAA5EAACAQMDAgMFBAcHBQAAAAABAgMABBEFEiExE0FRYQZxgZEiIzKhsRRSYnLB0eEjM0OCkvDx/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIxEBAQACAgICAgIDAAAAAAAAAAECEQMhEjFBUQQiE2FxFP/aAAwDAQACEQMRAD8A+mYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmY-mYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmY-e/s/-YmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYm-e//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEgARIDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAECBAMFBgf/xAA5EAACAQMDAgMFBAcHBQAAAAABAgMABBEFEiExE0FRYQZxgZEiIzKhsRRSYnLB0eEjM0OCkvDx/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIxEBAQACAgICAgIDAAAAAAAAAAECEQMhEjFBUQQiE2FxFP/aAAwDAQACEQMRAD8A+mYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmYmY-j";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"><User className="h-6 w-6 text-purple-500 dark:text-purple-400" /></div>
            <h2 className="text-xl font-bold text-black dark:text-white">About the Creator</h2>
          </div>
          <Button onClick={onClose} className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full p-2 h-auto"><X className="h-5 w-5" /></Button>
        </header>

        <main className="flex-1 p-8 text-center">
            <div
              className="w-32 h-32 rounded-full bg-zinc-100 dark:bg-zinc-900 bg-cover bg-center mx-auto mb-6 border-4 border-zinc-200 dark:border-zinc-800 shadow-lg"
              style={{ backgroundImage: `url(${creatorImageBase64})` }}
              role="img"
              aria-label="Fadahunsi Miracle"
            >
            </div>
            <h3 className="text-3xl font-bold text-black dark:text-white mb-2">Fadahunsi Miracle</h3>
            <p className="text-lg text-purple-600 dark:text-purple-300 mb-6">Data Scientist</p>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                A passionate data scientist dedicated to uncovering insights from complex datasets and building intelligent, data-driven solutions that empower users to make informed decisions.
            </p>
            <div className="mt-8">
                <a href="https://www.linkedin.com/in/miracle-fadahunsi-897149295/" target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#004182] transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <Linkedin className="h-5 w-5" />
                    View LinkedIn Profile
                </a>
            </div>
        </main>
      </div>
    </div>
  );
};
