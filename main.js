(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.classList.remove("no-js");

  var ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>'
  };

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Theme ---------- */
  var saved = safeGet("theme");
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(saved || (prefersLight ? "light" : "dark"));
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    var btn = doc.getElementById("themeToggle");
    if (btn) btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  var themeBtn = doc.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next); safeSet("theme", next);
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = doc.getElementById("menuToggle"), links = doc.getElementById("navLinks");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Rotating role text ---------- */
  var roleEl = doc.getElementById("roleText");
  if (roleEl) {
    var roles = ["clean messy data", "build Excel dashboards", "find the insight behind the numbers", "turn analysis into recommendations"];
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ri = 0, ci = 0, del = false;
    if (reduce) { roleEl.textContent = roles[0]; }
    else (function tick() {
      var word = roles[ri];
      ci += del ? -1 : 1;
      roleEl.textContent = word.slice(0, ci);
      var delay = del ? 28 : 55;
      if (!del && ci === word.length) { del = true; delay = 1600; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- Projects ---------- */
  var data = window.PROJECTS || [];
  var grid = doc.getElementById("projectGrid");
  var filter = "All";

  function card(p) {
    if (p.status !== "completed") {
      return '<article class="project project--planned reveal" data-cat="' + esc(p.category) + '">' +
        '<div class="project__top"><span class="project__no">#' + String(p.no).padStart(2, "0") + '</span><span class="chip chip--progress">Planned</span></div>' +
        '<h3>' + esc(p.title) + '</h3><p class="project__summary">' + esc(p.summary) + '</p>' +
        '<div class="chips"><span class="chip chip--soft">' + esc(p.category) + '</span></div></article>';
    }
    var img = p.image ? '<img class="project__img" src="' + esc(p.image) + '" alt="Dashboard preview of ' + esc(p.title) + '" loading="lazy">' : "";
    return '<article class="project reveal" data-cat="' + esc(p.category) + '">' +
      '<div class="project__top"><span class="project__no">PROJECT #' + String(p.no).padStart(2, "0") + '</span><span class="chip chip--done">Completed</span></div>' +
      '<h3>' + esc(p.title) + '</h3>' + img +
      '<div class="project__metric"><b>' + esc(p.metric.value) + '</b><span>' + esc(p.metric.label) + '</span></div>' +
      '<p class="project__summary">' + esc(p.summary) + '</p>' +
      '<ul class="project__list">' + p.findings.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + '</ul>' +
      '<div class="project__foot"><div class="chips">' + p.tools.map(function (t) { return '<span class="chip chip--soft">' + esc(t) + '</span>'; }).join("") + '</div>' +
      '<a class="project__link" href="' + esc(p.repo) + '" target="_blank" rel="noopener">View on GitHub ' + ICON.arrow + '</a></div></article>';
  }

  function renderProjects() {
    if (!grid) return;
    var list = data.filter(function (p) { return filter === "All" || p.category === filter; });
    list.sort(function (a, b) { return (a.status === "completed" ? 0 : 1) - (b.status === "completed" ? 0 : 1) || a.no - b.no; });
    grid.innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No projects in this category yet.</p>';
    observeReveals();
  }

  function renderSummary() {
    var cats = ["Excel", "SQL", "Power BI", "Combined"], done = 0, box = doc.getElementById("catSummary");
    var html = cats.map(function (c) {
      var all = data.filter(function (p) { return p.category === c; });
      var d = all.filter(function (p) { return p.status === "completed"; }).length;
      done += d;
      return "<div><b>" + c + "</b> " + d + " of " + all.length + " completed</div>";
    }).join("");
    if (box) box.innerHTML = html;
    var total = data.length, pct = total ? Math.round(done / total * 100) : 0;
    var t = doc.getElementById("overallText"); if (t) t.textContent = done + " of " + total + " projects completed";
    var b = doc.getElementById("overallBar"); if (b) requestAnimationFrame(function () { b.style.width = pct + "%"; });
    var sc = doc.querySelector('[data-count="projects"]'); if (sc) sc.setAttribute("data-to", done);
    var sp = doc.querySelector('[data-count="planned"]'); if (sp) sp.setAttribute("data-to", total);
  }

  var filterBox = doc.getElementById("filters");
  if (filterBox) filterBox.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-filter]"); if (!btn) return;
    filter = btn.getAttribute("data-filter");
    filterBox.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    renderProjects();
  });

  /* ---------- Reveal on scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  function observeReveals() {
    doc.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) { io ? io.observe(el) : el.classList.add("is-visible"); });
  }

  /* ---------- Counters ---------- */
  function runCounters() {
    var els = doc.querySelectorAll("[data-count]");
    var cio = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, to = parseInt(el.getAttribute("data-to"), 10) || 0, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1100, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step); cio.unobserve(el);
      });
    }, { threshold: 0.6 }) : null;
    els.forEach(function (el) { cio ? cio.observe(el) : (el.textContent = el.getAttribute("data-to")); });
  }

  /* ---------- Active nav + progress + back to top ---------- */
  var sections = Array.prototype.slice.call(doc.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav__links a"));
  var bar = doc.getElementById("progress"), toTop = doc.getElementById("toTop");
  function onScroll() {
    var h = root.scrollHeight - window.innerHeight, y = window.scrollY;
    if (bar) bar.style.width = (h > 0 ? y / h * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("is-shown", y > 700);
    var cur = "";
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= 120) cur = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + cur); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Copy email ---------- */
  var copyBtn = doc.getElementById("copyEmail"), toast = doc.getElementById("toast");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var email = copyBtn.getAttribute("data-email");
    function done(msg) { if (!toast) return; toast.textContent = msg; toast.classList.add("is-shown"); setTimeout(function () { toast.classList.remove("is-shown"); }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(function () { done("Email copied"); }, function () { done(email); });
    else done(email);
  });

  var yr = doc.getElementById("year"); if (yr) yr.textContent = new Date().getFullYear();

  renderSummary(); renderProjects(); observeReveals(); runCounters(); onScroll();
})();
