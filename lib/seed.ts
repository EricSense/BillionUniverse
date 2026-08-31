import type { Database } from "./types";

export const DEMO_EMAIL = "founder@billionuniverse.com";
export const DEMO_PASSWORD = "scale1B";

export function emptyDatabase(): Database {
  return {
    users: [],
    sessionUserId: null,
    companies: [],
    markets: [],
    milestones: [],
    bets: [],
    rounds: [],
    roles: [],
    focuses: [],
    waitlist: [],
  };
}

export function seedDatabase(): Database {
  return {
    users: [
      {
        id: "user_adaeze",
        name: "Adaeze Okonkwo",
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
      {
        id: "user_lin",
        name: "Lin Zhao",
        email: "lin@amina.health",
        password: "demo",
      },
      {
        id: "user_rafa",
        name: "Rafael Mendes",
        email: "rafa@fieldwork.ag",
        password: "demo",
      },
    ],
    sessionUserId: null,
    companies: [
      {
        id: "co_relay",
        ownerId: "user_adaeze",
        slug: "relay",
        name: "Relay",
        tagline: "Payroll and remittances for the workers who keep cities running.",
        thesis:
          "Two hundred million people work away from home. Their families still wait days for money that should arrive in seconds. Relay is rails for wages — starting with West Africa and the Gulf, then every corridor that still taxes the poor to send $200 home.",
        sector: "finance",
        stage: "growth",
        peopleReached: 2_140_000,
        arr: 4_800_000,
        runwayMonths: 14,
        teamSize: 41,
        founded: "2023",
        hq: "Lagos",
        public: true,
      },
      {
        id: "co_amina",
        ownerId: "user_lin",
        slug: "amina",
        name: "Amina",
        tagline: "A health record that follows the patient, not the clinic.",
        thesis:
          "Most of the world meets a doctor who has never seen their history. Amina is a portable record and triage layer for public systems — India first, then every ministry that still runs care on paper.",
        sector: "health",
        stage: "early",
        peopleReached: 380_000,
        arr: 620_000,
        runwayMonths: 9,
        teamSize: 18,
        founded: "2024",
        hq: "Bengaluru",
        public: true,
      },
      {
        id: "co_fieldwork",
        ownerId: "user_rafa",
        slug: "fieldwork",
        name: "Fieldwork",
        tagline: "Operating software for the five hundred million small farms.",
        thesis:
          "The people who grow the world's food still plan seasons in notebooks. Fieldwork gives smallholders weather, credit, and buyers in one place — Portuguese and Spanish first, then the rest of the tropical belt.",
        sector: "climate",
        stage: "early",
        peopleReached: 94_000,
        arr: 210_000,
        runwayMonths: 11,
        teamSize: 12,
        founded: "2024",
        hq: "São Paulo",
        public: true,
      },
    ],
    markets: [
      { id: "m1", companyId: "co_relay", name: "Nigeria", region: "West Africa", population: 227_000_000, peopleReached: 1_120_000, status: "live", language: "English, Hausa" },
      { id: "m2", companyId: "co_relay", name: "Ghana", region: "West Africa", population: 34_000_000, peopleReached: 410_000, status: "live", language: "English" },
      { id: "m3", companyId: "co_relay", name: "Kenya", region: "East Africa", population: 55_000_000, peopleReached: 280_000, status: "entering", language: "Swahili, English" },
      { id: "m4", companyId: "co_relay", name: "Saudi Arabia", region: "Middle East", population: 36_000_000, peopleReached: 210_000, status: "entering", language: "Arabic" },
      { id: "m5", companyId: "co_relay", name: "United Kingdom", region: "Europe", population: 67_000_000, peopleReached: 120_000, status: "research", language: "English" },
      { id: "m6", companyId: "co_amina", name: "India", region: "South Asia", population: 1_428_000_000, peopleReached: 310_000, status: "live", language: "Hindi, English" },
      { id: "m7", companyId: "co_amina", name: "Indonesia", region: "Southeast Asia", population: 277_000_000, peopleReached: 48_000, status: "research", language: "Indonesian" },
      { id: "m8", companyId: "co_amina", name: "Bangladesh", region: "South Asia", population: 173_000_000, peopleReached: 22_000, status: "entering", language: "Bengali" },
      { id: "m9", companyId: "co_fieldwork", name: "Brazil", region: "Latin America", population: 216_000_000, peopleReached: 71_000, status: "live", language: "Portuguese" },
      { id: "m10", companyId: "co_fieldwork", name: "Colombia", region: "Latin America", population: 52_000_000, peopleReached: 14_000, status: "entering", language: "Spanish" },
      { id: "m11", companyId: "co_fieldwork", name: "Peru", region: "Latin America", population: 34_000_000, peopleReached: 9_000, status: "research", language: "Spanish" },
    ],
    milestones: [
      { id: "ms1", companyId: "co_relay", people: 1_000, title: "First paid corridor", status: "done" },
      { id: "ms2", companyId: "co_relay", people: 10_000, title: "Lagos payroll live", status: "done" },
      { id: "ms3", companyId: "co_relay", people: 100_000, title: "Three countries", status: "done" },
      { id: "ms4", companyId: "co_relay", people: 1_000_000, title: "A million families", status: "done" },
      { id: "ms5", companyId: "co_relay", people: 10_000_000, title: "Default wage rail in West Africa", status: "current" },
      { id: "ms6", companyId: "co_relay", people: 100_000_000, title: "Gulf + Africa corridors", status: "ahead" },
      { id: "ms7", companyId: "co_relay", people: 1_000_000_000, title: "Every major remittance lane", status: "ahead" },
      { id: "ms8", companyId: "co_amina", people: 1_000, title: "First clinic network", status: "done" },
      { id: "ms9", companyId: "co_amina", people: 10_000, title: "State pilot", status: "done" },
      { id: "ms10", companyId: "co_amina", people: 100_000, title: "One ministry", status: "done" },
      { id: "ms11", companyId: "co_amina", people: 1_000_000, title: "National coverage in one state", status: "current" },
      { id: "ms12", companyId: "co_amina", people: 10_000_000, title: "Three Indian states", status: "ahead" },
      { id: "ms13", companyId: "co_amina", people: 100_000_000, title: "Public system default", status: "ahead" },
      { id: "ms14", companyId: "co_amina", people: 1_000_000_000, title: "A record for a billion patients", status: "ahead" },
      { id: "ms15", companyId: "co_fieldwork", people: 1_000, title: "First harvest cycle", status: "done" },
      { id: "ms16", companyId: "co_fieldwork", people: 10_000, title: "Credit + weather live", status: "done" },
      { id: "ms17", companyId: "co_fieldwork", people: 100_000, title: "One crop belt", status: "current" },
      { id: "ms18", companyId: "co_fieldwork", people: 1_000_000, title: "Brazil + Andes", status: "ahead" },
      { id: "ms19", companyId: "co_fieldwork", people: 10_000_000, title: "Tropical belt", status: "ahead" },
      { id: "ms20", companyId: "co_fieldwork", people: 100_000_000, title: "Smallholder default OS", status: "ahead" },
      { id: "ms21", companyId: "co_fieldwork", people: 1_000_000_000, title: "Half the world's farms", status: "ahead" },
    ],
    bets: [
      { id: "b1", companyId: "co_relay", title: "Wages, not consumer remittance apps", detail: "Win the employer. The worker follows the paycheck.", status: "active" },
      { id: "b2", companyId: "co_relay", title: "Gulf landing as a corridor, not a country", detail: "Saudi and UAE are destinations. Nigeria and Ghana are homes. Price the lane.", status: "active" },
      { id: "b3", companyId: "co_relay", title: "Licenses before ads", detail: "If we cannot move money legally at volume, growth is a liability.", status: "won" },
      { id: "b4", companyId: "co_amina", title: "Governments as the customer", detail: "Clinics churn. Ministries persist. Sell the system.", status: "active" },
      { id: "b5", companyId: "co_amina", title: "Offline-first records", detail: "If it dies without signal, it is not built for a billion people.", status: "active" },
      { id: "b6", companyId: "co_fieldwork", title: "Sell to cooperatives, not to every farm", detail: "Distribution has to compound. One co-op is a thousand farms.", status: "active" },
    ],
    rounds: [
      { id: "r1", companyId: "co_relay", name: "Pre-seed", amount: 800_000, date: "2023-04" },
      { id: "r2", companyId: "co_relay", name: "Seed", amount: 4_200_000, date: "2024-02" },
      { id: "r3", companyId: "co_relay", name: "Series A", amount: 18_000_000, date: "2025-09" },
      { id: "r4", companyId: "co_amina", name: "Seed", amount: 3_100_000, date: "2024-11" },
      { id: "r5", companyId: "co_fieldwork", name: "Pre-seed", amount: 1_400_000, date: "2024-06" },
    ],
    roles: [
      { id: "ro1", companyId: "co_relay", title: "Country manager, Kenya", location: "Nairobi", status: "open" },
      { id: "ro2", companyId: "co_relay", title: "Licensing lead, GCC", location: "Riyadh", status: "open" },
      { id: "ro3", companyId: "co_relay", title: "Head of payroll", location: "Lagos", status: "filled" },
      { id: "ro4", companyId: "co_amina", title: "Clinical operations", location: "Lucknow", status: "open" },
      { id: "ro5", companyId: "co_fieldwork", title: "Agronomy lead", location: "Ribeirão Preto", status: "open" },
    ],
    focuses: [
      { id: "f1", companyId: "co_relay", title: "Close CBN wallet expansion", owner: "Adaeze", status: "open" },
      { id: "f2", companyId: "co_relay", title: "Kenya employer pilot, 12 firms", owner: "Ibrahim", status: "open" },
      { id: "f3", companyId: "co_relay", title: "Cut corridor p95 from 6h to 20m", owner: "Ngozi", status: "done" },
      { id: "f4", companyId: "co_amina", title: "UP ministry renewal", owner: "Lin", status: "open" },
      { id: "f5", companyId: "co_fieldwork", title: "Coffee co-op, Minas Gerais", owner: "Rafael", status: "open" },
    ],
    waitlist: [],
  };
}

export function defaultMilestones(companyId: string): Database["milestones"] {
  return [
    { id: `${companyId}_ms_1k`, companyId, people: 1_000, title: "First thousand people", status: "current" },
    { id: `${companyId}_ms_10k`, companyId, people: 10_000, title: "A market that repeats", status: "ahead" },
    { id: `${companyId}_ms_100k`, companyId, people: 100_000, title: "Proof in one country", status: "ahead" },
    { id: `${companyId}_ms_1m`, companyId, people: 1_000_000, title: "A million people", status: "ahead" },
    { id: `${companyId}_ms_10m`, companyId, people: 10_000_000, title: "Default in a region", status: "ahead" },
    { id: `${companyId}_ms_100m`, companyId, people: 100_000_000, title: "A hundred million", status: "ahead" },
    { id: `${companyId}_ms_1b`, companyId, people: 1_000_000_000, title: "A billion people", status: "ahead" },
  ];
}

export function refreshMilestoneStatus(
  peopleReached: number,
  milestones: Database["milestones"],
): Database["milestones"] {
  const ordered = [...milestones].sort((a, b) => a.people - b.people);
  let currentSet = false;
  return ordered.map((item) => {
    if (peopleReached >= item.people) return { ...item, status: "done" as const };
    if (!currentSet) {
      currentSet = true;
      return { ...item, status: "current" as const };
    }
    return { ...item, status: "ahead" as const };
  });
}
