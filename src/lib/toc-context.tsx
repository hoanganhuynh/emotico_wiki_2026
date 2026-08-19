'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TOCContextValue {
  headings: Heading[];
  setHeadings: (h: Heading[]) => void;
  addHeadings: (h: Heading[]) => void;
}

const TOCContext = createContext<TOCContextValue>({ headings: [], setHeadings: () => {}, addHeadings: () => {} });

export function TOCProvider({ children }: { children: React.ReactNode }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const addHeadings = useCallback((additional: Heading[]) => {
    setHeadings((current) => {
      const merged = [...current, ...additional];
      const unique = merged.filter((heading, index) => merged.findIndex((candidate) => candidate.id === heading.id) === index);
      return unique.length === current.length ? current : unique;
    });
  }, []);
  return <TOCContext.Provider value={{ headings, setHeadings, addHeadings }}>{children}</TOCContext.Provider>;
}

export function useTOC() {
  return useContext(TOCContext);
}
