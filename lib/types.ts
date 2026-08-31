export type Sector =
  | "finance"
  | "health"
  | "climate"
  | "education"
  | "commerce"
  | "work"
  | "identity"
  | "other";

export type CompanyStage = "pre-product" | "early" | "growth" | "scale";

export type MarketStatus = "research" | "entering" | "live" | "scaled";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Company = {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  tagline: string;
  thesis: string;
  sector: Sector;
  stage: CompanyStage;
  peopleReached: number;
  arr: number;
  runwayMonths: number;
  teamSize: number;
  founded: string;
  hq: string;
  public: boolean;
};

export type Market = {
  id: string;
  companyId: string;
  name: string;
  region: string;
  population: number;
  peopleReached: number;
  status: MarketStatus;
  language: string;
};

export type Milestone = {
  id: string;
  companyId: string;
  people: number;
  title: string;
  status: "done" | "current" | "ahead";
};

export type Bet = {
  id: string;
  companyId: string;
  title: string;
  detail: string;
  status: "active" | "won" | "killed";
};

export type Round = {
  id: string;
  companyId: string;
  name: string;
  amount: number;
  date: string;
};

export type Role = {
  id: string;
  companyId: string;
  title: string;
  location: string;
  status: "open" | "filled";
};

export type Focus = {
  id: string;
  companyId: string;
  title: string;
  owner: string;
  status: "open" | "done";
};

export type Insight = {
  id: string;
  companyId: string;
  kind: "risk" | "gap" | "momentum";
  text: string;
};

export type Database = {
  users: User[];
  sessionUserId: string | null;
  companies: Company[];
  markets: Market[];
  milestones: Milestone[];
  bets: Bet[];
  rounds: Round[];
  roles: Role[];
  focuses: Focus[];
  waitlist: string[];
};

export type NewCompanyInput = {
  name: string;
  tagline: string;
  thesis: string;
  sector: Sector;
  hq: string;
};
