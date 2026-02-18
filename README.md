# akanksha.co

Personal writing site. Notebook aesthetic. Jekyll + GitHub Pages.

---

## Your workflow

### Publish a new piece

1. Create a new file in `_writing/` (e.g., `_writing/the-fog-and-the-dust.md`)
2. Add this at the top:

```
---
title: "The Fog and the Dust"
type: essay
order: 5
visible: true
locked_note: ""
---

Your content here. Just write in paragraphs.
```

3. Push to GitHub. Site rebuilds in ~1 minute.

### Types you can use
`poem`, `essay`, `fiction`, `note`, `observation`, `paper review`, `explainer`, `research log`, `letter`, `sketch`, `photograph`

### Add a piece but keep it locked (coming soon)

Same as above but set `visible: false` and add a margin note:
```
visible: false
locked_note: "this one's still brewing"
```

### Unlock an existing piece

Open the `.md` file, change `visible: false` to `visible: true`, add content below the `---`, push.

### Writing poems

End each line with two spaces (invisible but necessary for line breaks).  
Blank lines between stanzas.

```
From flicker to fire, with heedless fervour  
Toying with fate, their first autumn in Pilani  

He braided poetry into her wind kissed hair  
To the rhythm of the warbling bulbuls of Pilani  
```

### Add an image

1. Drop the image in `assets/images/`
2. In your markdown: `![description](/assets/images/filename.jpg)`

### Add a new month to the timeline

Edit `_data/timeline.yml`. Add to the top:
```
- month: "Mar 2026"
  tags: ["poem", "note", "photograph"]
```

### Change the order of pieces in the spine

Change the `order` number in the front matter. Lower numbers appear first.

---

## Quick push (from Terminal)

```
cd /Users/akankshasrivastava/Documents/akanksha-site
git add .
git commit -m "new post"
git push
```

Site updates in ~1 minute.

---

## File structure

```
_writing/           ← your content lives here (one .md file per piece)
_data/timeline.yml  ← monthly timeline entries
_layouts/           ← site template (don't touch unless redesigning)
assets/css/         ← styles
assets/js/          ← interaction logic
assets/images/      ← photos, art, sketches
```
