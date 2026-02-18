# akanksha.co

Personal writing site. Dark notebook aesthetic. GitHub Pages.

## How to update content

Everything lives in `js/content.js`. Open it and:

### Unlock a named piece
Find the piece in `NAMED_PIECES`, set `visible: true`, and add the `content` string.

### Add a new named piece
Add an entry to the top of `NAMED_PIECES`:
```js
{
  id: "unique-slug",
  type: "poem",           // poem, essay, fiction, note, observation
  title: "Your Title",
  visible: true,           // false = locked with margin note
  lockedNote: null,        // or "your margin note" if locked
  content: `Your content here...`,
},
```

### Add a timeline month
Add to the top of `TIMELINE`:
```js
{ month: "Mar 2026", tags: ["poem", "note", "photograph"] },
```

### Change a locked message
Edit `lockedNote` on named pieces, or edit `TIMELINE_MESSAGES` for the rotating timeline messages.

## Deploying

Push to `main` branch. GitHub Pages serves from root. Domain: akanksha.co (CNAME file included).

## File structure

```
index.html          — single page
css/style.css       — all styles
js/content.js       — all content data (edit this)
js/main.js          — interaction logic
CNAME               — custom domain
```
