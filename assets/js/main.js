(function () {
  "use strict";

  // ═══════════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════════
  var activeSection = null;
  var activeItem = { kind: "named", id: getDefaultId() };
  var isTransitioning = false;

  function getDefaultId() {
    for (var i = NAMED_PIECES.length - 1; i >= 0; i--) {
      if (NAMED_PIECES[i].visible) return NAMED_PIECES[i].id;
    }
    return NAMED_PIECES.length ? NAMED_PIECES[0].id : "";
  }

  // ═══════════════════════════════════════════════════
  // Night Sky Mode
  // ═══════════════════════════════════════════════════
  function checkNightSky() {
    var hour = new Date().getHours();
    document.body.classList.toggle("night-sky", hour >= 18 || hour < 6);
  }

  // ═══════════════════════════════════════════════════
  // Locked page messages + ghost blocks
  // ═══════════════════════════════════════════════════
  var TIMELINE_MESSAGES = [
    "not hiding it \u2014 just holding it a little longer",
    "this one keeps rewriting itself",
    "yours, when I\u2019m ready",
    "I\u2019ll open this page when it\u2019s time",
    "this one\u2019s still with me",
    "it\u2019s here. just not yet",
    "some pages stay folded a little longer",
    "written. not ready to let go"
  ];

  var GHOST_BLOCKS = [
    ["The morning came in sideways through the kitchen window","and landed on the counter where yesterday\u2019s coffee","had left a ring like a small brown planet.","","She picked up the cup and held it the way","her mother used to hold letters from home \u2014","with both hands, as if the thing might","fly away if she wasn\u2019t careful.","","Outside, the autowala was arguing","with someone about a fare that seemed","unreasonable to both of them for","entirely different reasons."],
    ["I keep a list of things I\u2019ve lost to cities \u2014","a grey scarf in a cab on Market Street,","the ability to sleep without a fan,","the phone number of the man","who fixed our washing machine in Seattle.","","San Francisco took the most from me","or maybe I left the most there.","It\u2019s hard to tell the difference","when you\u2019re the one who moved."],
    ["A asked me yesterday what I\u2019m studying","and I said I\u2019m trying to understand","how machines learn to think.","","He said do they have brains","and I said sort of,","and he said are their brains","squishy like mine","and I said no, theirs are made of math.","","He thought about this for a while","and then said that sounds boring","and went back to his Legos.","","It was the most honest peer review","I have received in months."],
    ["The campus at night is a different country.","The same buildings that feel institutional","by day become something softer","when the light is gone and","the only sound is someone\u2019s","code compiling three floors up.","","I found the library stays open","until midnight on Thursdays.","There\u2019s a corner on the second floor","where the AC doesn\u2019t reach","and the window looks out","onto a neem tree that","nobody else seems to notice."],
    ["The gradient doesn\u2019t care","about your intentions.","It flows where the loss surface","tells it to flow,","which is both the beauty","and the frustration of the thing.","","I spent three weeks convinced","the bug was in my reward model","before realizing it was in","how I was batching the data."],
    ["Dravid batted the way some people pray \u2014","with the whole body, quietly,","as if the act itself was the point","and the scoreboard was someone else\u2019s","problem entirely.","","I tried to explain this to someone once","and they said you mean he was boring","and I said no I mean he was","the only honest one out there","and they said same thing","and I said it really isn\u2019t."]
  ];

  // ═══════════════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════════════
  function hashString(str, salt) {
    var hash = 0, s = str + (salt || "");
    for (var i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(hash);
  }
  function getTimelineMessage(m) { return TIMELINE_MESSAGES[hashString(m) % TIMELINE_MESSAGES.length]; }
  function getGhostBlock(s) { return GHOST_BLOCKS[hashString(s, "ghost") % GHOST_BLOCKS.length]; }
  function escapeHtml(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function getPieceById(id) { for (var i = 0; i < NAMED_PIECES.length; i++) { if (NAMED_PIECES[i].id === id) return NAMED_PIECES[i]; } return null; }
  function filterPieces(section) {
    if (!section) return NAMED_PIECES;
    return NAMED_PIECES.filter(function (p) { return p.section === section; });
  }
  function renderGhostLines(lines) {
    return lines.map(function (l) {
      return l === "" ? '<div class="ghost-break"></div>' : '<div class="ghost-line">' + escapeHtml(l) + '</div>';
    }).join("");
  }

  // ═══════════════════════════════════════════════════
  // Currently + Li'l one says
  // ═══════════════════════════════════════════════════
  function renderCurrently() {
    var w = document.getElementById("currently-wrap");
    if (!w) return;
    w.innerHTML =
      '<div class="currently">' +
      '<div class="currently-label">currently</div>' +
      '<div class="currently-item"><span class="currently-key">reading</span> ' + escapeHtml(CURRENTLY.reading) + '</div>' +
      '<div class="currently-item"><span class="currently-key">obsessing over</span> ' + escapeHtml(CURRENTLY.obsessing) + '</div>' +
      '<div class="currently-item"><span class="currently-key">listening to</span> ' + escapeHtml(CURRENTLY.listening) + '</div>' +
      '</div>';
  }

  function renderLittleone() {
    var w = document.getElementById("littleone-wrap");
    if (!w || !LITTLEONE.length) return;
    var idx = Math.floor(Math.random() * LITTLEONE.length);
    w.innerHTML =
      '<div class="littleone">' +
      '<div class="littleone-label">The li\u2019l one says</div>' +
      '<div class="littleone-quote">\u201C' + escapeHtml(LITTLEONE[idx]) + '\u201D</div>' +
      '</div>';
  }

  // ═══════════════════════════════════════════════════
  // Crosslinks
  // ═══════════════════════════════════════════════════
  function renderCrosslinks(links) {
    if (!links || !links.length) return "";
    var items = [];
    links.forEach(function (id) {
      var p = getPieceById(id);
      if (p) items.push('<a class="crosslink-item" data-id="' + p.id + '">' + p.title + '</a>');
    });
    if (!items.length) return "";
    return '<div class="crosslinks"><span class="crosslinks-label">see also</span>' + items.join('<span class="crosslinks-sep">\u00B7</span>') + '</div>';
  }

  // ═══════════════════════════════════════════════════
  // Corkboard About page
  // ═══════════════════════════════════════════════════
  function renderAbout() {
    var pinColors = ['#c4653a', '#8b6f47', '#a0522d', '#6b4226', '#7a5c3e'];

    function makePin(color) {
      return '<div class="pushpin" style="background:' + (color || pinColors[Math.floor(Math.random() * pinColors.length)]) + '"></div>';
    }

    function makeTape(angle) {
      var a = angle || (Math.random() * 10 - 5);
      return '<div class="tape-strip" style="transform:rotate(' + a + 'deg)"></div>';
    }

    var notesHtml = '';
    ABOUT.fragments.forEach(function (f, i) {
      var style = f.style || 'sticky-yellow';
      var rot = f.rotation || 0;
      var attachment = '';

      if (style.indexOf('sticky') === 0) {
        // Sticky notes have a folded corner, no pin
        attachment = '';
      } else if (style === 'torn-paper') {
        attachment = makePin();
      } else if (style === 'parchment') {
        attachment = makeTape(rot * 0.5);
      }

      notesHtml += '<div class="cork-note ' + style + ' draggable" ' +
        'style="transform:rotate(' + rot + 'deg)" ' +
        'data-index="' + i + '">' +
        attachment +
        '<div class="cork-note-text">' + escapeHtml(f.text) + '</div>' +
        '</div>';
    });

    var photoHtml = '<div class="cork-photo-frame">' +
      makeTape(3) +
      '<div class="cork-photo-placeholder">' +
      '<span class="cork-photo-label">photo goes here</span>' +
      '</div></div>';

    var linksHtml = ABOUT.links.map(function (l) {
      return '<a class="cork-link" href="' + l.url + '" target="_blank">' + l.label + '</a>';
    }).join('<span class="cork-link-sep">\u00B7</span>');

    return '<div class="corkboard">' +
      '<div class="cork-bio">' + escapeHtml(ABOUT.bio) + '</div>' +
      '<div class="cork-surface">' +
      photoHtml +
      notesHtml +
      '</div>' +
      '<div class="cork-links">' + linksHtml + '</div>' +
      '</div>';
  }

  // ═══════════════════════════════════════════════════
  // Draggable notes
  // ═══════════════════════════════════════════════════
  function initDraggable(container) {
    var notes = container.querySelectorAll('.draggable');
    notes.forEach(function (note) {
      var startX, startY, origX, origY, isDragging = false;

      note.addEventListener('mousedown', function (e) {
        if (e.target.closest('a')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        var rect = note.getBoundingClientRect();
        var parentRect = note.parentElement.getBoundingClientRect();
        origX = rect.left - parentRect.left;
        origY = rect.top - parentRect.top;
        note.style.zIndex = 100;
        note.style.transition = 'none';
        note.classList.add('dragging');
        e.preventDefault();
      });

      document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        note.style.position = 'relative';
        note.style.left = dx + 'px';
        note.style.top = dy + 'px';
      });

      document.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        note.style.zIndex = '';
        note.style.transition = '';
        note.classList.remove('dragging');
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // Sketchbook — organic wall
  // ═══════════════════════════════════════════════════
  function renderSketchbook() {
    var pinColors = ['#c4653a', '#8b6f47', '#7a5c3e'];
    var entries = SKETCHBOOK.map(function (s, i) {
      var rot = ((i * 7 + 3) % 11) - 5; // -5 to 5 degrees
      var attachment = i % 3 === 0
        ? '<div class="tape-strip sketch-tape" style="transform:rotate(' + (rot * -0.5) + 'deg)"></div>'
        : '<div class="pushpin sketch-pin" style="background:' + pinColors[i % pinColors.length] + '"></div>';

      if (s.visible && s.image) {
        return '<div class="sketch-entry sketch-wall-item" style="transform:rotate(' + rot + 'deg)">' +
          attachment +
          '<img class="sketch-image" src="' + s.image + '" alt="' + escapeHtml(s.title) + '">' +
          (s.caption ? '<div class="sketch-caption">' + escapeHtml(s.caption) + '</div>' : '') +
          '</div>';
      } else {
        return '<div class="sketch-entry sketch-wall-item sketch-locked" style="transform:rotate(' + rot + 'deg)">' +
          attachment +
          '<div class="sketch-placeholder"></div>' +
          '<div class="sketch-title-locked">' + escapeHtml(s.title) + '</div>' +
          (s.type ? '<div class="sketch-type">' + escapeHtml(s.type) + '</div>' : '') +
          '</div>';
      }
    }).join("");

    return '<div class="sketchbook-page">' +
      '<h2 class="sketchbook-title">Sketchbook</h2>' +
      '<div class="sketchbook-subtitle">oil, charcoal, digital, photographs</div>' +
      '<div class="sketchbook-wall">' + entries + '</div>' +
      '<div class="sketch-add-note">drop images into assets/images/ and update _data/sketchbook.yml</div>' +
      '</div>';
  }

  // ═══════════════════════════════════════════════════
  // Spine
  // ═══════════════════════════════════════════════════
  function renderSpine() {
    var container = document.getElementById("spine-entries");
    if (!container) return;
    var pieces = filterPieces(activeSection);
    var html = '<div class="named-pieces">';

    pieces.forEach(function (entry) {
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

    if (!activeSection) {
      html += '<div class="spine-separator"><div class="spine-separator-dot"></div><div class="spine-separator-line"></div></div>';
      html += '<div class="timeline-entries">';
      TIMELINE.forEach(function (entry) {
        var isActive = activeItem.kind === "timeline" && activeItem.id === entry.month;
        html += '<div class="timeline-entry" data-kind="timeline" data-id="' + entry.month + '">' +
          '<div class="timeline-dot-wrap"><div class="timeline-dot' + (isActive ? " active" : "") + '"></div></div>' +
          '<div><span class="timeline-month' + (isActive ? " active" : "") + '">' + entry.month + '</span>' +
          '<span class="timeline-tags' + (isActive ? " active" : "") + '">' + entry.tags.join(", ") + '</span></div></div>';
      });
      html += '</div>';
    }

    container.innerHTML = html;
    container.querySelectorAll("[data-kind]").forEach(function (el) {
      el.addEventListener("click", function () { handleNavigation(this.dataset.kind, this.dataset.id); });
    });
    document.querySelectorAll(".nav-link").forEach(function (l) {
      l.classList.toggle("active", l.dataset.section === activeSection);
    });
  }

  // ═══════════════════════════════════════════════════
  // Page rendering
  // ═══════════════════════════════════════════════════
  function renderPage() {
    var container = document.getElementById("notebook-inner");
    if (!container) return;
    var html = "";

    if (activeSection === "about") {
      html = renderAbout();
    } else if (activeSection === "sketchbook") {
      html = renderSketchbook();
    } else if (activeItem.kind === "named") {
      var entry = getPieceById(activeItem.id);
      if (!entry) return;

      if (entry.visible && entry.contentHtml) {
        var bodyClass = "page-body" + (entry.isPoem ? " poem" : "");
        html = '<span class="page-type">' + entry.type + '</span>' +
          '<h2 class="page-title">' + entry.title + '</h2>' +
          '<div class="page-divider"></div>' +
          '<div class="' + bodyClass + '">' + entry.contentHtml + '</div>' +
          renderCrosslinks(entry.crosslinks);
      } else {
        var ghost = renderGhostLines(getGhostBlock(entry.id));
        html = '<span class="locked-type">' + entry.type + '</span>' +
          '<h2 class="locked-title">' + entry.title + '</h2>' +
          '<div class="locked-divider"></div>' +
          '<div class="ghost-area"><div class="ghost-text">' + ghost + '</div>' +
          '<div class="margin-note-wrap"><div class="margin-note">' +
          '<span>' + (entry.lockedNote || '') + '</span></div></div></div>';
      }
    } else if (activeItem.kind === "timeline") {
      var tEntry = null;
      for (var j = 0; j < TIMELINE.length; j++) { if (TIMELINE[j].month === activeItem.id) { tEntry = TIMELINE[j]; break; } }
      if (!tEntry) return;
      var msg = getTimelineMessage(tEntry.month);
      var tGhost = renderGhostLines(getGhostBlock(tEntry.month));
      var tagsHtml = tEntry.tags.map(function (t, i) {
        return '<span>' + t + '</span>' + (i < tEntry.tags.length - 1 ? '<span class="tag-separator">\u00B7</span>' : '');
      }).join("");
      html = '<span class="timeline-page-month">' + tEntry.month + '</span>' +
        '<div class="timeline-page-tags">' + tagsHtml + '</div>' +
        '<div class="timeline-page-divider"></div>' +
        '<div class="ghost-area"><div class="ghost-text">' + tGhost + '</div>' +
        '<div class="margin-note-wrap"><div class="margin-note timeline"><span>' + msg + '</span></div></div></div>';
    }

    container.innerHTML = html;

    // Init draggable on corkboard
    if (activeSection === "about") {
      initDraggable(container);
    }

    container.querySelectorAll(".crosslink-item").forEach(function (el) {
      el.addEventListener("click", function () { handleNavigation("named", this.dataset.id); });
    });
  }

  // ═══════════════════════════════════════════════════
  // Navigation
  // ═══════════════════════════════════════════════════
  function handleNavigation(kind, id) {
    if (activeItem.kind === kind && activeItem.id === id && activeSection === null) return;
    if (isTransitioning) return;
    isTransitioning = true;
    var c = document.getElementById("notebook-inner");
    if (c) c.classList.add("transitioning");
    setTimeout(function () {
      activeItem = { kind: kind, id: id };
      renderPage();
      renderSpine();
      if (c) { c.scrollTop = 0; c.classList.remove("transitioning"); }
      isTransitioning = false;
    }, 230);
  }

  function handleSectionNav(section) {
    if (isTransitioning) return;
    isTransitioning = true;
    var c = document.getElementById("notebook-inner");
    if (c) c.classList.add("transitioning");
    setTimeout(function () {
      activeSection = section;
      if (section === "about" || section === "sketchbook") {
        activeItem = { kind: "special", id: section };
      } else {
        var pieces = (activeSection === "about" || activeSection === "sketchbook") ? NAMED_PIECES : filterPieces(activeSection);
        if (pieces.length) {
          var first = pieces.find(function(p) { return p.visible; });
          activeItem = { kind: "named", id: (first || pieces[0]).id };
        }
      }
      renderPage();
      renderSpine();
      if (c) { c.scrollTop = 0; c.classList.remove("transitioning"); }
      isTransitioning = false;
    }, 230);
  }

  // ═══════════════════════════════════════════════════
  // Init
  // ═══════════════════════════════════════════════════
  function init() {
    checkNightSky();
    setInterval(checkNightSky, 60000);
    renderCurrently();
    renderLittleone();
    renderSpine();
    renderPage();

    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        handleSectionNav(this.dataset.section);
      });
    });

    var siteName = document.getElementById("site-name-link");
    if (siteName) {
      siteName.addEventListener("click", function () {
        activeSection = null;
        activeItem = { kind: "named", id: getDefaultId() };
        renderPage();
        renderSpine();
      });
    }

    requestAnimationFrame(function () {
      setTimeout(function () {
        var spine = document.querySelector(".spine");
        var notebook = document.querySelector(".notebook-area");
        if (spine) spine.classList.add("loaded");
        if (notebook) notebook.classList.add("loaded");
      }, 100);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
