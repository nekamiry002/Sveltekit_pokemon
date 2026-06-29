# Pokédex — Projet SvelteKit B3

Application web de consultation des 151 premiers Pokémon, avec gestion de favoris, équipe, comparaison et avis communautaires.

## Stack technique

| Technologie                      | Usage                              |
| -------------------------------- | ---------------------------------- |
| **SvelteKit 2** (Svelte 5 Runes) | Framework front-end SSR            |
| **TypeScript strict**            | Typage complet, zéro `any`         |
| **TailwindCSS v4**               | Styles utility-first, mobile-first |
| **Supabase**                     | Auth, BDD (favoris, équipe, avis)  |
| **PokeAPI** (`pokeapi.co`)       | Données Pokémon                    |
| **Vercel**                       | Déploiement continu                |
| **GitHub Actions**               | CI lint + build                    |

---

## Lancer le projet en local

```bash
# 1. Cloner et installer
git clone <url-du-repo>
cd my-app
npm install

# 2. Variables d'environnement
# Créer un fichier .env à la racine :
# PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# 3. Initialiser la base Supabase
# Ouvrir supabase/schema.sql dans l'éditeur SQL de votre projet Supabase et l'exécuter

# 4. Démarrer
npm run dev
```

> Dans Supabase, désactivez la confirmation d'email (Auth → Settings → Email → Disable email confirmations) pour pouvoir créer des comptes directement.

---

## Structure des fichiers

```
src/
├── app.d.ts                    # Types globaux SvelteKit (Locals, PageData)
├── hooks.server.ts             # Client Supabase SSR + safeGetSession
├── lib/
│   ├── components/
│   │   ├── Nav.svelte          # Navigation sticky responsive
│   │   ├── PokemonCard.svelte  # Carte réutilisable (favoris, compare)
│   │   ├── TypeBadge.svelte    # Badge coloré par type Pokémon
│   │   ├── LoadingSpinner.svelte
│   │   └── ProfileCard.svelte  # Carte profil utilisateur
│   ├── services/
│   │   ├── pokemon.ts          # Appels PokeAPI
│   │   ├── favorites.ts        # CRUD favoris Supabase
│   │   ├── team.ts             # CRUD équipe Supabase
│   │   └── ratings.ts          # CRUD avis Supabase
│   ├── state/                  # Universal Reactivity (Svelte 5)
│   │   ├── auth.svelte.ts      # État utilisateur global
│   │   ├── favorites.svelte.ts # Favoris partagés entre composants
│   │   ├── team.svelte.ts      # Équipe partagée entre composants
│   │   └── compare.svelte.ts   # Sélection pour comparaison
│   ├── types/
│   │   ├── pokemon.ts          # Interfaces PokeAPI
│   │   └── database.ts         # Interfaces Supabase (Profile, Favorite…)
│   └── utils/
│       └── api.ts              # safeFetch utilitaire
└── routes/
    ├── +layout.svelte          # Layout global (Nav + init stores)
    ├── +layout.server.ts       # Chargement session + favoris + équipe
    ├── +page.svelte            # Page d'accueil
    ├── login/                  # Connexion / inscription (form actions SSR)
    ├── account/                # Profil utilisateur (form actions SSR)
    ├── pokemon/
    │   ├── +page.svelte        # Liste avec recherche, filtre type, tri
    │   └── [id]/               # Détail : stats, favoris, équipe, avis
    ├── favorites/              # Mes favoris
    ├── team/                   # Mon équipe (6 slots)
    └── compare/                # Comparaison côte à côte (max 3)
```

---

## Fonctionnalités implémentées

### Authentification

- [x] Inscription (form action SSR, `supabase.auth.signUp`)
- [x] Connexion (form action SSR, `signInWithPassword`)
- [x] Déconnexion (form action)
- [x] Session persistante via cookies SSR (`@supabase/ssr`)
- [x] Redirection automatique si non connecté

### Pokédex

- [x] Liste des 151 premiers Pokémon (SSR, PokeAPI)
- [x] Recherche en temps réel (nom ou numéro)
- [x] Filtre par type (appel PokeAPI `/type/{type}`)
- [x] Tri par numéro ou par nom
- [x] Pagination côté client (20 par page)
- [x] Page de détail : stats de base, capacités, sprites, taille/poids
- [x] Artwork officiel haute résolution

### Favoris

- [x] Ajout / retrait depuis la liste ou la page de détail
- [x] Persistance Supabase (table `favorites`)
- [x] État partagé via `favoritesStore` (Universal Reactivity)
- [x] Page dédiée `/favorites`

### Équipe

- [x] Ajouter un Pokémon à son équipe depuis la page de détail
- [x] Maximum 6 Pokémon, affectation automatique des slots
- [x] Retrait depuis `/team` + suggestions depuis les favoris
- [x] Persistance Supabase (table `team_members`)

### Comparaison

- [x] Sélection jusqu'à 3 Pokémon depuis les cartes ou le détail
- [x] Page `/compare` avec tableau comparatif des stats
- [x] Mise en évidence du meilleur score par statistique

### Avis communautaires

- [x] Notation 1 à 5 étoiles + commentaire (optionnel)
- [x] Un avis par utilisateur par Pokémon (upsert)
- [x] Modification et suppression de son avis
- [x] Affichage de tous les avis + note moyenne
- [x] Persistance Supabase (table `ratings`)

### Qualité technique

- [x] TypeScript strict — aucun `any`
- [x] Universal Reactivity — 4 stores `.svelte.ts`
- [x] Server Actions — login, signup, updateProfile, toggleFavorite, toggleTeam, rate, deleteRating
- [x] Loading / Error / Success sur tous les appels API
- [x] Mobile-first, responsive (breakpoints sm/md/lg)
- [x] Accessibilité : `aria-label`, `aria-current`, `role`, `aria-live`, navigation clavier
- [x] ESLint + Prettier configurés
- [x] 0 erreurs, 0 warnings `svelte-check`
- [x] GitHub Actions CI (lint + check + build)

---

## Fonctionnalités manquantes / améliorations possibles

- [ ] Upload d'avatar (Supabase Storage)
- [ ] Tests Vitest (infrastructure configurée mais aucun test écrit)
- [ ] Thème sombre
- [ ] Pagination infinie / scroll
- [ ] Partage d'équipe via URL publique

---

## Base de données Supabase

Le schéma complet est dans [`supabase/schema.sql`](supabase/schema.sql).

| Table          | Description                               |
| -------------- | ----------------------------------------- |
| `profiles`     | Profil utilisateur (lié à `auth.users`)   |
| `favorites`    | Pokémon favoris (`user_id`, `pokemon_id`) |
| `team_members` | Équipe jusqu'à 6 slots numérotés          |
| `ratings`      | Note (1–5) + commentaire par Pokémon      |

RLS activée sur toutes les tables. Un trigger crée automatiquement un profil à l'inscription.

---

## Difficultés rencontrées

**Supabase SSR avec SvelteKit** : La gestion des cookies entre client et serveur nécessite `@supabase/ssr` avec un client distinct par contexte. Le `hooks.server.ts` crée un client SSR avec `getAll`/`setAll` sur les cookies. Un helper `safeGetSession()` valide la session côté serveur via `getUser()` (et non `getSession()` qui se contente de lire le JWT sans vérification côté serveur).

**Universal Reactivity (Svelte 5)** : Les stores `.svelte.ts` utilisent `$state` au niveau classe pour partager l'état sans prop-drilling. Le piège à éviter : initialiser un `$state` directement depuis une valeur de prop (qui ne réagit pas aux changements ultérieurs). Il faut utiliser `$derived` ou `$effect` pour synchroniser les valeurs réactives.

**Filtre par type** : Le PokeAPI ne retourne pas les types dans la liste `/pokemon?limit=151`. J'ai opté pour un appel séparé à `/type/{type}` côté client, puis une intersection des IDs retournés avec les 151 premiers.
