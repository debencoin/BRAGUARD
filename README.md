# BRAGUARD™

Responsive storefront for BRAGUARD, the padded sports bra built for women's flag football.

Plain HTML, CSS and JavaScript. No build step.

## Preview locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Responsive layout

- **Desktop (over 960px):** Full navigation, side-by-side product gallery and details, two-column content sections.
- **Tablet (761–960px):** Gallery stacks above product details.
- **Mobile (760px and under):** Hamburger menu, bottom-aligned hero, full-width buttons, larger color swatches for tapping, stacked footer.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `style.css` | Styles and breakpoints |
| `app.js` | Color carousel, swatches, slideshow, mobile menu, checkout button |
| `checkout.js` | Stripe Payment Links |
| `assets/` | Logo, hero image, 10 colorway photos and spotlight media |

## Enable checkout

Add your live Stripe Payment Links in `checkout.js`, keyed by the exact color name and size, for example `"Royal Blue|M"`. Set up each link in Stripe for the right variant at $49.99 USD. Payment Links are public URLs; never put Stripe secret keys in this repo. Until a link is added, checkout shows a pending message.

## Deploy

Any static host works. For GitHub Pages: **Settings › Pages › Deploy from a branch › `main` / root**.
