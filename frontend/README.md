# Secret Santa - Frontend React 19# React + TypeScript + Vite



Frontend moderne de l'application Secret Santa, construit avec React 19, TypeScript, et une architecture propre basée sur la séparation container/component.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🎄 Stack TechniqueCurrently, two official plugins are available:



- **React 19.2.0** avec le nouveau compilateur- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **TypeScript 5.9.3** mode strict- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Vite 7.2.4** pour le build ultra-rapide

- **styled-components** pour CSS-in-JS## React Compiler

- **framer-motion** pour les animations

- **react-router-dom** pour le routingThe React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

- **@tanstack/react-query** pour la gestion du state serveur

- **axios** pour les appels API avec intercepteurs JWTNote: This will impact Vite dev & build performances.



## 🏗️ Architecture## Expanding the ESLint configuration



### Principes d'architectureIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:



L'application suit une architecture **Container/Component** stricte :```js

export default defineConfig([

#### 1. **Composants purs** (`/components`, `/pages`)  globalIgnores(['dist']),

- **Responsabilité** : Affichage uniquement (logique de présentation)  {

- **Props** : Uniquement des scalaires (string, number, boolean) et callbacks    files: ['**/*.{ts,tsx}'],

- **Règle** : Aucun appel API, aucun hook de données    extends: [

- **Avantages** : Testables, réutilisables, prévisibles      // Other configs...



#### 2. **Containers** (`/containers`)      // Remove tseslint.configs.recommended and replace with this

- **Responsabilité** : Logique métier, fetching de données, gestion d'état      tseslint.configs.recommendedTypeChecked,

- **Utilise** : React Query hooks, contexts, custom hooks      // Alternatively, use this for stricter rules

- **Traite** : Les données complexes et ne passe que des scalaires aux composants      tseslint.configs.strictTypeChecked,

- **Mémoïse** : Les calculs et transformations via `useMemo`      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

## 🚀 Démarrage rapide

      // Other configs...

```bash    ],

# Installer les dépendances    languageOptions: {

npm install      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

# Démarrer en dev (port 5173)        tsconfigRootDir: import.meta.dirname,

npm run dev      },

      // other options...

# Build de production    },

npm run build  },

```])

```

Frontend: http://localhost:5173

Backend API: http://localhost:3000/apiYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:



---```js

// eslint.config.js

🎅 **Joyeux Noël et bonnes fêtes !** 🎄import reactX from 'eslint-plugin-react-x'

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
