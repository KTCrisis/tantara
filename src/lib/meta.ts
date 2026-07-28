/**
 * Composition des meta descriptions.
 *
 * Chaque page doit porter la sienne : une description partagée par tout le site
 * pousse Google à traiter les pages comme des doublons et à choisir lui-même
 * une canonique (cf. Search Console, juillet 2026).
 *
 * Google tronque autour de 160 caractères. On coupe sur une frontière de mot
 * plutôt qu'au milieu, et on évite le tiret cadratin, banni de la prose rendue.
 */
export const META_MAX = 160;

/** Réduit un texte à `max` caractères, sur une frontière de mot. */
export function clampMeta(text: string, max = META_MAX): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const stop = cut.lastIndexOf(' ');
  // On ne recule jamais au-delà du dernier tiers : mieux vaut couper net
  // qu'amputer la description de moitié pour respecter un espace.
  const kept = stop > max * 0.6 ? cut.slice(0, stop) : cut;
  return kept.replace(/[\s,;:.·]+$/, '') + '…';
}

/**
 * Assemble un contexte et un résumé en une description.
 * Les fragments vides sont écartés, ce qui évite les « , . » orphelins quand
 * une entité n'a pas de région ou de bornes.
 */
export function metaFrom(...parts: (string | undefined | null | false)[]): string {
  return clampMeta(parts.filter(Boolean).join(' '));
}

/**
 * Description d'une page d'entité : le résumé propre d'abord, puis une queue
 * de contexte ajoutée seulement si elle tient en entier. Sur une entité au
 * résumé déjà long, mieux vaut la phrase complète qu'un contexte générique
 * amputé d'un « … ».
 */
export function metaWithContext(resume: string | undefined, context: string): string {
  const lead = (resume ?? '').replace(/\s+/g, ' ').trim();
  if (!lead) return clampMeta(context);
  return lead.length + 1 + context.length <= META_MAX ? `${lead} ${context}` : clampMeta(lead);
}
