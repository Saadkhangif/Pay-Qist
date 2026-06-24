import { useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

export default function VirtualList({ items, estimateSize = 220, overscan = 3, className = '', renderItem, getItemKey }) {
  const listRef = useRef(null);

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => estimateSize,
    overscan,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  if (!items.length) {
    return null;
  }

  return (
    <div ref={listRef} className={className}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];

          return (
            <div
              key={getItemKey ? getItemKey(item, virtualItem.index) : virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
