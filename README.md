# For Racheal 🎂

A cinematic, scroll-driven birthday website — a personal gift from Abubakar to Racheal on 21 November 2026.

---

## How to run it locally

```bash
# Install dependencies (only needed once)
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## How to edit the copy

**All text lives in one file: `src/content.ts`**

Open it and change anything — captions, headings, stats, the letter — without touching any component. Save the file and the browser hot-reloads instantly.

Key things you can edit:
| Section | Key in `content.ts` |
|---|---|
| Gate intro line | `gate.intro` |
| Hero headline / subline | `hero.headline`, `hero.subline` |
| Star captions (12 months) | `stars.months[i].caption` |
| Numbers (messages, days…) | `numbers.stats` |
| Video captions | `videos.items[i].caption` |
| Flip card phrases + backs | `insideJokes.cards` |
| Wish candle text | `wish.afterText` |
| The letter paragraphs | `letter.paragraphs` |

---

## How to add your videos

Drop four video files into **`public/videos/`**:

```
public/videos/racheal-1.mp4
public/videos/racheal-2.mp4
public/videos/racheal-3.mp4
public/videos/racheal-4.mp4
```

Portrait (9:16) or landscape both work — the player adapts. Each file is loaded only when active so the page stays fast even at ~11 MB per file.

---

## How to add ambient music

Drop an MP3 into:

```
public/audio/theme.mp3
```

The page loads it on demand (only when the user unmutes). It fails silently if the file is missing.

---

## How to build for production

```bash
npm run build
```

Output goes into the **`dist/`** folder.

---

## How to deploy

### Option 1 — Netlify Drop (easiest, no account needed)

1. Run `npm run build`
2. Go to **https://app.netlify.com/drop**
3. Drag the `dist` folder into the browser window
4. Copy the URL and send it to Racheal

### Option 2 — Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option 3 — Vercel

```bash
npm install -g vercel
vercel --prod
```

Vercel auto-detects Vite. No config needed.

### Option 4 — GitHub Pages / any static host

Upload the contents of `dist/` to any static file host. The site has no server-side code.

---

## Phone checklist before sending to Racheal

Go through this on your phone before you share the link:

- [ ] Gate loads, "Today is yours." appears, **Begin** button is tappable
- [ ] Mute toggle is in the top-right corner and responds
- [ ] Hero cake is visible and fills the screen nicely
- [ ] Scroll through all chapters without jank
- [ ] Star chapter: tap a star, caption card appears at bottom
- [ ] Numbers count up when they scroll into view
- [ ] Baker chapter: "Racheal's Bakery" sign is readable
- [ ] Video chapter: at least the placeholder (or video if files are present) shows; swipe works between cards
- [ ] Flip card chapter: tap a card, it flips to show the back; prev/next buttons work
- [ ] Wish candle: tap the flame, it blows out, gold confetti and lanterns appear, text fades in
- [ ] Letter: tap the wax seal, it disappears, the paper unfolds, text types out paragraph by paragraph
- [ ] Replay button scrolls back to top
- [ ] No console errors (open DevTools → Console)
- [ ] Safe areas look correct on notched phones (content not hidden behind the notch or home bar)
- [ ] Test in both portrait and landscape

---

## Credits

Built with Vite + React + TypeScript, Three.js / React Three Fiber, GSAP, Lenis, and Framer Motion.
Made with love. 🕯️
