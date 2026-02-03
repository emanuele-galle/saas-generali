export const GENERALI_BRAND = {
  colors: {
    red: "#C21D17",
    darkRed: "#9B1610",
    white: "#FFFFFF",
    lightGray: "#F5F5F5",
    dark: "#1A1A1A",
    text: "#333333",
  },
  fonts: {
    primary: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
} as const;

export const CONSULTANT_ROLES = [
  "Executive Manager",
  "Financial Advisor",
  "Senior Private Banker",
  "Private Banker",
  "Wealth Manager",
  "Relationship Manager",
  "Area Manager",
  "District Manager",
  "Consulente Finanziario",
  "Consulente Assicurativo",
  "Agente Generale",
  "Sub-Agente",
] as const;

export const CONSULTANT_NETWORKS = [
  "Rete Private e Wealth",
  "Rete Financial Planner",
  "Rete Agenti",
  "Rete Corporate",
] as const;

export const CONSULTANT_TITLES = [
  "Dott.",
  "Dott.ssa",
  "Ing.",
  "Avv.",
  "Prof.",
  "Prof.ssa",
  "Rag.",
] as const;

export const LANDING_SECTIONS = [
  { id: "cover", label: "La Cover", number: 1 },
  { id: "profile", label: "Il Profilo", number: 2 },
  { id: "map", label: "La Mappa", number: 3 },
  { id: "summary", label: "Il Summary", number: 4 },
  { id: "skills", label: "Le Skill Professionali", number: 5 },
  { id: "experiences", label: "Le Esperienze Professionali", number: 6 },
  { id: "education", label: "La Formazione", number: 7 },
  { id: "interests", label: "Gli Interessi", number: 8 },
  { id: "banner", label: "Il Banner", number: 9 },
  { id: "focusOn", label: "Il Focus On", number: 10 },
  { id: "testimonials", label: "Le Testimonianze", number: 11 },
  { id: "video", label: "Il Video", number: 12 },
  { id: "portfolio", label: "Il Portfolio", number: 13 },
  { id: "quote", label: "La Citazione", number: 14 },
] as const;
