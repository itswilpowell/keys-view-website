# Keys View Construction Group — Website

Static website for [thekeysview.com](https://thekeysview.com), hosted on GitHub Pages. No build step: every file here is served as-is.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home page (process timeline) |
| `services.html` | Services + permit & violation checker |
| `projects.html` | Projects with before/after slider and filters |
| `contact.html` | Estimate request form |
| `css/styles.css` | Shared styles and brand colors |
| `js/main.js` | Interactive pieces: timeline, checker, slider, form |
| `images/` | Illustrations, logo mark and favicon |
| `CNAME` | Tells GitHub Pages to serve the site at thekeysview.com |

## Things to fill in

Search the HTML files for square brackets, e.g. `[PHONE]`, `[LICENSE #]`, `[SERVICE AREA]`, `[OFFICE HOURS]`, `[RESPONSE TIME]`, and the project names in `js/main.js`.

## Swapping in real photos

Put the photo in `images/` and change the `src="images/..."` that points at the illustration. For project before/after pairs, edit the `P` list near the "Projects" section of `js/main.js`.

## Turning on the estimate form

The form posts to [Formspree](https://formspree.io). Create a free form there, then in `contact.html` replace `YOUR_FORM_ID` in `action="https://formspree.io/f/YOUR_FORM_ID"` with your form's ID. Until then the form shows the thank-you message without sending anything.

## Brand

Navy `#10243A` · Gold `#C5A059` · Gold text on white `#8A6A2B` · Emerald `#0B6655` · Slate `#1C2226`.
Fonts: Bebas Neue (headlines), Montserrat (labels, buttons), Open Sans (body).
