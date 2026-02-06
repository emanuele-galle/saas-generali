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
  { id: "values", label: "I Valori", number: 3 },
  { id: "map", label: "La Mappa", number: 4 },
  { id: "summary", label: "Il Summary", number: 5 },
  { id: "skills", label: "I Servizi", number: 6 },
  { id: "process", label: "Il Processo", number: 7 },
  { id: "method", label: "Il Metodo", number: 8 },
  { id: "strengths", label: "I Punti di Forza", number: 9 },
  { id: "experiences", label: "Le Esperienze", number: 10 },
  { id: "education", label: "La Formazione", number: 11 },
  { id: "interests", label: "Gli Interessi", number: 12 },
  { id: "banner", label: "Il Banner", number: 13 },
  { id: "focusOn", label: "Il Focus On", number: 14 },
  { id: "testimonials", label: "Le Testimonianze", number: 15 },
  { id: "video", label: "Il Video", number: 16 },
  { id: "portfolio", label: "Il Portfolio", number: 17 },
  { id: "faq", label: "Le FAQ", number: 18 },
  { id: "quote", label: "La Citazione", number: 19 },
] as const;
