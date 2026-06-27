export type SortDirection = 'asc' | 'desc';

export function SortableHeader({ label, sortKey, currentSortKey, direction, onSort, align = 'left' }: { label: string; sortKey: string; currentSortKey?: string; direction?: SortDirection; onSort: (key: string) => void; align?: 'left' | 'right' }) {
  const active = currentSortKey === sortKey;
  return <button type="button" onClick={() => onSort(sortKey)} aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'} className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-indigo-600 ${align === 'right' ? 'justify-end' : ''}`}>{label}{active && <span aria-hidden="true">{direction === 'asc' ? '↑' : '↓'}</span>}</button>;
}
