# my-app

A books browsing app built with **Expo SDK 57** (React Native + TypeScript) and powered by the [OpenLibrary API](https://openlibrary.org/). Browse a curated catalogue of detective fiction, view rich book details, save favourites, fill a cart, and share individual books through deep links — on Android, iOS and the web.

## ✨ Features

- **Browse books** — detective-fiction catalogue fetched from the OpenLibrary API with TanStack Query (built-in caching + pull-to-refresh).
- **Book details** — large cover, title, author, description and topic badges.
- **Favourites** — heart any book from the list or the detail page; persisted locally with Zustand + MMKV so it survives app restarts.
- **Cart** — header cart button with an animated count badge, plus a cart modal with quantity controls and swipe-to-delete.
- **Deep links & sharing** — `myapp:///book/<workId>...` opens a specific book directly, and the **Share Book** button shares a link to that exact book (native share sheet on iOS/Android, Web Share API or clipboard fallback in the browser).
- **Dark theme** with a green accent palette.

## 🧰 Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Expo SDK 57 (React Native 0.86, React 19) |
| Routing | expo-router v57 — file-based, with a Drawer navigator |
| Language | TypeScript (strict) |
| Data fetching | TanStack Query v5 |
| State & persistence | Zustand v5 + `react-native-mmkv` |
| Lists | `@shopify/flash-list` |
| Animations / gestures | `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets` |
| Deep links | `expo-linking` (`myapp://` scheme) |
| Icons | `@expo/vector-icons` (Ionicons) |

## 📁 Project structure

```
src/
├── api/                      # OpenLibrary data layer (typed fetchers + error type)
├── app/                      # expo-router routes (file-based routing)
│   ├── _layout.tsx           # Root layout: QueryClient + Drawer
│   ├── index.tsx             # Redirects to /books
│   ├── books.tsx             # Book list screen
│   ├── favourites.tsx        # Favourites screen
│   └── book/[id].tsx         # Book detail screen
├── components/               # BookCover, BookItem, CartButton, CartModal, EmptyListComponent, ErrorState, MenuButton, Skeleton
├── constants/colors.ts       # Dark-theme palette
├── store/                    # Zustand stores (cart, favourites) with MMKV persistence
├── types/interfaces.ts       # Book / BookDetails API types
└── utils/                    # book.ts, bookCover.ts, deepLinks.ts, mmkvStorage.ts
```

## 🚀 Getting started

### Prerequisites

- Node.js 22.13+ (Expo SDK 57 requirement)
- npm
- For native: an iOS simulator / Android emulator, or a physical device with the Expo development client (this project is set up with `expo-dev-client`). To just try it quickly, run it in the web browser or Expo Go instead.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (a template is provided in `.env.example`):

```bash
EXPO_PUBLIC_API_URL=https://openlibrary.org
EXPO_PUBLIC_COVERS_API_URL=https://covers.openlibrary.org
```

Both variables are public — the `EXPO_PUBLIC_` prefix makes Expo inline them into the app at build time. `.env` is gitignored, so don't forget this step after cloning.

### 3. Start the dev server

```bash
npx expo start
```

Then press:

- `i` — open on the iOS simulator
- `a` — open on the Android emulator
- `w` — open in the browser at `http://localhost:8081`

Or use the platform-specific npm scripts directly:

```bash
npm run ios       # expo run:ios     → iOS development build
npm run android   # expo run:android → Android development build
npm run web       # expo start --web
```

### 4. Lint

```bash
npm run lint
```

## 🔗 Deep links

The app registers the `myapp://` URL scheme. Expo Router exposes every route as a deep link automatically, so a link like `myapp:///book/<workId>` lands straight on the matching book detail screen.

| Route | Deep link |
| --- | --- |
| Books list | `myapp:///books` |
| Book detail | `myapp:///book/<workId>?coverId=<id>&author=<name>&title=<title>` |

The optional query params (`coverId`, `author`, `title`) are shown immediately on the detail screen while the remaining data is fetched from the API — this is exactly what the **Share Book** button produces. The helper that builds these URLs lives in `src/utils/deepLinks.ts`.

You can test a deep link from your terminal while the app is running on a device:

```bash
# iOS
npx uri-scheme open "myapp:///book/OL12345W?coverId=123&author=Sample&title=Hello" --ios

# Android
npx uri-scheme open "myapp:///book/OL12345W?coverId=123&author=Sample&title=Hello" --android
```

> ℹ️ Custom-scheme deep links only open when the app is installed. If you want http(s) links that open the app when installed and fall back to a website otherwise, see the Expo guides on [Android App Links](https://docs.expo.dev/linking/android-app-links/) and [iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/).

## 🙌 Acknowledgements

- Catalogue & metadata: [OpenLibrary API](https://openlibrary.org/developers/api)
- Book covers: [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)
- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev)
