// Challenge categories shown on the Défis tab. `key` is the value of the `categorie`
// field in the defis collection; 'partenaires' opens the partner list instead.
export const CATEGORIES = [
  { key: 'partenaires', label: 'NOS PARTENAIRES' },
  { key: 'sport', label: 'SPORT' },
  { key: 'bouffe', label: 'BOUFFE' },
  { key: 'adrenaline', label: 'ADRENALINE' },
];

// Partner places. Each one with a `key` has its own challenge category;
// the others are shown but have no challenges yet.
export const PARTNERS = [
  { key: 'parc-test', label: 'PARC TEST' },
  { key: 'musee', label: 'MUSEE' },
  { label: 'AQUARIUM' },
  { label: 'CAMPING' },
  { label: "PARC D'ATTRACTION" },
];
