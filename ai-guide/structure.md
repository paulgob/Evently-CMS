# Structure du projet

Ce fichier décrit la structure **actuellement en place**. Le mettre à jour à chaque ajout d'entité, de route d'API, de composant ou de service Docker.

## Arborescence

```
Evently-CMS/
├── .env                      # Identifiants MySQL de dev, lus par Docker Compose
├── compose.yaml              # Services Docker (backend, frontend, db, phpmyadmin)
├── Claude.md                 # Consignes pour l'IA
├── ai-guide/
│   ├── design.md             # Direction artistique, palette, typographie
│   ├── lessons.md            # Règles apprises au fil des corrections
│   └── structure.md          # Ce fichier
├── backend/                  # Symfony 7.4 (API + back-office)
│   ├── Dockerfile            # Image PHP 8.4 CLI + Composer
│   ├── .env                  # Variables par défaut (commité)
│   ├── .env.dev              # APP_SECRET de dev (commité)
│   ├── composer.json
│   ├── bin/console
│   ├── config/
│   │   ├── bundles.php
│   │   ├── routes.yaml       # Routes chargées depuis les attributs #[Route] des contrôleurs
│   │   ├── services.yaml     # Autowiring de tout src/
│   │   ├── packages/         # cache, doctrine, doctrine_migrations, framework, routing
│   │   └── routes/
│   ├── migrations/           # Migrations Doctrine (VersionAAAAMMJJHHMMSS.php)
│   ├── public/index.php      # Point d'entrée HTTP
│   ├── src/
│   │   ├── Kernel.php
│   │   ├── Controller/       # (vide pour le moment)
│   │   ├── Entity/           # Entités Doctrine
│   │   └── Repository/       # Un repository par entité
│   └── var/                  # Cache et logs (non commité)
└── frontend/                 # React 19 + Vite 8
    ├── index.html
    ├── package.json
    ├── vite.config.js        # Proxy /api -> Symfony
    ├── .oxlintrc.json        # Linter (oxlint)
    ├── public/               # Fichiers statiques (favicon.svg, icons.svg)
    └── src/
        ├── main.jsx          # Point d'entrée React
        ├── App.jsx           # Composant racine (encore le gabarit Vite par défaut)
        ├── App.css
        ├── index.css
        └── assets/
```

Non commités : `backend/vendor/`, `backend/var/`, `backend/.env.local`, `frontend/node_modules/`, `frontend/dist/`.

## Docker

Démarrage : `docker compose up` à la racine.

| Service      | Image / build        | Port hôte | Rôle                                                        |
| ------------ | -------------------- | --------- | ----------------------------------------------------------- |
| `backend`    | `./backend` (PHP 8.4) | 8000      | `composer install` puis serveur PHP intégré sur `public/`   |
| `frontend`   | `node:22`            | 5173      | `npm install` puis `npm run dev` (Vite)                     |
| `db`         | `mysql:8.4`          | —         | Base `evently`, volume `db_data`                            |
| `phpmyadmin` | `phpmyadmin:5`       | 8080      | Administration de la base (identifiants du `.env`)          |

- Les identifiants MySQL (`MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`) sont définis dans le `.env` à la racine, jamais en dur dans `compose.yaml`.
- Le front appelle le back via le proxy Vite : toute requête vers `/api` est redirigée vers `API_URL` (`http://backend:8000` dans Docker, `http://127.0.0.1:8000` hors Docker).
- Le back se connecte à MySQL via `DATABASE_URL`, construite dans `compose.yaml` à partir des variables du `.env` racine (elle remplace la valeur par défaut de `backend/.env`), hôte `db`.

## Back (Symfony)

### Dépendances

- `symfony/framework-bundle`, `console`, `dotenv`, `runtime`, `yaml`, `flex` (7.4)
- `doctrine/orm`, `doctrine/doctrine-bundle`, `doctrine/doctrine-migrations-bundle`
- Dev : `symfony/maker-bundle`

### Entités

Mapping Doctrine par attributs PHP, stratégie de nommage `underscore` (propriété `motDePasse` → colonne `mot_de_passe`).

**`Role`** — table `role`

| Propriété | Type     | Contraintes                   |
| --------- | -------- | ----------------------------- |
| `id`      | int      | clé primaire, auto-incrément  |
| `code`    | string(50)  | unique (`UNIQ_ROLE_CODE`)  |
| `libelle` | string(100) |                            |

**`Utilisateur`** — table `utilisateur`

| Propriété         | Type               | Contraintes                            |
| ----------------- | ------------------ | -------------------------------------- |
| `id`              | int                | clé primaire, auto-incrément           |
| `email`           | string(180)        | unique (`UNIQ_UTILISATEUR_EMAIL`)      |
| `pseudo`          | string(50)         | unique (`UNIQ_UTILISATEUR_PSEUDO`)     |
| `motDePasse`      | string(255)        |                                        |
| `dateInscription` | DateTimeImmutable  | initialisée dans le constructeur       |

Aucune relation entre entités pour le moment.

### Migrations

| Version                 | Contenu                                    |
| ----------------------- | ------------------------------------------ |
| `Version20261110133246` | Création des tables `role` et `utilisateur` |

### Routes d'API

Aucune route pour le moment. Les routes sont déclarées par attributs `#[Route]` dans `src/Controller/` et toutes préfixées par `/api` (préfixe attendu par le proxy Vite).

## Front (React)

### Dépendances

- `react`, `react-dom` (19)
- Dev : `vite`, `@vitejs/plugin-react`, `oxlint`

Tailwind CSS et Chart.js (stack imposée) ne sont pas encore installés.

### Composants

Aucun composant applicatif pour le moment : `App.jsx` contient encore le gabarit par défaut de Vite.

### Scripts

- `npm run dev` : serveur de développement
- `npm run build` : build de production dans `dist/`
- `npm run lint` : vérification avec oxlint

## Conventions de nommage (observées)

- **Langue** : les entités métier (classes, propriétés, tables) sont en français ; le reste du code est en anglais.
- **Entités** : nom de classe au singulier en PascalCase (`Utilisateur`, `Role`), table au singulier en snake_case (`utilisateur`, `role`).
- **Propriétés** : camelCase (`dateInscription`), converties en snake_case en base.
- **Contraintes d'unicité** : `UNIQ_<TABLE>_<CHAMP>` en majuscules.
- **Repositories** : `<Entité>Repository` dans `src/Repository/`.
- **Setters** : retournent `static` pour permettre le chaînage.
