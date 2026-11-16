# CactuShop

Responsive cactus-shop student project built with Express and Handlebars.

## Run locally

```bash
npm install
node app.js
```

Open http://localhost:3000.

## Pages

- `/` — home page with the flowering cactus logo, four cactus categories, introduction and **Shop Now** link.
- `/shop` — searchable cactus catalogue; filter with `?category=Round`, `?category=Tall`, `?category=Sharp` or `?category=Columnar`.
- `/product/:id` — product detail with an Add to Cart button.
- `/cart` — cart stored in the browser's localStorage.
- `/contact` — contact information placeholder.
- `/checkout` — demonstration placeholder (no payment processing).

## Project files

- `views/` — Handlebars page templates.
- `views/partials/_nav.hbs` — responsive header and slide-out menu.
- `public/css/styles.css` — colours, layout and responsive breakpoints.
- `public/js/navigation.js` — open/close interactions for the menu.
- `public/js/cart.js` — cart functionality.
- `data/products.json` — editable product catalogue.
- `public/images/` — original SVG illustrations used as temporary product artwork.

## Responsive design

Mobile: compact category tiles and a two-column shop grid.
Tablet: three-column shop grid and wider sections.
Desktop: spacious hero, category row, three-column shop grid and slide-out menu.

## AI usage acknowledgement

AI tools assisted with creating the visual wireframe concept and preparing parts of the initial website implementation, including SVG placeholder illustrations. The site should be reviewed, customised and tested before submission. Replace placeholder artwork and any temporary shop content as needed.

## Note

The checkout page is illustrative only. This is not a real payment-enabled store.
