# Doska — oʻzbek tilidagi onlayn doska

Doska is a hand-drawn style online whiteboard for Uzbek speakers. It is a fork of [Excalidraw](https://github.com/excalidraw/excalidraw) (MIT licence), based on upstream commit `7ded689`.

## What's different from Excalidraw

- **Uzbek by default.** Full Uzbek translation, both Latin (`uz-UZ`, default) and Cyrillic (`uz-Cyrl-UZ`). The browser language is ignored. Users change the language from the menu, or with `?lng=en` in the URL.
- **Uzbek glyphs in the hand-drawn font.** Excalifont has no `ʻ` (in oʻ/gʻ) or `Ғ ғ Қ қ Ҳ ҳ`, so they used to fall back to another font. An add-on subset built from Excalifont's own strokes fills the gap: `packages/excalidraw/fonts/Excalifont/Excalifont-Regular-c8979…woff2`.
- **Arabic letters in the hand-drawn font.** Arabic text typed on the board uses [Playpen Sans Arabic](https://github.com/TypeTogether/Playpen-Sans) (SIL OFL 1.1), a handwriting font cut down to Arabic letters at a weight that matches Excalifont. It's embedded in SVG exports too.
- **Doska branding.** Name, logo, icons, page meta and PWA manifest are Doska's. Excalidraw+ promos, sign-up links and social links are removed.
- **Boards + Doska Pro.** The free plan has 1 board. "Yangi doska" (New board) opens the Pro dialog. Pro users can create unlimited boards and switch between them in the main menu.

## Doska Pro: what you still need to do

The Pro gate is **UI only** for now. `isProUser()` in `excalidraw-app/doska/boards.ts` reads a `doska-pro` flag from localStorage, and users can edit that. Before taking payments:

1. Set up a checkout (Payme / Click / Uzum, or a Telegram bot), then set `VITE_APP_DOSKA_PRO_CHECKOUT_URL` in `.env.production`. Until then the dialog says "Toʻlov tez orada ishga tushadi" (payments coming soon).
2. Add accounts and a server that confirms payment (for example, a payment webhook that issues a signed token). Replace `isProUser()` with a check against that server.
3. Set your price in `excalidraw-app/doska/config.ts` (`PRO_PRICE`, currently 49 000 soʻm/oy as a placeholder) and the free limit (`FREE_BOARD_LIMIT`).

## Still pointing at Excalidraw's servers

`.env.production` still uses Excalidraw's hosted services for live collaboration (`VITE_APP_WS_SERVER_URL`, Firebase), shareable links (`json.excalidraw.com`), the public library and the AI backend. Before a public launch, run your own instances ([excalidraw-room](https://github.com/excalidraw/excalidraw-room), your own Firebase project) or turn those features off.

## Hosting

Every push to `main` builds the app and deploys it to GitHub Pages (`.github/workflows/deploy-pages.yml`), at https://umidjonanalytics.github.io/doska/. GitHub Pages' terms don't allow sites that mainly sell software as a service, so move to a host that allows commercial use (for example Cloudflare Pages) before taking Pro payments. For a custom domain, build with `--base /` instead of `--base /doska/`.

## Development

```bash
yarn install
yarn start            # dev server
yarn build:app        # production build in excalidraw-app/build
yarn test:typecheck && yarn test:app --watch=false
```

Rebuilding the Uzbek files:

```bash
# Cyrillic locale from the Latin source (uz-UZ.json is the hand-edited file)
python3 -I scripts/build-uzbek-locales.py packages/excalidraw/locales/uz-UZ.json \
  packages/excalidraw/locales/en.json packages/excalidraw/locales

# Excalifont Uzbek glyph add-on (needs: pip install fonttools brotli)
python3 scripts/build-uzbek-font.py \
  packages/excalidraw/fonts/Excalifont/Excalifont-Regular-a88b72a24fb54c9f94e3b5fdaa7481c9.woff2 \
  packages/excalidraw/fonts/Excalifont/Excalifont-Regular-b9dcf9d2e50a1eaf42fc664b50a3fd0d.woff2 \
  out.woff2
```

## Licence

MIT. See [LICENSE](LICENSE). Excalidraw's copyright notice must stay. Excalifont is under the SIL Open Font License. The original Excalidraw README is in [README.excalidraw.md](README.excalidraw.md).
