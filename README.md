# akanksha.co

Personal research blog. Jekyll + GitHub Pages.

## Deploy

```bash
# From your akanksha-site directory:
# 1. Delete everything except .git
# 2. Copy all files from this package
# 3. Push

cd /Users/akankshasrivastava/Documents/akanksha-site
find . -not -path './.git/*' -not -name '.git' -not -name '.' -delete
# Then copy files in, then:
git add -A
git commit -m "full site rebuild with all features"
git push
```

## CMS Login

Go to https://akanksha.co/admin/ and click "Login with GitHub".

If the CMS shows a blank screen, you may need to add your Netlify site ID:
1. Go to Netlify → Project configuration → General → Site ID
2. Add `site_id: YOUR_SITE_ID` under `backend:` in `admin/config.yml`

## Content

- `_writing/` — All pieces (poems, essays, research, notes)
- `_data/currently.yml` — "Currently reading/obsessing/listening"
- `_data/littleone.yml` — A's quotes
- `_data/about.yml` — About page fragments
- `_data/sketchbook.yml` — Art entries
- `_data/timeline.yml` — Monthly timeline entries

## Adding content

Create a new `.md` file in `_writing/` with front matter:

```yaml
---
title: "Your Title"
type: poem          # poem/essay/fiction/note/observation/paper review/explainer/research log
section: writing    # research/writing/notes
order: 12           # lower = higher in spine
visible: false      # true to show content, false for locked
locked_note: "still working on this"
margin_notes: []
crosslinks: []
---

Your content here in markdown.
```
