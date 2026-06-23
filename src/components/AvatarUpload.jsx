import { useRef, useState } from 'react';
import { uploadAvatarFile, avatarViewUrl } from '../lib/api';

export default function AvatarUpload({ initialPathname = '', onUploaded }) {
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(
    initialPathname ? { pathname: initialPathname } : null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const previewPathname = blob?.pathname || initialPathname;
  const previewUrl = previewPathname ? avatarViewUrl(previewPathname) : null;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!inputFileRef.current?.files?.[0]) {
      setError('Please choose an image first.');
      return;
    }

    const file = inputFileRef.current.files[0];

    setBusy(true);
    try {
      const uploaded = await uploadAvatarFile(file);
      setBlob(uploaded);
      onUploaded?.(uploaded);
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="surface-card space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile photo</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload a private avatar stored in Vercel Blob and linked in your database record.
        </p>
      </div>

      {previewUrl ? (
        <div className="flex items-center gap-4">
          <img
            src={previewUrl}
            alt="Your avatar"
            className="h-20 w-20 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
          />
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            View file
          </a>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputFileRef}
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100 dark:text-slate-300 dark:file:bg-brand-500/15 dark:file:text-brand-300"
        />
        <button type="submit" className="button-primary" disabled={busy}>
          {busy ? 'Uploading…' : 'Upload avatar'}
        </button>
      </form>

      {error ? <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p> : null}
      {blob?.pathname ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Stored at <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-surface-overlay">{blob.pathname}</code>
        </p>
      ) : null}
    </div>
  );
}
