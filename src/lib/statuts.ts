// Couleur par statut de preuve — source unique, partagée par badge / claim / frise / carte.
export const STATUT_COLOR: Record<string, string> = {
  'mesuré': '#2f7d4f',
  'attesté': '#2a9d8f',
  'reconstruit': '#2f6fb0',
  'daté-débattu': '#b07d1a',
  'récit': '#7a5ba6',
  'conjectural': '#8a8276',
};

export const ROUTE_COLOR: Record<string, string> = {
  'austronesien': '#2f6fb0',
  'bantou': '#b0552f',
  'arabo-swahili': '#7a5ba6',
  'europeen': '#6b6256',
};

export const ROUTE_LABEL: Record<string, string> = {
  'austronesien': 'austronésien',
  'bantou': 'bantou',
  'arabo-swahili': 'arabo-swahili',
  'europeen': 'européen',
};

// Sous-titre de chaque discipline : la démarche, en une ligne.
export const DISCIPLINE_DESC: Record<string, string> = {
  'histoire': 'ce que les textes et les traditions rapportent',
  'archéologie': 'ce que le sol et les vestiges datent',
  'génétique': 'ce que les génomes mesurent',
  'linguistique': 'ce que la langue reconstruit',
  'autre': 'paléoécologie, modélisations',
};

/** Affiche une année signée : -500 → "500 av. n.è.", 1200 → "1200". */
export function annee(y: number): string {
  return y < 0 ? `${-y} av. n.è.` : `${y}`;
}
