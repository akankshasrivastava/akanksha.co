// ═══════════════════════════════════════════════════
// akanksha.co — main interaction logic
// ═══════════════════════════════════════════════════

(function () {
  "use strict";

  // ── State ──
  // Default to the last visible named piece (usually the poem)
  var defaultId = "echoes-of-pilani";
  for (var i = 0; i < NAMED_PIECES.length; i++) {
    if (NAMED_PIECES[i].visible) { defaultId = NAMED_PIECES[i].id; }
  }
  var activeItem = { kind: "named", id: defaultId };
  var isTransitioning = false;

  // ── Locked page messages ──
  var TIMELINE_MESSAGES = [
    "not hiding it — just holding it a little longer",
    "this one keeps rewriting itself",
    "yours, when I'm ready",
    "I'll open this page when it's time",
    "this one's still with me",
    "it's here. just not yet",
    "some pages stay folded a little longer",
    "written. not ready to let go"
  ];

  // ── Ghost text blocks ──
  var GHOST_BLOCKS = [
    [
      "The morning came in sideways through the kitchen window",
      "and landed on the counter where yesterday's coffee",
      "had left a ring like a small brown planet.",
      "",
      "She picked up the cup and held it the way",
      "her mother used to hold letters from home —",
      "with both hands, as if the thing might",
      "fly away if she wasn't careful.",
      "",
      "Outside, the autowala was arguing",
      "with someone about a fare that seemed",
      "unreasonable to both of them for",
      "entirely different reasons.",
      "",
      "There is a particular quality of light",
      "in Hyderabad at ten in the morning",
      "that makes everything look like it was",
      "painted by someone who had just",
      "fallen in love and couldn't",
      "stop telling you about it."
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
      "I never drove there. Ten years",
      "and in SF I walked or took the bus",
      "like someone who believed",
      "the city owed her slowness."
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
      "I have received in months."
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
      "starts to recognize your weight."
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
      "problems hide."
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
      "and I said it really isn't."
    ]
  ];

  // ── Helpers ──
  function hashString(str, salt) {
    var hash = 0;
    var s = str + (salt || "");
    for (var i = 0; i < s.length; i++) {
      hash = (hash * 31 + s.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  function getTimelineMessage(month) {
    return TIMELINE_MESSAGES[hashString(month) % TIMELINE_MESSAGES.length];
  }

  function getGhostBlock(seed) {
    return GHOST_BLOCKS[hashString(seed, "ghost") % GHOST_BLOCKS.length];
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Spine rendering ──
  function renderSpine() {
    var container = document.getElementById("spine-entries");
    if (!container) return;

    var html = '<div class="named-pieces">';

    NAMED_PIECES.forEach(function (entry) {
      var isActive = activeItem.kind === "named" && activeItem.id === entry.id;
      var dotClass = "named-dot" + (isActive ? " active" : entry.visible ? " visible" : "");
      var titleClass = "named-title" + (isActive ? " active" : entry.visible ? " visible" : "");
      var typeClass = "named-type" + (isActive ? " active" : "");

      html += '<div class="named-entry" data-kind="named" data-id="' + entry.id + '">' +
        '<div class="' + dotClass + '"></div>' +
        '<div><div class="' + titleClass + '">' + entry.title + '</div>' +
        '<span class="' + typeClass + '">' + entry.type + '</span></div></div>';
    });

    html += '</div>';
    html += '<div class="spine-separator"><div class="spine-separator-dot"></div><div class="spine-separator-line"></div></div>';
    html += '<div class="timeline-entries">';

    TIMELINE.forEach(function (entry) {
      var isActive = activeItem.kind === "timeline" && activeItem.id === entry.month;
      var dotClass = "timeline-dot" + (isActive ? " active" : "");
      var monthClass = "timeline-month" + (isActive ? " active" : "");
      var tagsClass = "timeline-tags" + (isActive ? " active" : "");

      html += '<div class="timeline-entry" data-kind="timeline" data-id="' + entry.month + '">' +
        '<div class="timeline-dot-wrap"><div class="' + dotClass + '"></div></div>' +
        '<div><span class="' + monthClass + '">' + entry.month + '</span>' +
        '<span class="' + tagsClass + '">' + entry.tags.join(", ") + '</span></div></div>';
    });

    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll("[data-kind]").forEach(function (el) {
      el.addEventListener("click", function () {
        handleNavigation(this.dataset.kind, this.dataset.id);
      });
    });
  }

  // ── Ghost text rendering ──
  function renderGhostLines(lines) {
    return lines.map(function (line) {
      return line === ""
        ? '<div class="ghost-break"></div>'
        : '<div class="ghost-line">' + escapeHtml(line) + '</div>';
    }).join("");
  }

  // ── Page rendering ──
  function renderPage() {
    var container = document.getElementById("notebook-inner");
    if (!container) return;

    var html = "";

    if (activeItem.kind === "named") {
      var entry = null;
      for (var i = 0; i < NAMED_PIECES.length; i++) {
        if (NAMED_PIECES[i].id === activeItem.id) { entry = NAMED_PIECES[i]; break; }
      }
      if (!entry) return;

      if (entry.visible) {
        var bodyClass = "page-body" + (entry.isPoem ? " poem" : "");
        html = '<span class="page-type">' + entry.type + '</span>' +
          '<h2 class="page-title">' + entry.title + '</h2>' +
          '<div class="page-divider"></div>' +
          '<div class="' + bodyClass + '">' + entry.contentHtml + '</div>';
      } else {
        var ghostLines = getGhostBlock(entry.id);
        var ghostHtml = renderGhostLines(ghostLines);
        html = '<span class="locked-type">' + entry.type + '</span>' +
          '<h2 class="locked-title">' + entry.title + '</h2>' +
          '<div class="locked-divider"></div>' +
          '<div class="ghost-area"><div class="ghost-text">' + ghostHtml + '</div>' +
          '<div class="margin-note-wrap"><div class="margin-note">' +
          '<span>' + entry.lockedNote + '</span></div></div></div>';
      }
    } else {
      var tEntry = null;
      for (var j = 0; j < TIMELINE.length; j++) {
        if (TIMELINE[j].month === activeItem.id) { tEntry = TIMELINE[j]; break; }
      }
      if (!tEntry) return;

      var message = getTimelineMessage(tEntry.month);
      var tGhostLines = getGhostBlock(tEntry.month);
      var tGhostHtml = renderGhostLines(tGhostLines);
      var tagsHtml = tEntry.tags.map(function (tag, i) {
        return '<span>' + tag + '</span>' +
          (i < tEntry.tags.length - 1 ? '<span class="tag-separator">·</span>' : '');
      }).join("");

      html = '<span class="timeline-page-month">' + tEntry.month + '</span>' +
        '<div class="timeline-page-tags">' + tagsHtml + '</div>' +
        '<div class="timeline-page-divider"></div>' +
        '<div class="ghost-area"><div class="ghost-text">' + tGhostHtml + '</div>' +
        '<div class="margin-note-wrap"><div class="margin-note timeline">' +
        '<span>' + message + '</span></div></div></div>';
    }

    container.innerHTML = html;
  }

  // ── Navigation ──
  function handleNavigation(kind, id) {
    if (activeItem.kind === kind && activeItem.id === id) return;
    if (isTransitioning) return;

    isTransitioning = true;
    var content = document.getElementById("notebook-inner");
    if (content) content.classList.add("transitioning");

    setTimeout(function () {
      activeItem = { kind: kind, id: id };
      renderPage();
      renderSpine();
      if (content) {
        content.scrollTop = 0;
        content.classList.remove("transitioning");
      }
      isTransitioning = false;
    }, 230);
  }

  // ── Initialize ──
  function init() {
    renderSpine();
    renderPage();
    requestAnimationFrame(function () {
      setTimeout(function () {
        var spine = document.querySelector(".spine");
        var notebook = document.querySelector(".notebook-area");
        if (spine) spine.classList.add("loaded");
        if (notebook) notebook.classList.add("loaded");
      }, 100);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
