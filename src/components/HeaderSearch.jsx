import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useStoreQueries';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export default function HeaderSearch() {
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 200);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const { items: displayedProducts, mode: searchMode } = useMemo(() => {
    const withUrl = products.map((product) => ({ ...product, url: `/product/${product.id}` }));
    const featuredFirst = [
      ...withUrl.filter((product) => product.featured),
      ...withUrl.filter((product) => !product.featured),
    ];

    const query = debouncedQuery.trim().toLowerCase();
    if (!query) {
      return { items: featuredFirst.slice(0, 6), mode: 'suggested' };
    }

    const matches = withUrl.filter(
      (product) =>
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query),
    );

    if (matches.length > 0) {
      return { items: matches.slice(0, 6), mode: 'results' };
    }

    return { items: featuredFirst.slice(0, 6), mode: 'browse' };
  }, [debouncedQuery, products]);

  const searchDropdownTitle =
    searchMode === 'suggested'
      ? 'Popular products'
      : searchMode === 'browse'
        ? 'No exact match — browse these products'
        : 'Search results';

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative flex items-center">
      <button
        type="button"
        className="rounded-full p-2 text-slate-500 transition hover:bg-brand-500/10 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        onClick={() => {
          setIsSearchExpanded(!isSearchExpanded);
          if (isSearchExpanded) setSearchQuery('');
        }}
        aria-label="Search products"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchExpanded ? 'w-full max-w-[9rem] opacity-100 xs:max-w-[11rem] sm:max-w-[14rem] lg:max-w-[16rem]' : 'w-0 opacity-0'
        }`}
      >
        <input
          ref={searchInputRef}
          type="search"
          className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isSearchExpanded ? (
        <div className="absolute top-full left-0 z-50 mt-4 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-emerald-500/15 dark:bg-surface-raised dark:shadow-dark-card sm:w-[320px]">
          <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
            {searchDropdownTitle}
          </div>
          {displayedProducts.length > 0 ? (
            <div className="flex max-h-[300px] flex-col overflow-y-auto overscroll-contain scroll-touch p-2">
              {displayedProducts.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  className="flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-surface-overlay/80"
                  onClick={() => {
                    navigate(result.url);
                    setIsSearchExpanded(false);
                    setSearchQuery('');
                  }}
                >
                  {result.imageUrl ? (
                    <div className="product-image-well-sm h-10 w-10 shrink-0">
                      <img src={result.imageUrl} alt={result.title} className="product-image h-full w-full" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-brand-500 dark:border-slate-700 dark:bg-slate-800">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{result.title}</div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">{result.category || 'Electronics'}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">Products are loading...</div>
          )}
          <div className="border-t border-slate-100 p-2 dark:border-slate-800">
            <button
              type="button"
              className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 dark:hover:bg-brand-500/10"
              onClick={() => {
                navigate('/products');
                setIsSearchExpanded(false);
                setSearchQuery('');
              }}
            >
              View all products →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
