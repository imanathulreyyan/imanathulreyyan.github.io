/* Portfolio behaviour: theme, menu, project ledger and list, copy email. No dependencies. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var data = (window.PROJECTS || []).slice().sort(function (a, b) { return a.no - b.no; });
  var CATS = ["Excel", "SQL", "Power BI", "Combined"];
  var filter = "All";

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';
  var GH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function $(id) { return doc.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function done(p) { return p.status === "completed"; }

  /* ---------- Theme ---------- */
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    var btn = $("themeToggle");
    if (btn) btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0b1519" : "#f2f5f1");
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved === "dark" ? "dark" : "light");
  $("themeToggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("menuToggle"), links = $("navLinks");
  function closeMenu() { links.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Progress ledger (one square per project) ---------- */
  var DEFAULT_CAPTION = $("ledgerCaption").innerHTML;
  function buildLedger() {
    var total = data.length, finished = data.filter(done).length, delay = 0;
    $("ledgerSub").textContent = finished + " finished, " + (total - finished) + " still to build.";
    $("ledgerRows").innerHTML = CATS.map(function (cat) {
      var items = data.filter(function (p) { return p.category === cat; });
      var n = items.filter(done).length;
      var cells = items.map(function (p) {
        var label = "Project " + p.no + ", " + p.title + (done(p) ? ", finished" : ", planned");
        if (done(p)) {
          var d = (delay += 0.18).toFixed(2);
          return '<a class="cell cell--done" href="#project-' + p.no + '" style="--d:' + d + 's" data-no="' + p.no + '" aria-label="' + esc(label) + '">' + CHECK + "</a>";
        }
        return '<span class="cell" tabindex="0" data-no="' + p.no + '" role="img" aria-label="' + esc(label) + '"></span>';
      }).join("");
      return '<div class="ledger__row"><div class="ledger__name">' + esc(cat) + '<span class="ledger__count">' + n + " of " + items.length + '</span></div><div class="ledger__cells">' + cells + "</div></div>";
    }).join("");
    requestAnimationFrame(function () { setTimeout(function () { $("ledger").classList.add("is-in"); }, 250); });
  }
  function showCaption(no) {
    var p = data.filter(function (x) { return x.no === +no; })[0];
    $("ledgerCaption").innerHTML = p ? "<strong>Project " + p.no + ": " + esc(p.title) + "</strong><br>" + (done(p) ? "Finished. Select to read the findings." : "Planned. " + esc(p.summary)) : DEFAULT_CAPTION;
  }
  var ledgerEl = $("ledgerRows");
  ledgerEl.addEventListener("mouseover", function (e) { var c = e.target.closest(".cell"); if (c) showCaption(c.dataset.no); });
  ledgerEl.addEventListener("focusin", function (e) { var c = e.target.closest(".cell"); if (c) showCaption(c.dataset.no); });
  ledgerEl.addEventListener("mouseleave", function () { showCaption(null); });
  ledgerEl.addEventListener("focusout", function () { showCaption(null); });
  ledgerEl.addEventListener("click", function (e) {
    if (e.target.closest(".cell--done") && filter !== "All") { setFilter("All"); }
  });

  /* ---------- Projects ---------- */
  function entry(p) {
    var img = p.image ? '<img class="entry__img" src="' + esc(p.image) + '" alt="Dashboard preview for ' + esc(p.title) + '" loading="lazy">' : "";
    return '<article class="entry" id="project-' + p.no + '">' +
      '<div><span class="entry__num">' + esc(p.metric.value) + '</span><span class="entry__label">' + esc(p.metric.label) + "</span></div>" +
      "<div>" +
      '<p class="entry__kind">Project ' + p.no + " of " + data.length + ", " + esc(p.category) + "</p>" +
      "<h3>" + esc(p.title) + "</h3>" +
      '<p class="entry__summary">' + esc(p.summary) + "</p>" +
      '<ul class="entry__list">' + p.findings.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
      img +
      '<div class="entry__foot"><ul class="tags">' + p.tools.map(function (t) { return '<li class="tag">' + esc(t) + "</li>"; }).join("") + "</ul>" +
      '<a class="entry__link" href="' + esc(p.repo) + '" target="_blank" rel="noopener">View on GitHub ' + GH + "</a></div>" +
      "</div></article>";
  }
  function nextRow(p) {
    return '<div class="next__row"><span class="next__no">' + pad(p.no) + '</span><span class="next__name">' + esc(p.title) + '</span><p class="next__ask">' + esc(p.summary) + '</p><span class="next__cat">' + esc(p.category) + "</span></div>";
  }
  function renderProjects() {
    var list = data.filter(function (p) { return filter === "All" || p.category === filter; });
    var fin = list.filter(done), planned = list.filter(function (p) { return !done(p); });
    $("projectList").innerHTML = fin.length ? fin.map(entry).join("") :
      '<p class="empty">No finished ' + esc(filter) + " projects yet. They are in the list below.</p>";
    $("nextList").innerHTML = planned.map(nextRow).join("");
    $("nextBlock").hidden = !planned.length;
  }
  function setFilter(f) {
    filter = f;
    Array.prototype.forEach.call($("filters").querySelectorAll("button"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === f));
    });
    renderProjects();
  }
  $("filters").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-filter]");
    if (b) setFilter(b.getAttribute("data-filter"));
  });

  /* ---------- Copy email ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("is-visible");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 2200);
  }
  $("copyEmail").addEventListener("click", function () {
    var email = this.getAttribute("data-email");
    function fallback() {
      var ta = doc.createElement("textarea"); ta.value = email; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0"; doc.body.appendChild(ta); ta.select();
      try { doc.execCommand("copy"); toast("Email copied"); } catch (e) { toast(email); }
      doc.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () { toast("Email copied"); }, fallback);
    } else { fallback(); }
  });

  $("year").textContent = new Date().getFullYear();
  buildLedger();
  renderProjects();
})();
