import { useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useGridColumnCount } from '../hooks/useGridColumnCount';

const ROW_HEIGHT = 420;
const ROW_GAP = 32;

export default function VirtualProductGrid({ products, renderProduct }) {
  const listRef = useRef(null);
  const columnCount = useGridColumnCount();
  const rowCount = Math.ceil(products.length / columnCount);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_HEIGHT + ROW_GAP,
    overscan: 2,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  return (
    <div ref={listRef} className="mt-8">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const rowProducts = products.slice(rowIndex * columnCount, rowIndex * columnCount + columnCount);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <div
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ minHeight: ROW_HEIGHT }}
              >
                {rowProducts.map((product) => renderProduct(product))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
