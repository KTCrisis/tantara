import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Le modèle épistémique de tantara.
 * Une assertion porte toujours son STATUT de preuve et ses sources.
 * Les contraintes ci-dessous sont vérifiées au build : la rigueur n'est pas
 * une intention, elle est imposée.
 */
export const STATUTS = ['mesuré', 'attesté', 'reconstruit', 'daté-débattu', 'récit', 'conjectural'] as const;
export const ROUTES = ['austronesien', 'bantou', 'arabo-swahili', 'europeen'] as const;
// La discipline dit COMMENT on sait (la démarche), là où la route dit ce qui s'est passé.
export const DISCIPLINES = ['histoire', 'archéologie', 'génétique', 'linguistique', 'autre'] as const;

// ── Sources : la bibliographie ──
const sources = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/sources' }),
  schema: z.object({
    titre: z.string(),
    auteur: z.string(),
    annee: z.number().optional(),
    type: z.enum(['article', 'ouvrage', 'revue', 'rapport', 'web']).default('article'),
    poids: z.enum(['primaire', 'synthèse', 'vulgarisation']).default('synthèse'),
    acces: z.enum(['libre', 'paywall']).default('libre'),
    url: z.string().url().optional(),
  }),
});

// ── Entités : peuples · lieux · périodes · auteurs ──
const entities = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/entities' }),
  schema: z.object({
    nom: z.string(),
    kind: z.enum(['peuple', 'lieu', 'periode', 'auteur']),
    resume: z.string().optional(),
  }),
});

// ── Hypothèse concurrente (pour un point débattu) ──
const hypothese = z.object({
  label: z.string(),
  statement: z.string(),
  sources: z.array(reference('sources')).default([]),
});

// ── Claims : le registre d'assertions ──
const claims = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/claims' }),
  schema: z
    .object({
      statement: z.string(),
      statut: z.enum(STATUTS),
      discipline: z.enum(DISCIPLINES),
      domain: z.string(),
      period: z.tuple([z.number(), z.number()]).optional(), // années ; négatif = av. n.è.
      geo: z
        .object({
          lat: z.number(),
          lng: z.number(),
          route: z.enum(ROUTES).optional(),
          label: z.string().optional(),
        })
        .optional(),
      sources: z.array(reference('sources')).default([]),
      hypotheses: z.array(hypothese).default([]),
      note: z.string().optional(),
    })
    .superRefine((c, ctx) => {
      // tout claim non débattu doit citer au moins une source
      if (c.statut !== 'daté-débattu' && c.sources.length < 1) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sources'],
          message: `claim "${c.statement.slice(0, 40)}…" : statut ${c.statut} sans source` });
      }
      // un point débattu doit exposer au moins deux hypothèses concurrentes, sourcées
      if (c.statut === 'daté-débattu') {
        if (c.hypotheses.length < 2) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['hypotheses'],
            message: 'statut daté-débattu : au moins deux hypothèses concurrentes requises' });
        }
        c.hypotheses.forEach((h, i) => {
          if (h.sources.length < 1) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['hypotheses', i, 'sources'],
              message: `hypothèse "${h.label}" sans source` });
          }
        });
      }
    }),
});

// ── Prose : pages .mdx qui référencent les claims par id ──
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    domain: z.string(),
    order: z.number().default(0),
    intro: z.string().optional(),
  }),
});

export const collections = { sources, entities, claims, pages };
