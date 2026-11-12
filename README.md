# PULSE — Personal Fitness Dashboard

A responsive, installable PWA built with plain HTML, CSS and JavaScript.

## Files

- `index.html` — app structure
- `styles.css` — responsive dark-navy and white design
- `app.js` — navigation, workout plans, habits and local progress
- `manifest.json` — installable app metadata
- `service-worker.js` — offline app-shell cache
- `icons/` — app icons

## Run locally

Because service workers require HTTPS or localhost, use a local development server rather than opening `index.html` directly.

With Python installed, open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish free with GitHub Pages

1. Create a GitHub repository named `pulse-dashboard`.
2. Upload the contents of this folder to the repository root (not the enclosing folder).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for the deployment, then open the Pages URL shown there.

The repository must be public when using GitHub Free for Pages.

## Install on iPad

1. Open the published HTTPS site in Safari.
2. Tap Share.
3. Choose **Add to Home Screen**.
4. Confirm Add.

On desktop, supported browsers may offer an install icon in the address bar or an install option in the browser menu.

## Progress and privacy

- Habits, selected programme week and theme are saved in that browser/device using `localStorage`.
- Data is not synchronized between devices.
- Use **Export my data** in the footer to download a JSON backup.
- Clearing browser website data can erase saved progress. Keep an exported backup if you want one.
- No account, analytics, calorie counter or body-measurement tracking is included.

## Notes

- Google Fonts are loaded from an external service when online; system fonts are used as fallback.
- The service worker caches the app shell for offline use after the first successful online visit.
- The workout and meal content is general wellness information, not medical advice or a personalized training prescription.
