# meganwong.me

Personal website for Megan Wong. Plain static HTML and CSS — no build step, no
dependencies, no framework. Edit a file, push, it's live.

## Structure

```
index.html              Home — hero, about, work, CV teaser, contact
cv/index.html           Full CV
assets/css/style.css    All styling. Design tokens live at the top.
assets/js/main.js       Progressive enhancement only (nav, theme, reveals)
assets/img/favicon.svg  MW monogram
CNAME                   Binds the custom domain — do not delete
.nojekyll               Stops GitHub running Jekyll over the files
```

## Editing content

Anything still needing real content is marked `<!-- TODO: ... -->` in the HTML.
Search for `TODO` to find every one of them.

The main ones:

- **About copy** — `index.html`, the `#about` section
- **Projects** — `index.html`, the `#work` section. Copy a `<li class="card">`
  block per project and drop the `card--placeholder` class once it has real
  content.
- **CV roles** — `cv/index.html`. Copy a `<li class="role">` block per position,
  newest first.
- **LinkedIn URL** — appears in the footer of both pages and in both contact
  lists. Replacing every `https://www.linkedin.com/in/` covers all of them.

### Changing the look

Every colour, font, size and spacing value is a CSS custom property at the top of
`assets/css/style.css` under `1. Tokens`. Changing the palette means changing
five hex values, not hunting through rules. Dark mode is derived from the same
tokens in section 11.

### Adding a CV PDF

Drop the file at `assets/megan-wong-cv.pdf`, then uncomment the "Download PDF"
button — it's already written and commented out in both `index.html` (the `#cv`
section) and `cv/index.html` (the page header).

The CV page also has a print stylesheet, so **Print → Save as PDF** produces a
clean document with no nav, no colours and tight margins. That's a valid way to
generate the PDF in the first place.

## Running it locally

No tooling required:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server rather than opening the file
directly — the pages use root-relative paths (`/assets/...`) that only resolve
over HTTP.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the
repo root to GitHub Pages. No build, so a deploy takes under a minute.

### One-time setup

These need repo-owner and domain-registrar access.

**1. Turn Pages on**

Repo → **Settings** → **Pages** → **Source: GitHub Actions**

**2. Point the domain at GitHub**

At your domain registrar, add these DNS records for `meganwong.me`:

| Type  | Name  | Value                     |
| ----- | ----- | ------------------------- |
| A     | `@`   | `185.199.108.153`         |
| A     | `@`   | `185.199.109.153`         |
| A     | `@`   | `185.199.110.153`         |
| A     | `@`   | `185.199.111.153`         |
| CNAME | `www` | `meganwong117.github.io.` |

All four A records are needed — they're GitHub's Pages servers, and the
redundancy is what keeps the site up if one goes down.

**3. Attach the domain**

Repo → **Settings** → **Pages** → **Custom domain** → `meganwong.me` → Save.

GitHub will verify DNS (usually minutes, occasionally up to an hour). Once it
passes, tick **Enforce HTTPS** — the certificate is issued automatically and is
free.

### Checking it worked

```sh
curl -sSI https://meganwong.me/ | head -1        # expect: HTTP/2 200
curl -sSI http://meganwong.me/ | head -1         # expect: a 301 to https
curl -sSI https://www.meganwong.me/ | head -1    # expect: a 301 to the apex
```
