import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { readFileAsDataUrl } from '../lib/images';

export default function ImageUploadSlot({ id, label, value, onChange, onError }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch (error) {
      onError?.(error.message || 'Upload failed.');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  }

  function clearImage() {
    onChange('');
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200 ${
          value
            ? 'border-brand-400/60 bg-brand-50/30 shadow-sm shadow-brand-500/10 dark:border-brand-500/40 dark:bg-brand-500/5'
            : 'border-slate-200 bg-slate-50/80 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-md dark:border-emerald-500/15 dark:bg-surface-overlay/50 dark:hover:border-brand-500/30'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/0 transition group-hover:bg-slate-900/40" />
            <span className="relative z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 opacity-0 transition group-hover:opacity-100">
              Change
            </span>
          </>
        ) : (
          <>
            <Camera className="h-7 w-7 text-slate-400 transition group-hover:text-brand-500 dark:text-slate-500 dark:group-hover:text-brand-400" />
            <span className="mt-2 px-2 text-center text-[11px] font-bold leading-tight text-slate-500 dark:text-slate-400">
              {loading ? 'Uploading...' : label}
            </span>
          </>
        )}
      </button>

      {value ? (
        <button
          type="button"
          onClick={clearImage}
          className="flex w-full items-center justify-center gap-1 text-[10px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
        >
          <X className="h-3 w-3" />
          Remove
        </button>
      ) : null}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}
