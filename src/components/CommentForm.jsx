import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function CommentForm() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/comments')
      .then((payload) => setComments(Array.isArray(payload.comments) ? payload.comments : []))
      .catch(() => setComments([]));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const payload = await apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ comment }),
      });

      setComments((current) => [payload.comment, ...current]);
      setComment('');
      setStatus('idle');
    } catch (err) {
      setStatus('idle');
      setError(err.message || 'Unable to save comment.');
    }
  }

  return (
    <div className="space-y-4 border-t border-slate-200 pt-8 dark:border-slate-700">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Community comments</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Saved directly to Neon Postgres via the API.
        </p>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <input
          type="text"
          name="comment"
          placeholder="Write a comment"
          className="input flex-1"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
          maxLength={500}
        />
        <button type="submit" className="button-primary shrink-0" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Submit'}
        </button>
      </form>

      {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}

      {comments.length > 0 ? (
        <ul className="space-y-2">
          {comments.map((entry, index) => (
            <li
              key={`${entry}-${index}`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-surface-overlay/60 dark:text-slate-200"
            >
              {entry}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
