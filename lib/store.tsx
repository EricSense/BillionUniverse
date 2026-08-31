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
import { COUNTRIES } from "./catalog";
import { uid } from "./id";
import { companyInsights } from "./insights";
import {
  defaultMilestones,
  emptyDatabase,
  refreshMilestoneStatus,
  seedDatabase,
} from "./seed";
import type {
  Company,
  Database,
  Focus,
  Insight,
  Market,
  NewCompanyInput,
  Role,
  User,
} from "./types";

const STORAGE_KEY = "billion-universe.v2";

type Store = Database & {
  ready: boolean;
  user: User | null;
  company: Company | null;
  companyMarkets: Market[];
  companyInsights: Insight[];
  login: (email: string, password: string) => string | null;
  logout: () => void;
  signup: (name: string, email: string, password: string, company: NewCompanyInput) => string | null;
  updateCompany: (patch: Partial<Company>) => void;
  setPeopleReached: (value: number) => void;
  addMarket: (name: string) => string | null;
  updateMarket: (id: string, patch: Partial<Market>) => void;
  removeMarket: (id: string) => void;
  addBet: (title: string, detail: string) => void;
  setBetStatus: (id: string, status: "active" | "won" | "killed") => void;
  addFocus: (title: string) => void;
  toggleFocus: (id: string) => void;
  addRole: (title: string, location: string) => void;
  fillRole: (id: string) => void;
  addWaitlist: (email: string) => void;
  resetDemo: () => void;
};

const StoreContext = createContext<Store | null>(null);

function persist(db: Database) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function load(): Database {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDatabase();
      persist(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as Database;
    if (!parsed.companies || !parsed.users) return seedDatabase();
    return { ...emptyDatabase(), ...parsed };
  } catch {
    return seedDatabase();
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database>(seedDatabase);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // localStorage is not available during SSR; hydrate once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- persist gate
    setDb(load());
    setReady(true);
  }, []);

  const commit = useCallback((updater: (current: Database) => Database) => {
    setDb((current) => {
      const next = updater(current);
      persist(next);
      return next;
    });
  }, []);

  const user = useMemo(
    () => db.users.find((item) => item.id === db.sessionUserId) ?? null,
    [db.sessionUserId, db.users],
  );

  const company = useMemo(
    () => db.companies.find((item) => item.ownerId === user?.id) ?? null,
    [db.companies, user],
  );

  const companyMarkets = useMemo(
    () => db.markets.filter((item) => item.companyId === company?.id),
    [company, db.markets],
  );

  const insights = useMemo(() => {
    if (!company) return [];
    const bets = db.bets.filter((item) => item.companyId === company.id);
    return companyInsights(company, companyMarkets, bets);
  }, [company, companyMarkets, db.bets]);

  const login = useCallback(
    (email: string, password: string) => {
      const match = db.users.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!match || match.password !== password) return "Email or password is wrong.";
      commit((current) => ({ ...current, sessionUserId: match.id }));
      return null;
    },
    [commit, db.users],
  );

  const logout = useCallback(() => {
    commit((current) => ({ ...current, sessionUserId: null }));
  }, [commit]);

  const signup = useCallback(
    (name: string, email: string, password: string, input: NewCompanyInput) => {
      const normalized = email.trim().toLowerCase();
      if (db.users.some((item) => item.email === normalized)) {
        return "An account with that email already exists.";
      }
      if (password.length < 6) return "Password must be at least 6 characters.";
      if (!input.name.trim()) return "Company name is required.";
      const userId = uid("user");
      const companyId = uid("co");
      const slugBase = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32) || "company";
      const slug = db.companies.some((item) => item.slug === slugBase)
        ? `${slugBase}-${companyId.slice(-4)}`
        : slugBase;
      const nextCompany: Company = {
        id: companyId,
        ownerId: userId,
        slug,
        name: input.name.trim(),
        tagline: input.tagline.trim(),
        thesis: input.thesis.trim(),
        sector: input.sector,
        stage: "pre-product",
        peopleReached: 0,
        arr: 0,
        runwayMonths: 18,
        teamSize: 1,
        founded: String(new Date().getFullYear()),
        hq: input.hq.trim() || "Remote",
        public: true,
      };
      commit((current) => ({
        ...current,
        users: [...current.users, { id: userId, name: name.trim(), email: normalized, password }],
        sessionUserId: userId,
        companies: [...current.companies, nextCompany],
        milestones: [...current.milestones, ...defaultMilestones(companyId)],
      }));
      return null;
    },
    [commit, db.companies, db.users],
  );

  const updateCompany = useCallback(
    (patch: Partial<Company>) => {
      if (!company) return;
      commit((current) => ({
        ...current,
        companies: current.companies.map((item) =>
          item.id === company.id ? { ...item, ...patch } : item,
        ),
      }));
    },
    [commit, company],
  );

  const setPeopleReached = useCallback(
    (value: number) => {
      if (!company) return;
      const peopleReached = Math.max(0, Math.round(value));
      commit((current) => ({
        ...current,
        companies: current.companies.map((item) =>
          item.id === company.id ? { ...item, peopleReached } : item,
        ),
        milestones: refreshMilestoneStatus(
          peopleReached,
          current.milestones.filter((item) => item.companyId === company.id),
        ).concat(current.milestones.filter((item) => item.companyId !== company.id)),
      }));
    },
    [commit, company],
  );

  const addMarket = useCallback(
    (name: string) => {
      if (!company) return "No company.";
      const catalog = COUNTRIES.find((item) => item.name === name);
      if (!catalog) return "Unknown market.";
      if (db.markets.some((item) => item.companyId === company.id && item.name === name)) {
        return "That market is already named.";
      }
      const market: Market = {
        id: uid("mkt"),
        companyId: company.id,
        name: catalog.name,
        region: catalog.region,
        population: catalog.population,
        peopleReached: 0,
        status: "research",
        language: catalog.language,
      };
      commit((current) => ({ ...current, markets: [...current.markets, market] }));
      return null;
    },
    [commit, company, db.markets],
  );

  const updateMarket = useCallback(
    (id: string, patch: Partial<Market>) => {
      commit((current) => ({
        ...current,
        markets: current.markets.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));
    },
    [commit],
  );

  const removeMarket = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        markets: current.markets.filter((item) => item.id !== id),
      }));
    },
    [commit],
  );

  const addBet = useCallback(
    (title: string, detail: string) => {
      if (!company || !title.trim()) return;
      commit((current) => ({
        ...current,
        bets: [
          ...current.bets,
          {
            id: uid("bet"),
            companyId: company.id,
            title: title.trim(),
            detail: detail.trim(),
            status: "active",
          },
        ],
      }));
    },
    [commit, company],
  );

  const setBetStatus = useCallback(
    (id: string, status: "active" | "won" | "killed") => {
      commit((current) => ({
        ...current,
        bets: current.bets.map((item) => (item.id === id ? { ...item, status } : item)),
      }));
    },
    [commit],
  );

  const addFocus = useCallback(
    (title: string) => {
      if (!company || !title.trim()) return;
      const item: Focus = {
        id: uid("foc"),
        companyId: company.id,
        title: title.trim(),
        owner: user?.name.split(" ")[0] ?? "You",
        status: "open",
      };
      commit((current) => ({ ...current, focuses: [...current.focuses, item] }));
    },
    [commit, company, user],
  );

  const toggleFocus = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        focuses: current.focuses.map((item) =>
          item.id === id
            ? { ...item, status: item.status === "done" ? "open" : "done" }
            : item,
        ),
      }));
    },
    [commit],
  );

  const addRole = useCallback(
    (title: string, location: string) => {
      if (!company || !title.trim()) return;
      const role: Role = {
        id: uid("role"),
        companyId: company.id,
        title: title.trim(),
        location: location.trim() || company.hq,
        status: "open",
      };
      commit((current) => ({ ...current, roles: [...current.roles, role] }));
    },
    [commit, company],
  );

  const fillRole = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        roles: current.roles.map((item) =>
          item.id === id ? { ...item, status: "filled" } : item,
        ),
        companies: current.companies.map((item) =>
          item.id === company?.id ? { ...item, teamSize: item.teamSize + 1 } : item,
        ),
      }));
    },
    [commit, company],
  );

  const addWaitlist = useCallback(
    (email: string) => {
      const normalized = email.trim().toLowerCase();
      commit((current) => ({
        ...current,
        waitlist: current.waitlist.includes(normalized)
          ? current.waitlist
          : [...current.waitlist, normalized],
      }));
    },
    [commit],
  );

  const resetDemo = useCallback(() => {
    const seeded = seedDatabase();
    persist(seeded);
    setDb(seeded);
  }, []);

  const value: Store = {
    ...db,
    ready,
    user,
    company,
    companyMarkets,
    companyInsights: insights,
    login,
    logout,
    signup,
    updateCompany,
    setPeopleReached,
    addMarket,
    updateMarket,
    removeMarket,
    addBet,
    setBetStatus,
    addFocus,
    toggleFocus,
    addRole,
    fillRole,
    addWaitlist,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
