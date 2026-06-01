import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-4xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="glass rounded-[32px] p-10">
        <h1 className="text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you requested does not exist.</p>
        <Link className="button-primary mt-8" to="/">
          Back home
        </Link>
      </div>
    </div>
  );
}