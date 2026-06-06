# Reazione (@slango/reazione)

Collection of generic react utilities ("reazione" is Italian for reaction).

## Installation

```bash
pnpm add @slango/reazione
```

Requires `react` ^19 as a peer dependency.

## Hooks (`@slango/reazione/hooks/*`)

- `useDebouncedCallback` — debounced wrapper around a callback with `run`/`cancel` and unmount cleanup.
- `useMounted` — `false` during SSR/hydration, `true` after mount.
- `useClickOutside` — invoke a handler when clicking outside an element.
- `useClientValue` — resolve a client-only value after hydration without mismatches.
- `usePreventScrolling` — lock background scroll, compensating for the scrollbar width.
- `useScrollEdge` — debounced notification when scrolling approaches an edge.

## Usage

```tsx
import { useDebouncedCallback } from '@slango/reazione/hooks/useDebouncedCallback';

const Search = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const debounced = useDebouncedCallback(onSearch, 300);

  return <input onChange={(e) => debounced.run(e.target.value)} />;
};
```

```tsx
import { Edge, useScrollEdge } from '@slango/reazione/hooks/useScrollEdge';

useScrollEdge({ edge: Edge.BOTTOM, onEdgeReached: loadNextPage });
```

## Testing

Run linting and unit tests:

```bash
pnpm lint
pnpm test
```

## Contributing

Issues and pull requests are welcome.
