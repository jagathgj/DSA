# DSA Quest

An interactive, self-paced web app for learning **Data Structures and Algorithms** with JavaScript. Built on **IBM Carbon Design System** with SCSS, React, Vite, and TypeScript. Designed for GitHub Pages deployment.

## What's inside

- **Modules & lessons** — themed learning paths (Arrays, Linked Lists, Trees, Graphs, Sorting, Recursion, DP, Big O…), each with explanations, real-life analogies, diagrams, runnable code, interactive playgrounds, walkthroughs, quizzes, and coding challenges
- **Practice problems** — LeetCode-style with in-browser test runner, hints, and solutions
- **Algorithm visualizers** — bubble / selection / insertion / merge / quick sort; linear & binary search; BST traversals (BFS, inorder, preorder, postorder); graph BFS/DFS
- **JavaScript playground** — sandboxed runner with presets
- **Progress system** — XP, levels, streaks, 12 achievements, all stored in `localStorage`
- **Themes** — Carbon `white` and `g100` (dark), with system-follow option

## Tech stack

- React 18 + TypeScript + Vite
- **`@carbon/react`** (IBM Carbon components)
- **`@carbon/icons-react`** (Carbon icons)
- **SCSS** (Dart Sass) — Carbon themes via the `theme.theme()` mixin
- React Router v6
- Zustand (persisted state)
- Framer Motion (animations)
- Monaco Editor (in-browser code editor)
- `gh-pages` (deployment)

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173/dsa-quest/
npm run build        # type-check + Vite build to dist/
npm run preview      # preview the production build
```

## Deploying to GitHub Pages

The project is pre-wired for the `gh-pages` package.

### One-time setup

1. **Create the repo on GitHub** (e.g. `your-username/dsa-quest`)
2. **Update two files** to match the repo name:

   `package.json`:

   ```json
   "homepage": "https://YOUR_USERNAME.github.io/dsa-quest/"
   ```

   `vite.config.ts`:

   ```ts
   base: '/dsa-quest/',
   ```

   *If you fork to a different repo name, both values must match its path.*

3. **Push to GitHub and enable Pages**: Settings → Pages → Source: "Deploy from a branch" → Branch: `gh-pages` → Folder: `/ (root)` → Save.

### Deploy

```bash
npm run deploy
```

This runs `predeploy` (= `npm run build`) and then pushes `dist/` to the `gh-pages` branch. GitHub Pages will serve it within a minute at the `homepage` URL.

> **Custom domain?** Set `base: '/'` in `vite.config.ts` and add a `CNAME` file under `public/`.

## Project structure

```
src/
├── App.tsx                # routes
├── main.tsx               # entry, BrowserRouter with basename from import.meta.env.BASE_URL
├── components/
│   ├── layout/Layout.tsx      # sidebar + topbar shell
│   ├── ThemeProvider.tsx      # toggles .cds--white / .cds--g100 on <body>
│   ├── AchievementWatcher.tsx # toast queue for unlocks
│   ├── lesson/                # section renderers (Explanation, Code, Quiz, Challenge, …)
│   │   ├── diagrams/          # ArrayDiagram, TreeDiagram, …
│   │   └── interactive/       # ArrayPlayground, LinkedListPlayground, …
│   └── visualizers/           # SortingVisualizer, SearchingVisualizer, TreeVisualizer, GraphVisualizer
├── content/
│   ├── modules.ts             # module roadmap
│   ├── achievements.ts        # 12 achievements
│   ├── lessons/*.json         # one JSON per lesson
│   ├── lessons.ts             # imports + lookups
│   ├── problems/*.json        # one JSON per problem
│   └── problems.ts            # imports + lookups
├── lib/
│   ├── utils.ts               # XP/level helpers, sandboxed JS runner
│   ├── achievements.ts        # unlock-condition evaluator
│   └── icons.ts               # lucide-name → Carbon-name mapping for modules
├── pages/                     # 10 routes
├── stores/                    # Zustand stores (progress, settings)
├── styles/
│   ├── main.scss              # entry — Carbon themes + reset + components + app layers
│   ├── _themes.scss           # white / g100 scope mixins
│   ├── _layout.scss           # sidebar, topbar, mobile drawer
│   └── _components.scss       # utility classes (.dsa-surface, .dsa-prose, …)
└── types/index.ts             # discriminated unions for lessons + problems
```

## How content works

Every lesson and problem is a JSON file under `src/content/`. To add a new lesson:

1. Create `src/content/lessons/my-lesson.json` matching the `Lesson` shape in `src/types/index.ts`
2. Import it in `src/content/lessons.ts`
3. Add its id to a module's `lessons` array in `src/content/modules.ts`

Lesson sections are a discriminated union: `explanation`, `analogy`, `diagram`, `code`, `interactive`, `walkthrough`, `quiz`, `challenge`. The renderer dispatches based on `type`.

## Theming

Themes are applied via Carbon's class-scoped tokens. The `ThemeProvider` toggles `.cds--white` or `.cds--g100` on `<body>` — every Carbon component and every `.dsa-*` utility class inherits the theme tokens automatically.

To add a new color token, use Carbon's Sass tokens (`$layer-01`, `$button-primary`, `$support-success`, etc.) in your SCSS files. These tokens automatically adapt to the active theme at build time.

## Resetting your progress

Settings → "Reset all progress" → confirm. This clears `localStorage` and rebuilds the initial state.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Carbon supports the latest two versions of each.

## Known follow-ups

- Carbon Charts integration for a "complexity comparison" page
- Expanded Big O practice set (25 problems shipped; more would deepen coverage)
- Code-splitting Monaco and Carbon into separate chunks (the 2.5 MB bundle ships fine but could be smaller)

## Styling architecture (BEM)

All visual styling lives in `src/styles/_components.scss` as BEM blocks (`.dsa-block__element--modifier`). No utility-class framework; no inline `style={{}}` props except for three intentional cases where the *value being rendered is data*, not styling:

- `.dsa-bar { height: <% per data point> }` — sorting visualizer bar heights
- `.dsa-progress-bar__fill { width: <% computed from XP> }` — XP and module progress
- `.dsa-module-card__progress-row` progress fill — same pattern

Everything else is a CSS class. Carbon Sass tokens (like `$layer-01`, `$text-primary`) are used throughout the SCSS and automatically adapt when the theme toggles between `.cds--white` and `.cds--g100`.

## License

MIT
