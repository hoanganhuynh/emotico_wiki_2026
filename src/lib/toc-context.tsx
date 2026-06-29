'use client';

import { createContext, useContext, useState } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TOCContextValue {
  headings: Heading[];
  setHeadings: (h: Heading[]) => void;
}

const TOCContext = createContext<TOCContextValue>({ headings: [], setHeadings: () => {} });

export function TOCProvider({ children }: { children: React.ReactNode }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  return <TOCContext.Provider value={{ headings, setHeadings }}>{children}</TOCContext.Provider>;
}

export function useTOC() {
  return useContext(TOCContext);
}
