# tantara.wiki

L'état des preuves sur le peuplement et l'histoire de Madagascar.
Le site ne tranche pas l'origine : il **cartographie l'état des preuves**, chaque
assertion portant son statut (`mesuré` · `reconstruit` · `daté-débattu` · `récit` ·
`conjectural`) et ses sources.

## Stack
Astro 5 (static) · content collections claims/sources/entities/pages · Cloudflare Pages.

## Modèle
- `src/content/claims/` — registre d'assertions (le cœur), validé au build :
  un claim sans source, ou un point `daté-débattu` sans ≥2 hypothèses concurrentes
  sourcées, **casse le build**.
- `src/content/sources/` — bibliographie.
- `src/content/entities/` — peuples · lieux · périodes · auteurs.
- `src/content/pages/` — prose .mdx qui référence les claims par id.
- Frise et carte sont **dérivées** des champs `period` / `geo` des claims.

## Dev
```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

MVP : la verticale « Peuplement ». FR d'abord, i18n prévu.
