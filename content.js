// ═══════════════════════════════════════════════════
// CONTENT DATA — Edit this file to add/unlock content
// ═══════════════════════════════════════════════════

// ── NAMED PIECES (top of spine) ──
// Set visible: true to unlock a piece, then add content
const NAMED_PIECES = [
  {
    id: "note-light-pollution",
    type: "note",
    title: "On light pollution",
    visible: false,
    lockedNote: "half a thought. the other half is coming",
    content: null,
  },
  {
    id: "essay-reverse-migration",
    type: "essay",
    title: "Reverse Migration",
    visible: false,
    lockedNote: "still finding the words",
    content: null,
  },
  {
    id: "fiction-blue-hour",
    type: "fiction",
    title: "The Blue Hour",
    visible: true,
    lockedNote: null,
    content: `The light in the room had turned that particular shade of grey-blue that Antara had always loved and Rajeev had never noticed. She used to point it out to him — look, that colour, right before the streetlights come on — and he would glance up from whatever he was reading and say yes, beautiful, without seeing it at all.

But today is his birthday.

She knows this the way she knows the monsoon is coming before the first drop falls — in her body, before her mind catches up. She had been pouring tea, the kettle tilted at exactly the angle her mother used, and something in the quality of the afternoon light had stopped her hand mid-pour.

Tap. Tap. Tap.

The drip from the kitchen faucet she keeps meaning to fix. Three months now. It has become a kind of metronome for her solitude — measuring out the seconds between one thought and the next.

She remembers the road trip. The one where they drove fourteen hours to see a place she read about once, in a book Rajeev loved — a place where the desert met the sea and the sky couldn't decide which one to be. They arrived at dusk. The whole world was that blue-grey colour and Rajeev had finally seen it. Had stood there with his mouth slightly open like a child encountering snow.

That was the version of him she had married. The one capable of being stunned.

Tap. Tap. Tap.

Antara sets down the kettle. Walks to the window. The city below is doing what cities do at this hour — shifting registers, trading the sharp brass of daytime for something softer, more forgiving. Offices emptying. Headlights beginning to move in slow streams. Somewhere, someone is heating oil for pakoras and the smell is rising six floors to reach her.

She wonders if he still reads. If he still turns pages with that particular violence — not impatience, but hunger, as though the book might close itself if he didn't get through it fast enough.

It is a code without a cipher.

She could call. She has the number. It sits in her phone under a name she changed three times — first his name, then his initials, then just a single letter that could stand for anything. K. For a while she considered deleting it entirely, but that seemed like the kind of decisive gesture she had never been good at.

The blue hour is ending. She can feel it — the way you feel a conversation ending before the last word is spoken. The streetlights will come on and the magic will break and it will just be Tuesday evening in a city of twenty million people, each of them carrying some version of this weight.

Tap. Tap. Tap.

She picks up the phone. Puts it down. Picks it up again.

The light shifts. The streetlights stutter on, one by one, like a sentence being written across the dark.

But today, she steps off the path.

She dials.

It rings once. Twice. Three times. She counts the rings the way she counted the drips — not because the number matters, but because counting is what you do when you're trying not to feel the thing that's happening.

Four. Five.

The blue is gone now. The room is just a room. The light is just light. And Antara is just a woman holding a phone in a city that doesn't know her name, listening to a sound that might be the beginning of something or might be the echo of something that ended long ago.

She stays on the line.

Tap. Tap. Tap.`,
  },
  {
    id: "poem-echoes",
    type: "poem",
    title: "Echoes of Pilani",
    visible: true,
    lockedNote: null,
    content: `The wind still carries your name
through corridors I left behind—
past Gulmohar trees dropping
their quiet, flame-coloured grief
onto paths we wore thin
with wanting.

Nutan bazaars at dusk,
hawkers crying hoarse
over pyramids of glass bangles
that caught the last light
and held it
the way I held your gaze—
briefly, desperately,
knowing it would shatter.

The warbling bulbul
hasn't changed its song.
The yellowing leaves
still curl the same way—
inward, like a fist
learning to let go.

I left Pilani
the way one leaves a dream—
mid-sentence,
the ending still writing itself
somewhere in the dust
between the library
and the sky.`,
  },
];

// ── MONTHLY TIMELINE ──
// Add new months at the top. Tags: poem, essay, note, fiction,
// observation, research log, paper review, explainer, sketch,
// photograph, letter
const TIMELINE = [
  { month: "Feb 2026", tags: ["note", "research log"] },
  { month: "Jan 2026", tags: ["observation", "photograph"] },
  { month: "Dec 2025", tags: ["essay", "poem"] },
  { month: "Oct 2025", tags: ["note", "paper review"] },
  { month: "Aug 2025", tags: ["research log", "photograph", "note"] },
  { month: "Jun 2025", tags: ["explainer", "note"] },
  { month: "May 2025", tags: ["poem", "observation"] },
  { month: "Feb 2025", tags: ["paper review", "note", "letter"] },
  { month: "Oct 2024", tags: ["note", "photograph"] },
  { month: "Aug 2024", tags: ["essay", "observation"] },
  { month: "Jun 2024", tags: ["explainer", "note"] },
  { month: "Apr 2024", tags: ["poem", "letter"] },
  { month: "Jan 2024", tags: ["note", "research log"] },
  { month: "Nov 2023", tags: ["observation", "note"] },
  { month: "Sep 2023", tags: ["essay", "photograph"] },
  { month: "Jul 2023", tags: ["note", "observation"] },
  { month: "Mar 2023", tags: ["poem", "note", "letter"] },
  { month: "Dec 2022", tags: ["note", "photograph"] },
  { month: "Oct 2022", tags: ["essay", "observation"] },
  { month: "Aug 2022", tags: ["poem", "sketch", "note"] },
  { month: "Jul 2022", tags: ["note", "photograph"] },
  { month: "Jun 2022", tags: ["poem", "essay", "letter"] },
  { month: "May 2022", tags: ["poem", "note"] },
];

// ── LOCKED MESSAGES (for timeline entries — past tense, already written) ──
const TIMELINE_MESSAGES = [
  "not hiding it — just holding it a little longer",
  "this one keeps rewriting itself",
  "yours, when I'm ready",
  "I'll open this page when it's time",
  "this one's still with me",
  "it's here. just not yet",
  "some pages stay folded a little longer",
  "written. not ready to let go",
];

// ── GHOST TEXT BLOCKS (blurred background text for locked pages) ──
const GHOST_BLOCKS = [
  [
    "The morning came in sideways through the kitchen window",
    "and landed on the counter where yesterday's chai",
    "had left a ring like a small brown planet.",
    "",
    "She picked up the cup and held it the way",
    "her mother used to hold letters from home —",
    "with both hands, as if the thing might",
    "fly away if she wasn't careful.",
    "",
    "Outside, the auto driver was arguing",
    "with someone about a fare that seemed",
    "unreasonable to both of them for",
    "entirely different reasons.",
    "",
    "There is a particular quality of light",
    "in Hyderabad at ten in the morning",
    "that makes everything look like it was",
    "painted by someone who had just",
    "fallen in love and couldn't",
    "stop telling you about it.",
  ],
  [
    "I keep a list of things I've lost to cities —",
    "a grey scarf in a cab on Market Street,",
    "the ability to sleep without a fan,",
    "the phone number of the man",
    "who fixed our washing machine in Seattle.",
    "",
    "San Francisco took the most from me",
    "or maybe I left the most there.",
    "It's hard to tell the difference",
    "when you're the one who moved.",
    "",
    "The fog is the thing people always mention",
    "and they're right to mention it.",
    "It comes in like a secret being kept",
    "from the rest of California —",
    "cool and conspiratorial and damp",
    "on your skin at seven in the morning.",
    "",
    "I never drove there. Thirteen years",
    "and in SF I walked or took the bus",
    "like someone who believed",
    "the city owed her slowness.",
  ],
  [
    "A asked me yesterday what I'm studying",
    "and I said I'm trying to understand",
    "how machines learn to think.",
    "",
    "He said do they have brains",
    "and I said sort of,",
    "and he said are their brains",
    "squishy like mine",
    "and I said no, theirs are made of math.",
    "",
    "He thought about this for a while",
    "and then said that sounds boring",
    "and went back to his Legos.",
    "",
    "It was the most honest peer review",
    "I have received in months.",
  ],
  [
    "The campus at night is a different country.",
    "The same buildings that feel institutional",
    "by day become something softer",
    "when the light is gone and",
    "the only sound is someone's",
    "code compiling three floors up.",
    "",
    "I found the library stays open",
    "until midnight on Thursdays.",
    "There's a corner on the second floor",
    "where the AC doesn't reach",
    "and the window looks out",
    "onto a neem tree that",
    "nobody else seems to notice.",
    "",
    "I've started thinking of it as mine.",
    "This is how you build a life somewhere —",
    "you claim a corner, a tree, a route",
    "and slowly the place",
    "starts to recognize your weight.",
  ],
  [
    "The gradient doesn't care",
    "about your intentions.",
    "It flows where the loss surface",
    "tells it to flow,",
    "which is both the beauty",
    "and the frustration of the thing.",
    "",
    "I spent three weeks convinced",
    "the bug was in my reward model",
    "before realizing it was in",
    "how I was batching the data.",
    "",
    "There is a lesson here about",
    "looking at the obvious thing first",
    "but I refuse to learn it",
    "because the obvious thing",
    "is never where the interesting",
    "problems hide.",
  ],
  [
    "Dravid batted the way some people pray —",
    "with the whole body, quietly,",
    "as if the act itself was the point",
    "and the scoreboard was someone else's",
    "problem entirely.",
    "",
    "I tried to explain this to someone once",
    "and they said you mean he was boring",
    "and I said no I mean he was",
    "the only honest one out there",
    "and they said same thing",
    "and I said it really isn't.",
  ],
];
