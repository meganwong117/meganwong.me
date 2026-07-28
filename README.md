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

Two halves — DNS at GoDaddy, and Pages on GitHub. They're independent, so do the
DNS first: propagation is the slowest part.

#### 1. GoDaddy DNS

Sign in → **My Products** → your domain → **DNS** (or ⋮ → **Manage DNS**).

**Edit GoDaddy's default parked `A` record on `@` rather than adding alongside
it.** GoDaddy pre-creates an `A` record pointing at one of its parking IPs, and
leaving it in place is the most common reason this doesn't work — requests keep
landing on the parking page. Delete it or change its value.

Target state:

| Type  | Name  | Value                   | TTL     |
| ----- | ----- | ----------------------- | ------- |
| A     | `@`   | `185.199.108.153`       | 600 sec |
| A     | `@`   | `185.199.109.153`       | 600 sec |
| A     | `@`   | `185.199.110.153`       | 600 sec |
| A     | `@`   | `185.199.111.153`       | 600 sec |
| CNAME | `www` | `meganwong117.github.io`| 600 sec |

Four `A` records sharing the name `@` is correct — they're GitHub's four Pages
servers, and the redundancy is what keeps the site up if one goes down. GoDaddy
permits duplicate names on `A` records.

IPv6 is optional but free and helps visitors on mobile networks:

| Type | Name | Value                 |
| ---- | ---- | --------------------- |
| AAAA | `@`  | `2606:50c0:8000::153` |
| AAAA | `@`  | `2606:50c0:8001::153` |
| AAAA | `@`  | `2606:50c0:8002::153` |
| AAAA | `@`  | `2606:50c0:8003::153` |

Keep TTL at 600 seconds during setup so mistakes are cheap to correct. Raise it
to an hour once the site is confirmed working.

**GoDaddy-specific traps**

- **Domain Forwarding** (Domain Settings → Forwarding) injects its own `A` record
  that competes with these. Turn it off.
- **Websites + Marketing** — if the domain is attached to GoDaddy's site builder,
  that product overrides your DNS records. Disconnect the domain from it.
- **No CNAME on `@`.** GoDaddy's free DNS has no ALIAS/ANAME support, and a CNAME
  at the apex is invalid DNS regardless. The four `A` records are the answer.
- GoDaddy shows the apex as `@`, meaning `meganwong.me` itself.

#### 2. Turn Pages on

Repo → **Settings** → **Pages** → **Source: GitHub Actions**

The `CNAME` file in this repo sets the custom domain automatically on first
deploy. Confirm **Settings → Pages** shows `meganwong.me`; add it by hand if not.

#### 3. Enforce HTTPS

Once DNS resolves, GitHub issues a free certificate and the **Enforce HTTPS**
checkbox becomes available. It stays greyed out until the certificate lands —
usually minutes, occasionally up to an hour.

Worth doing eventually: **Settings → Pages → Verify domain** adds a TXT record
that protects against domain takeover if the site ever moves off GitHub.

### Checking it worked

```sh
dig +short meganwong.me                          # expect: the four 185.199.x.153 addresses
curl -sSI https://meganwong.me/ | head -1        # expect: HTTP/2 200
curl -sSI http://meganwong.me/ | head -1         # expect: a 301 to https
curl -sSI https://www.meganwong.me/ | head -1    # expect: a 301 to the apex
```

| Symptom                                       | Cause                                          |
| --------------------------------------------- | ---------------------------------------------- |
| GitHub-branded "There isn't a Pages site here" | DNS is right; Pages isn't publishing           |
| GoDaddy parking page                           | A stale GoDaddy record survived                |
| Certificate warning                            | Cert still provisioning — wait, then try again |
