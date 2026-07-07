# Christof Wellan Portfolio

Static GitHub Pages portfolio for `chriswe12.github.io`.

The site is a no-build HTML/CSS page. Its structure is inspired by Ryan Fitzgerald's MIT-licensed DevPortfolio template, adapted into plain static files for this repository.

## License and attribution

Original code in this repository is licensed under the MIT License. See `LICENSE`.

Third-party attribution and reuse notices are listed in `NOTICE`.

## Structure

- `index.html` is the main projects/profile page.
- `styles.css` contains all responsive styling.
- `script.js` keeps the footer year current.
- `404.html` is the GitHub Pages fallback page.
- `.nojekyll` tells GitHub Pages to serve the files directly.


## Analytics

The site has a shared Google Analytics 4 loader in `script.js`. To enable page-view, geography, click, scroll-depth, and time-on-page reporting, create a GA4 web stream and set `analyticsConfig.googleAnalyticsMeasurementId` to its `G-...` Measurement ID.

Tracking is disabled until that ID is configured. Localhost and direct `file://` views are ignored by default; set `trackLocalhost` to `true` only when testing analytics locally. Visitors can opt out in the browser console with `localStorage.setItem("analytics-opt-out", "true")`.
