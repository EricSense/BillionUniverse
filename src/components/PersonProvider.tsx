"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyPersonToDocument,
  parsePerson,
  readStoredPerson,
  writeStoredPerson,
  type Person,
} from "@/lib/person";

type PersonContextValue = {
  person: Person | null;
  ready: boolean;
  inhabit: (person: Person, persist?: boolean) => void;
  clear: () => void;
  previewing: boolean;
};

const PersonContext = createContext<PersonContextValue | null>(null);

export function PersonProvider({ children }: { children: ReactNode }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [stored, setStored] = useState<Person | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = readStoredPerson();
    setStored(found);
    setPerson(found);
    applyPersonToDocument(found);
    setReady(true);
  }, []);

  const inhabit = useCallback((next: Person, persist = true) => {
    const parsed = parsePerson(next);
    if (!parsed) return;
    setPerson(parsed);
    applyPersonToDocument(parsed);
    if (persist) {
      writeStoredPerson(parsed);
      setStored(parsed);
    }
  }, []);

  const clear = useCallback(() => {
    setPerson(null);
    setStored(null);
    writeStoredPerson(null);
    applyPersonToDocument(null);
  }, []);

  const value = useMemo(
    () => ({
      person,
      ready,
      inhabit,
      clear,
      previewing: Boolean(person && stored && person.name !== stored.name),
    }),
    [person, ready, inhabit, clear, stored],
  );

  return <PersonContext.Provider value={value}>{children}</PersonContext.Provider>;
}

export function usePerson() {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error("usePerson must be used within PersonProvider");
  }
  return context;
}
