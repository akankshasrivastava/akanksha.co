// ═══════════════════════════════════════════════════
// akanksha.co — main interaction logic
// ═══════════════════════════════════════════════════

(function () {
  "use strict";

  // ── State ──
  let activeItem = { kind: "named", id: "poem-echoes" };
  let isTransitioning = false;

  // ── Helpers ──
  function hashString(str, salt) {
    let hash = 0;
    const s = str + (salt || "");
    for (let i = 0; i < s.length; i++) {
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

  // ── Spine rendering ──
  function renderSpine() {
    const container = document.getElementById("spine-entries");
    if (!container) return;

    let html = "";

    // Named pieces
    html += '<div class="named-pieces">';
    NAMED_PIECES.forEach((entry) => {
      const isActive =
        activeItem.kind === "named" && activeItem.id === entry.id;
      const dotClass =
        "named-dot" +
        (isActive ? " active" : entry.visible ? " visible" : "");
      const titleClass =
        "named-title" +
        (isActive ? " active" : entry.visible ? " visible" : "");
      const typeClass = "named-type" + (isActive ? " active" : "");

      html += `
        <div class="named-entry" data-kind="named" data-id="${entry.id}">
          <div class="${dotClass}"></div>
          <div>
            <div class="${titleClass}">${entry.title}</div>
            <span class="${typeClass}">${entry.type}</span>
          </div>
        </div>`;
    });
    html += "</div>";

    // Separator
    html += `
      <div class="spine-separator">
        <div class="spine-separator-dot"></div>
        <div class="spine-separator-line"></div>
      </div>`;

    // Timeline
    html += '<div class="timeline-entries">';
    TIMELINE.forEach((entry) => {
      const isActive =
        activeItem.kind === "timeline" && activeItem.id === entry.month;
      const dotClass = "timeline-dot" + (isActive ? " active" : "");
      const monthClass = "timeline-month" + (isActive ? " active" : "");
      const tagsClass = "timeline-tags" + (isActive ? " active" : "");

      html += `
        <div class="timeline-entry" data-kind="timeline" data-id="${entry.month}">
          <div class="timeline-dot-wrap">
            <div class="${dotClass}"></div>
          </div>
          <div>
            <span class="${monthClass}">${entry.month}</span>
            <span class="${tagsClass}">${entry.tags.join(", ")}</span>
          </div>
        </div>`;
    });
    html += "</div>";

    container.innerHTML = html;

    // Attach click handlers
    container.querySelectorAll("[data-kind]").forEach((el) => {
      el.addEventListener("click", function () {
        const kind = this.dataset.kind;
        const id = this.dataset.id;
        handleNavigation(kind, id);
      });
    });
  }

  // ── Page rendering ──
  function renderPage() {
    const container = document.getElementById("notebook-inner");
    if (!container) return;

    let html = "";

    if (activeItem.kind === "named") {
      const entry = NAMED_PIECES.find((e) => e.id === activeItem.id);
      if (!entry) return;

      if (entry.visible) {
        html = renderVisiblePage(entry);
      } else {
        html = renderLockedNamedPage(entry);
      }
    } else {
      const entry = TIMELINE.find((e) => e.month === activeItem.id);
      if (!entry) return;
      html = renderLockedTimelinePage(entry);
    }

    container.innerHTML = html;
  }

  function renderVisiblePage(entry) {
    const isPoem = entry.type === "poem";
    const bodyClass = "page-body" + (isPoem ? " poem" : "");
    const paragraphs = entry.content
      .split("\n\n")
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");

    return `
      <span class="page-type">${entry.type}</span>
      <h2 class="page-title">${entry.title}</h2>
      <div class="page-divider"></div>
      <div class="${bodyClass}">${paragraphs}</div>`;
  }

  function renderLockedNamedPage(entry) {
    const ghostLines = getGhostBlock(entry.id);
    const ghostHtml = renderGhostLines(ghostLines);

    return `
      <span class="locked-type">${entry.type}</span>
      <h2 class="locked-title">${entry.title}</h2>
      <div class="locked-divider"></div>
      <div class="ghost-area">
        <div class="ghost-text">${ghostHtml}</div>
        <div class="margin-note-wrap">
          <div class="margin-note">
            <span>${entry.lockedNote}</span>
          </div>
        </div>
      </div>`;
  }

  function renderLockedTimelinePage(entry) {
    const message = getTimelineMessage(entry.month);
    const ghostLines = getGhostBlock(entry.month);
    const ghostHtml = renderGhostLines(ghostLines);

    const tagsHtml = entry.tags
      .map(
        (tag, i) =>
          `<span>${tag}</span>${i < entry.tags.length - 1 ? '<span class="tag-separator">·</span>' : ""}`
      )
      .join("");

    return `
      <span class="timeline-page-month">${entry.month}</span>
      <div class="timeline-page-tags">${tagsHtml}</div>
      <div class="timeline-page-divider"></div>
      <div class="ghost-area">
        <div class="ghost-text">${ghostHtml}</div>
        <div class="margin-note-wrap">
          <div class="margin-note timeline">
            <span>${message}</span>
          </div>
        </div>
      </div>`;
  }

  function renderGhostLines(lines) {
    return lines
      .map((line) =>
        line === ""
          ? '<div class="ghost-break"></div>'
          : `<div class="ghost-line">${escapeHtml(line)}</div>`
      )
      .join("");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Navigation ──
  function handleNavigation(kind, id) {
    if (activeItem.kind === kind && activeItem.id === id) return;
    if (isTransitioning) return;

    isTransitioning = true;

    // Transition out
    const content = document.getElementById("notebook-inner");
    if (content) {
      content.classList.add("transitioning");
    }

    setTimeout(() => {
      // Update state
      activeItem = { kind, id };

      // Re-render
      renderPage();
      renderSpine();

      // Scroll notebook to top
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

    // Trigger load animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelector(".spine")?.classList.add("loaded");
        document.querySelector(".notebook-area")?.classList.add("loaded");
      }, 100);
    });
  }

  // Wait for DOM + fonts
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
