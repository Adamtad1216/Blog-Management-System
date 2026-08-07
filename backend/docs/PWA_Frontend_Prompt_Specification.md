# 🚀 Progressive Web App (PWA) Frontend Prompt Specification

> **Copy and paste the master prompt below into your AI coding assistant (or provide it to your frontend engineering team) to build a wowed, ultra-premium Progressive Web App frontend integrated with your Blog Management System backend.**

---

```markdown
# TASK PROMPT: BUILD A STUNNING PROGRESSIVE WEB APP (PWA) FOR THE BLOG MANAGEMENT SYSTEM

You are an expert Principal Frontend Engineer and UI/UX Designer specializing in building ultra-premium Progressive Web Applications (PWA). Your task is to design and develop a production-ready, highly responsive, and visually wowed PWA frontend that seamlessly connects to our Express/Prisma PostgreSQL backend API.

---

## 🎨 1. DESIGN SYSTEM & VISUAL AESTHETICS

### Visual Philosophy
- **Style**: Modern Glassmorphism combined with sleek Dark Mode and high-contrast Light Mode defaults.
- **Color Palette**:
  - **Primary**: Deep Indigo (`#4F46E5`) & Electric Violet (`#7C3AED`) gradients.
  - **Dark Theme Background**: Deep Obsidian (`#0F172A`) to Charcoal (`#1E293B`).
  - **Light Theme Background**: Soft Pearl (`#F8FAFC`) with subtle violet glass overlays.
  - **Accents**: Crimson Pink (`#F43F5E`) for Likes, Amber Gold (`#F59E0B`) for Bookmarks, Emerald (`#10B981`) for Online/Published status.
- **Typography**: Modern Google Fonts — **Outfit** for headings and **Inter** for body text.
- **Animations & Interactivity**:
  - Micro-interactions on all hover, click, and touch events (Framer Motion).
  - Smooth page transitions and floating install prompt banner.
  - Skeleton shimmer screens during data fetching.

---

## 📱 2. PROGRESSIVE WEB APP (PWA) REQUIREMENTS

1. **Manifest Configuration (`manifest.json`)**:
   - `name`: "Lumina Blog - Modern Reading Experience"
   - `short_name`: "Lumina"
   - `theme_color`: "#4F46E5"
   - `background_color`: "#0F172A"
   - `display`: "standalone"
   - Support icons in `192x192`, `512x512`, and maskable formats.
2. **Service Worker & Caching Strategy**:
   - **Stale-While-Revalidate**: For blog posts and categories.
   - **Cache-First**: For static assets, Google Fonts, and avatars.
   - **Network-First**: For authentication (`/api/auth/*`) and user interaction actions (`/comments`, `/like`, `/bookmark`).
3. **Offline Mode & Storage**:
   - Save bookmarked articles to `IndexedDB` / Cache Storage so users can read saved blogs even when offline.
   - Top banner notification ("⚡ You are currently offline. Showing cached articles.") when internet connection drops.
4. **Install Experience**:
   - Custom floating PWA Install prompt ("Add Lumina to Home Screen") with high-converting UI.

---

## 🧩 3. PAGES & CORE FEATURE MODULES

### Page 1: Home / Discovery Feed (`/`)
- **Hero Section**: Featured trending post with dynamic glassmorphic cover card and author badge.
- **Category Filter Pills**: Interactive horizontal scroll pills (e.g. *Technology, Design, AI, Architecture*).
- **Post Feed**: Responsive 3-column grid (desktop) / 1-column stack (mobile) of post cards featuring:
  - Featured cover image with overlay gradient.
  - Category badge, title, excerpt.
  - Author avatar, full name, published date.
  - Interactive Like count, Comment count, and quick Bookmark toggle button.
- **Pagination / Infinite Scroll**: Smooth load-more controller.

### Page 2: Single Post Detail (`/posts/:id`)
- Full-width hero cover image with parallax effect.
- Article metadata (reading time estimate, view count, author profile card).
- Markdown rendered blog content with beautiful code syntax highlighting.
- **Interactive Engagement Bar**:
  - Heart icon button with ripple animation (`POST /api/posts/:id/like`).
  - Bookmark button (`POST /api/posts/:id/bookmark`).
  - Share modal (Web Share API fallback to copy link).
- **Nested Comments Section**:
  - Comment submission box (protected by login guard).
  - Threaded comment tree displaying parent comments and replies.
  - Inline reply editor, edit comment option, soft-delete status.

### Page 3: User Authentication (`/login` & `/register`)
- Dual tab / split screen layout with animated ambient gradient background.
- Form validation feedback (Zod / React Hook Form integration).
- Persistence of Access Token (in memory/state) and Refresh Token (HTTP-Only / secure storage).

### Page 4: Saved Bookmarks (`/bookmarks`)
- Dedicated offline-capable page listing user's bookmarked posts (`GET /api/users/me/bookmarks`).
- One-click option to remove from bookmarks or read offline.

### Page 5: Create / Edit Article (`/editor`)
- Rich text / Markdown editor for AUTHORS and ADMINS.
- Live preview split-pane.
- Category selection dropdown and tag input pills.

---

## 🔌 4. BACKEND API INTEGRATION CONTRACT

Base URL: `http://localhost:5000/api`

### Endpoints Map:
- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`
- **Posts**: `GET /posts`, `GET /posts/:id`
- **Comments**: `GET /posts/:id/comments`, `POST /posts/:id/comments`, `POST /comments/:id/reply`, `PATCH /comments/:id`, `DELETE /comments/:id`
- **Likes**: `POST /posts/:id/like`, `DELETE /posts/:id/like`, `GET /posts/:id/likes`
- **Bookmarks**: `POST /posts/:id/bookmark`, `DELETE /posts/:id/bookmark`, `GET /users/me/bookmarks`

---

## 🛠️ 5. RECOMMENDED TECH STACK & TOOLS

- **Framework**: React 18 / Vite or Next.js 14 App Router
- **Styling**: Tailwind CSS v3 + CSS Glassmorphism variables
- **Icons**: Lucide React (`lucide-react`)
- **State Management**: TanStack Query (React Query v5) for API caching + Zustand for Auth state
- **PWA Tooling**: `vite-plugin-pwa` / `workbox-window`
- **Animations**: `framer-motion`
- **HTTP Client**: Axios with automatic JWT interceptors for refresh token handling

---

## ⚡ EXPECTED DELIVERABLE REQUIREMENTS
1. Clean, modular folder structure (`src/components`, `src/pages`, `src/services`, `src/hooks`, `src/pwa`).
2. 100% Mobile First & Responsive Design (iPhone, iPad, Desktop).
3. Zero placeholder images — use Unsplash source links or dynamic SVG avatars.
4. Instant user feedback on like, comment, and bookmark clicks (optimistic UI updates).
```
