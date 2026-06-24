import { useEffect, useState } from 'react';

const BREAKPOINTS = [
  { query: '(min-width: 1280px)', columns: 4 },
  { query: '(min-width: 1024px)', columns: 3 },
  { query: '(min-width: 640px)', columns: 2 },
];

export function useGridColumnCount(defaultColumns = 1) {
  const [columns, setColumns] = useState(defaultColumns);

  useEffect(() => {
    const mediaQueries = BREAKPOINTS.map(({ query, columns: cols }) => ({
      mql: window.matchMedia(query),
      columns: cols,
    }));

    function update() {
      for (const { mql, columns: cols } of mediaQueries) {
        if (mql.matches) {
          setColumns(cols);
          return;
        }
      }
      setColumns(defaultColumns);
    }

    update();
    mediaQueries.forEach(({ mql }) => mql.addEventListener('change', update));
    return () => mediaQueries.forEach(({ mql }) => mql.removeEventListener('change', update));
  }, [defaultColumns]);

  return columns;
}
