/* Portfolio behaviour: theme, menu, typing, counters, reveal, project ledger and cards. No dependencies. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var data = (window.PROJECTS || []).slice().sort(function (a, b) { return a.no - b.no; });
  var CATS = ["Excel", "SQL", "Power BI", "Combined"];
  var filter = "All";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

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
    if (meta) meta.setAttribute("content", t === "dark" ? "#060a14" : "#f5f7fd");
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved === "light" ? "light" : "dark");
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

  /* ---------- Typing role text ---------- */
  var roles = ["clean messy data", "build Excel dashboards", "find the story in numbers", "turn findings into decisions"];
  (function typing() {
    var el = $("roleText"); if (!el || reduce) return;
    var r = 0, i = roles[0].length, del = true;
    function tick() {
      var word = roles[r];
      if (del) { i--; el.textContent = word.slice(0, i); if (i === 0) { del = false; r = (r + 1) % roles.length; } setTimeout(tick, 38); }
      else { i++; el.textContent = roles[r].slice(0, i); if (i === roles[r].length) { del = true; setTimeout(tick, 1800); } else setTimeout(tick, 70); }
    }
    setTimeout(tick, 1800);
  })();

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

    var pct = Math.round(finished / total * 100);
    $("meterText").textContent = finished + " of " + total + " projects completed";
    $("meterCats").innerHTML = CATS.map(function (cat) {
      var items = data.filter(function (p) { return p.category === cat; });
      return '<div class="meter__cat"><b>' + items.filter(done).length + " of " + items.length + "</b><span>" + esc(cat) + "</span></div>";
    }).join("");
    var bar = $("meterBar");
    bar.parentNode.setAttribute("aria-valuenow", String(pct));
    setTimeout(function () { bar.style.width = pct + "%"; }, 50);
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
  ledgerEl.addEventListener("click", function (e) { if (e.target.closest(".cell--done") && filter !== "All") setFilter("All"); });

  /* ---------- Projects ---------- */
  function card(p) {
    var img = p.image ? '<img class="project__img" src="' + esc(p.image) + '" alt="Dashboard preview for ' + esc(p.title) + '" loading="lazy">' : "";
    return '<article class="project reveal" id="project-' + p.no + '">' +
      '<div class="project__head"><div class="project__top"><span class="project__no">Project ' + pad(p.no) + " &middot; " + esc(p.category) + '</span><span class="project__status">Completed</span></div>' +
      '<div class="project__metric"><b>' + esc(p.metric.value) + "</b><span>" + esc(p.metric.label) + "</span></div></div>" +
      '<div class="project__body"><h3>' + esc(p.title) + "</h3>" +
      '<p class="project__summary">' + esc(p.summary) + "</p>" +
      '<ul class="project__list">' + p.findings.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" + img +
      '<div class="project__foot"><div class="chips">' + p.tools.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>" +
      '<a class="project__link" href="' + esc(p.repo) + '" target="_blank" rel="noopener">View on GitHub ' + ARROW + "</a></div></div></article>";
  }
  function soon(p) {
    return '<div class="soon__item reveal"><small>' + pad(p.no) + " &middot; " + esc(p.category) + "</small><b>" + esc(p.title) + "</b><p>" + esc(p.summary) + "</p></div>";
  }
  function renderProjects() {
    var list = data.filter(function (p) { return filter === "All" || p.category === filter; });
    var fin = list.filter(done), planned = list.filter(function (p) { return !done(p); });
    $("projectList").innerHTML = fin.length ? fin.map(card).join("") :
      '<p class="empty">No finished ' + esc(filter) + " projects yet. They are in the list below.</p>";
    $("nextList").innerHTML = planned.map(soon).join("");
    $("nextBlock").hidden = !planned.length;
    observeReveals();
  }
  function setFilter(f) {
    filter = f;
    Array.prototype.forEach.call($("filters").querySelectorAll("button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === f)); });
    renderProjects();
  }
  $("filters").addEventListener("click", function (e) { var b = e.target.closest("button[data-filter]"); if (b) setFilter(b.getAttribute("data-filter")); });

  /* ---------- Reveal on scroll and counters ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible");
      if (en.target.id === "ledger") en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 }) : null;
  function observeReveals() {
    doc.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) { io ? io.observe(el) : el.classList.add("is-visible", "is-in"); });
  }
  function countUp() {
    var els = doc.querySelectorAll("[data-count]");
    var cio = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, to = parseInt(el.getAttribute("data-to"), 10) || 0, t0 = null;
        cio.unobserve(el);
        if (reduce) { el.textContent = to; return; }
        (function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1200, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.4 }) : null;
    els.forEach(function (el) { cio ? cio.observe(el) : (el.textContent = el.getAttribute("data-to")); });
  }

  /* ---------- Scroll progress, back to top, active nav ---------- */
  var bar = $("progress"), toTop = $("toTop");
  var sections = Array.prototype.slice.call(doc.querySelectorAll("main section[id]"));
  function onScroll() {
    var h = doc.documentElement.scrollHeight - innerHeight, y = window.scrollY;
    bar.style.width = (h > 0 ? y / h * 100 : 0) + "%";
    toTop.classList.toggle("is-visible", y > 700);
    var current = "";
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= 120) current = s.id; });
    links.querySelectorAll("a").forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

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
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(function () { toast("Email copied"); }, fallback);
    else fallback();
  });

  $("year").textContent = new Date().getFullYear();
  buildLedger();
  renderProjects();
  countUp();
  observeReveals();
  setTimeout(function () { var m = $("mockWrap"); if (m) m.classList.add("is-in"); }, 300);
  onScroll();
})();
