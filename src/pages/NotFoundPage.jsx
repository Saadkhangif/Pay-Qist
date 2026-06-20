import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-4xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="surface-card p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-4xl font-black text-brand-500 dark:bg-brand-500/15">
          404
        </div>
        <h1 className="page-title text-4xl">Page not found</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400">The page you requested does not exist.</p>
        <Link className="button-primary mt-8" to="/home">
          Back home
        </Link>
      </div>
    </div>
  );
}
