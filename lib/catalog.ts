import type { CompanyStage, Sector } from "./types";

export const SECTORS: { id: Sector; label: string; note: string }[] = [
  { id: "finance", label: "Finance", note: "Money, credit, payments, savings" },
  { id: "health", label: "Health", note: "Care, records, insurance, diagnostics" },
  { id: "climate", label: "Climate", note: "Energy, food, adaptation, carbon" },
  { id: "education", label: "Education", note: "Learning, credentials, skills" },
  { id: "commerce", label: "Commerce", note: "Trade, logistics, retail" },
  { id: "work", label: "Work", note: "Jobs, labor, professional tools" },
  { id: "identity", label: "Identity", note: "Trust, credentials, access" },
  { id: "other", label: "Other", note: "Anything built for a billion people" },
];

export const STAGES: { id: CompanyStage; label: string }[] = [
  { id: "pre-product", label: "Pre-product" },
  { id: "early", label: "Early" },
  { id: "growth", label: "Growth" },
  { id: "scale", label: "Scale" },
];

export const COUNTRIES: {
  name: string;
  region: string;
  population: number;
  language: string;
}[] = [
  { name: "India", region: "South Asia", population: 1_428_000_000, language: "Hindi, English" },
  { name: "China", region: "East Asia", population: 1_412_000_000, language: "Mandarin" },
  { name: "United States", region: "North America", population: 333_000_000, language: "English" },
  { name: "Indonesia", region: "Southeast Asia", population: 277_000_000, language: "Indonesian" },
  { name: "Pakistan", region: "South Asia", population: 240_000_000, language: "Urdu" },
  { name: "Nigeria", region: "West Africa", population: 227_000_000, language: "English, Hausa" },
  { name: "Brazil", region: "Latin America", population: 216_000_000, language: "Portuguese" },
  { name: "Bangladesh", region: "South Asia", population: 173_000_000, language: "Bengali" },
  { name: "Russia", region: "Eurasia", population: 144_000_000, language: "Russian" },
  { name: "Ethiopia", region: "East Africa", population: 126_000_000, language: "Amharic" },
  { name: "Mexico", region: "Latin America", population: 128_000_000, language: "Spanish" },
  { name: "Japan", region: "East Asia", population: 123_000_000, language: "Japanese" },
  { name: "Philippines", region: "Southeast Asia", population: 117_000_000, language: "Filipino, English" },
  { name: "Egypt", region: "North Africa", population: 112_000_000, language: "Arabic" },
  { name: "Vietnam", region: "Southeast Asia", population: 98_000_000, language: "Vietnamese" },
  { name: "DR Congo", region: "Central Africa", population: 102_000_000, language: "French" },
  { name: "Turkey", region: "Eurasia", population: 85_000_000, language: "Turkish" },
  { name: "Germany", region: "Europe", population: 84_000_000, language: "German" },
  { name: "Thailand", region: "Southeast Asia", population: 72_000_000, language: "Thai" },
  { name: "Tanzania", region: "East Africa", population: 67_000_000, language: "Swahili" },
  { name: "United Kingdom", region: "Europe", population: 67_000_000, language: "English" },
  { name: "France", region: "Europe", population: 65_000_000, language: "French" },
  { name: "South Africa", region: "Southern Africa", population: 60_000_000, language: "English, Zulu" },
  { name: "Kenya", region: "East Africa", population: 55_000_000, language: "Swahili, English" },
  { name: "Myanmar", region: "Southeast Asia", population: 54_000_000, language: "Burmese" },
  { name: "Colombia", region: "Latin America", population: 52_000_000, language: "Spanish" },
  { name: "South Korea", region: "East Asia", population: 52_000_000, language: "Korean" },
  { name: "Uganda", region: "East Africa", population: 48_000_000, language: "English" },
  { name: "Argentina", region: "Latin America", population: 46_000_000, language: "Spanish" },
  { name: "Algeria", region: "North Africa", population: 45_000_000, language: "Arabic" },
  { name: "Sudan", region: "North Africa", population: 48_000_000, language: "Arabic" },
  { name: "Ukraine", region: "Europe", population: 38_000_000, language: "Ukrainian" },
  { name: "Morocco", region: "North Africa", population: 37_000_000, language: "Arabic" },
  { name: "Saudi Arabia", region: "Middle East", population: 36_000_000, language: "Arabic" },
  { name: "Angola", region: "Southern Africa", population: 36_000_000, language: "Portuguese" },
  { name: "Ghana", region: "West Africa", population: 34_000_000, language: "English" },
  { name: "Mozambique", region: "Southern Africa", population: 33_000_000, language: "Portuguese" },
  { name: "Peru", region: "Latin America", population: 34_000_000, language: "Spanish" },
  { name: "Malaysia", region: "Southeast Asia", population: 34_000_000, language: "Malay" },
  { name: "Nepal", region: "South Asia", population: 30_000_000, language: "Nepali" },
];

export const SCALE_STEPS = [
  1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000,
] as const;
