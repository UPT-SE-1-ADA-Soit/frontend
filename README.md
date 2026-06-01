# Marketa — Web

Vinted-inspired marketplace web app, built to share the same look-and-feel as the sibling Expo mobile project in `../mobile`.

## Stack

- React 18 (function components + hooks)
- Vite
- React Router v6
- Plain JavaScript (no TypeScript)
- Vanilla CSS + CSS Modules (one `.module.css` per component/page)
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev
```

Vite serves the app at <http://localhost:5173>.

## Project layout

```
src/
  App.jsx              router + global shell
  main.jsx             entry point, mounts providers
  index.css            CSS variables (design tokens) + base styles

  components/          reusable UI bits, each with a paired .module.css
    NavBar
    SearchBar
    ProductCard
    CategoryPill
    ConditionBadge
    ConversationCard
    InputField
    LoginRequired

  pages/               route components, each with a paired .module.css
    Landing / Home / Login / Register
    Search / Sell / Messages / Profile
    ProductDetail / Chat / NotFound

  context/
    auth.jsx           mock auth via localStorage
    likes.jsx          favourites persisted per-user

  mocks/               drop-in API stand-ins (replace with real fetches)
    products / users / categories / messages
```

## Design notes

- Primary teal `#09A5A0` (matches mobile's `Colors.primary`).
- Soft borders (`#E5E7EB`), card background `#FAFAFA`, accent coral `#FF6B6B`.
- Rounded corners (8–18px), pill chips, and gentle hover lifts mirror the mobile app's playful-but-clean Vinted vibe.
- Layout is mobile-first; max-width 1100px on desktop with a sticky top NavBar replacing the mobile tab bar.

## Replacing mocks with real APIs

All API stand-ins live under `src/mocks/`. Each consuming page calls them directly (no service layer) — when the backend is ready, swap the import for a real `fetch`/`axios` call and the page stays unchanged.
