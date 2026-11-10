# Evently

CMS pour créer le site de n'importe quel événement (festival, salon, trail, séminaire…), centré sur le **data storytelling** : articles classiques et articles « dashboard » avec des visualisations issues de fichiers CSV ou d'API open data.
Fonctionne avec des fichiers de configurations local comme Wordpress.

## Stack (imposée)

- **Back** : Symfony — back-office d'administration + API consommée par le front.
- **Front** : React + TailwindCSS, Chart.js pour les graphiques.
- **Services** : Docker Compose (serveur web + base SQL + phpMyAdmin).
- Polices Google Fonts : Newsreader (titres) et Manrope (texte). Dépendance validée.
- Aucune autre dépendance (bundle Symfony, paquet npm, image Docker) sans validation préalable.

## Documents de référence

- `ai-guide/design.md` : direction artistique, palette, typographie (mode clair uniquement). Toujours utiliser ces couleurs et polices, sans en inventer d'autres.
- `ai-guide/lessons.md` : bonnes pratiques, conventions, principes de travail. Toujours le lire avant de commencer un développement.
- `ai-guide/structure.md` : arborescence du projet (back, front, Docker), structure des entités, des routes d'API et des composants, conventions de nommage. Toujours le lire avant de commencer un développement.

## Structure

- Voir `ai-guide/structure.md` pour l'arborescence, le découpage back / front et les conventions de nommage.
- Le back et le front sont deux parties distinctes : le front ne communique avec le back que via l'API. Toute modification d'un endpoint doit être reportée côté front (appels, types, gestion d'erreur).

## Conventions

### Général

- Contenu du site et de l'interface en français. Code (variables, classes, fonctions) en anglais, sauf les entités métier (classes, propriétés, tables) qui sont nommées en français (`Utilisateur`, `motDePasse`, `dateInscription`).
- Responsive obligatoire (mobile d'abord).
- Accessibilité de base : balises sémantiques, `alt` sur les images, contrastes suffisants, navigation au clavier.

### Back (Symfony)

- Respecter les conventions Symfony (entités Doctrine, contrôleurs fins, logique métier dans des services).
- Toute modification du schéma passe par une migration Doctrine. Ne jamais modifier la base à la main.
- Valider toutes les données entrantes (formulaires, API, imports CSV) avec le composant Validator.

### Front (React)

- Composants réutilisables pour les éléments communs (header, nav, footer, cartes, graphiques) : ne jamais les dupliquer d'une page à l'autre.
- Styles avec Tailwind uniquement, en s'appuyant sur les couleurs et polices de `ai-guide/design.md`.
- Chaque appel API gère trois états : chargement, erreur, succès.

### Données et visualisations

- Ne jamais faire confiance à un CSV importé : vérifier format, encodage, séparateur, colonnes attendues, et afficher une erreur claire si le fichier est invalide.
- Mettre en cache les réponses des API open data, et prévoir un affichage de repli si l'API ne répond pas.
- Toujours afficher la source (et la licence si elle l'exige) sous chaque visualisation.
- Chaque graphique Chart.js a un titre, des axes légendés et une alternative textuelle (résumé ou tableau de données) pour l'accessibilité.

### Docker

- Le projet doit démarrer avec un simple `docker compose up`.
- Aucun secret (mot de passe, clé d'API) en dur dans le code ou dans `docker-compose.yml` : utiliser les fichiers `.env` (le `.env.local` n'est jamais commité).

## Méthode de travail

- Si la demande est ambiguë, pose une question avant de coder.
- Si quelque chose ne se passe pas comme prévu : arrête-toi, explique le problème et propose un nouveau plan avant de continuer.
- Ne modifie que ce qui est demandé. Signale les améliorations possibles sans les appliquer.
- Si une tâche touche à la fois le back et le front, présente d'abord le contrat d'API (route, méthode, format des données) avant d'écrire le code.

## Principes

- **Simplicité d'abord** : la solution la plus simple, avec le moins de code modifié possible.
- **Corriger la cause, pas le symptôme** : pas de rustine temporaire. Si la vraie correction dépasse le périmètre demandé, dis-le.

## Définition de « terminé »

- Les conteneurs démarrent sans erreur (`docker compose up`).
- Les migrations Doctrine s'appliquent sans erreur sur une base vide.
- Les endpoints concernés répondent avec les bons codes HTTP et le bon format.
- La page s'affiche sans erreur dans la console du navigateur.
- Le rendu est correct en mobile et en desktop.
- Les graphiques s'affichent avec des données réelles et gèrent le cas « données vides ou invalides ».
- Tous les liens internes fonctionnent.

## Apprentissage continu

Après chaque correction de notre part, ajoute une règle dans `ai-guide/lessons.md` (crée-le s'il n'existe pas) :

- une ligne par règle, formulée comme une consigne (« Toujours… » / « Ne jamais… ») ;
- pas de doublon : reformule une règle existante plutôt que d'en ajouter une proche ;
- précise la partie concernée si besoin : `[Back]`, `[Front]`, `[Data]`, `[3D]`, `[Docker]`.
