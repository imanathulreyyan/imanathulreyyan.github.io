# Imanathul Reyyan | Data Analytics Portfolio

Personal portfolio of a BSc Applied Data Analytics student (University of Colombo). 19 planned projects across Excel, SQL, Power BI and combined work. **4 Excel projects are complete.**

Live site: https://imanathulreyyan.github.io

## Tech
HTML5 · SCSS (partials, mixins, maps, theming) · vanilla JavaScript (no frameworks)

## Features
Dark/light theme · project filters · data-driven project cards · scroll reveal and animated counters · responsive, accessible (keyboard, reduced motion) · SEO + Open Graph + JSON-LD

## Structure
```
index.html
css/style.css        compiled output (committed so GitHub Pages works)
scss/                source partials (_variables, _mixins, _base, _layout, _components, _hero, _projects)
js/projects.js       all project data
js/main.js           behaviour
assets/              favicon, img/ for project screenshots
```

## Add or update a project
Edit `js/projects.js`: change `status` to `"completed"` and fill `metric`, `summary`, `findings`, `tools`, `repo`. Optional `image: "assets/img/name.png"`.

## Rebuild the CSS
```
npm install
npm run build      # or: npm run watch
```

## Deploy (GitHub Pages)
Repository must be named `imanathulreyyan.github.io`. Push all files to `main`, then Settings > Pages > Deploy from branch > `main` / root.
