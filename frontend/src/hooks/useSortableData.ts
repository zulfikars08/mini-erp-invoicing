import { useMemo, useState } from 'react';
import { SortDirection } from '@/components/SortableHeader';

type SortConfig<T> = { key: string; direction: SortDirection; getValue: (item: T, key: string) => string | number | Date | undefined | null };

export function useSortableData<T>(items: T[], getValue: SortConfig<T>['getValue']) {
  const [sortKey, setSortKey] = useState<string>();
  const [direction, setDirection] = useState<SortDirection>('asc');
  const requestSort = (key: string) => {
    if (sortKey === key) setDirection(direction === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setDirection('asc'); }
  };
  const sortedItems = useMemo(() => {
    if (!sortKey) return items;
    return [...items].sort((a, b) => {
      const av = normalize(getValue(a, sortKey));
      const bv = normalize(getValue(b, sortKey));
      if (av < bv) return direction === 'asc' ? -1 : 1;
      if (av > bv) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortKey, direction, getValue]);
  return { sortedItems, sortKey, direction, requestSort };
}

function normalize(value: string | number | Date | undefined | null) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return String(value ?? '').toLowerCase();
}
