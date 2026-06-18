# الطازج بيكري · Al-Tazaj Bakery — Digital Menu

A premium, animated, mobile-first digital menu for **Al-Tazaj Bakery** (Basra, Iraq).
Arabic-first (RTL) with an English toggle, 28 categories and 331 items, built for
QR-at-the-table and social bio-link use.

> **Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion (Framer Motion) · lucide-react

## ✨ Features

- **Cinematic intro** loader — red field with the white wheat mark (the logo, animated in), once per session.
- **Bold hero** — the red wheat mark, ink wordmark with a red accent, a faint oversized wheat watermark, and a rotating "fresh daily" seal (desktop).
- **Sticky category bar** with scroll-spy: the active category follows your scroll and auto-centers.
- **Live search** overlay — forgiving Arabic matching (ignores diacritics / alef variants) across names + ingredients, in both languages.
- **Signature carousel** of featured items.
- **Animated item cards** — reveal-on-scroll, image zoom, price chips, signature badges.
- **Item detail sheet** — large photo, ingredient chips, price.
- **Arabic ⇄ English** toggle that flips the whole layout RTL/LTR. Eastern-Arabic numerals in Arabic mode (٣٬٥٠٠ د.ع), Western in English.
- **Performance** — images served from the Cloudflare CDN at the exact size needed (`w=600` etc.), lazy-loaded with a shimmer + blur-up.
- Fully accessible: red `:focus-visible` rings, modal dialogs with focus trap/restore, honours `prefers-reduced-motion` (via Motion's `MotionConfig`).
- **Brand:** bold red `#ED1C24` · white / off-white · near-black, with the geometric **wheat mark** throughout (recreated 1:1 from the logo as `src/components/WheatMark.tsx`). Fonts: **Jost** (Latin) + **Cairo** (Arabic). Theme tokens live in `src/index.css` (`@theme`).

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + bundle to dist/
npm run preview    # preview the production build
```

## 🍞 Updating the menu

The menu lives in [`src/data/menu.json`](src/data/menu.json), generated from the
FineDine Excel export bundled as `menu-source.xlsx`.

```bash
pip3 install openpyxl
python3 scripts/generate-menu.py            # uses ./menu-source.xlsx
python3 scripts/generate-menu.py other.xlsx # or pass a different export
```

The script translates Arabic category/item text to English via the curated
`PHRASES` / `WORDS` dictionaries inside
[`scripts/generate-menu.py`](scripts/generate-menu.py). The English layer is
auto-generated — tweak those maps and re-run to refine any awkward phrasing.
It prints a coverage report and warns if any Arabic token was left untranslated.

## 🎨 Customizing

| What | Where |
| --- | --- |
| Brand name, tagline, city, Facebook, currency | top of `scripts/generate-menu.py` (`out["brand"]`) → re-run |
| Theme colors, fonts, textures | `src/index.css` (`@theme` block) |
| UI strings / translations | `src/i18n/strings.ts` |
| Opening hours | `hoursValue` in `src/i18n/strings.ts` |
| Featured items | `FEATURED` list in `scripts/generate-menu.py` |

## 🌍 Deploying

It's a fully static site — `npm run build` and host the `dist/` folder anywhere
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, any static host). No backend needed.

---

Made with love in Basra · طازج كل يوم
