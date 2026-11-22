# Imanathul Reyyan | Data Analytics Portfolio

Live site: **https://imanathulreyyan.github.io**

A single-page portfolio for **Imanathul Reyyan**, a BSc Applied Data Analytics student at the University of Colombo. It presents the data analytics projects I have completed, with the question, the key finding and a link to the full project repository for each one.

## What the site shows

- **Projects:** 5 of 19 planned projects are complete (all Excel). Each card shows the headline result, the main findings, the tools used and a link to its GitHub repository.
- **Progress:** a one-square-per-project chart, a progress bar and a breakdown by tool (Excel, SQL, Power BI, Combined).
- **Method:** the four steps every project follows: clean, analyse, visualise, recommend.
- **Skills, education and contact details.**

## Completed projects

| # | Project | Headline result | Repository |
|---|---------|-----------------|------------|
| 1 | Global Superstore Sales & Profit Analysis | Discounts above 20% cost about $815K in profit | [excel-superstore-sales-analysis](https://github.com/imanathulreyyan/excel-superstore-sales-analysis) |
| 2 | Telco Customer Churn Analysis | 26.5% of 7,043 customers churned | [excel-telco-churn-analysis](https://github.com/imanathulreyyan/excel-telco-churn-analysis) |
| 3 | Netflix Content Library Analysis | 8,804 titles cleaned and analysed | [excel-netflix-content-analysis](https://github.com/imanathulreyyan/excel-netflix-content-analysis) |
| 4 | HR Employee Attrition Analysis | 30.5% attrition with overtime, versus 10.4% without | [excel-hr-attrition-analysis](https://github.com/imanathulreyyan/excel-hr-attrition-analysis) |
| 5 | Spotify Most Streamed Songs Analysis | 8.6x more streams for songs on the most playlists | [excel-spotify-streams-analysis](https://github.com/imanathulreyyan/excel-spotify-streams-analysis) |

Every project includes a cleaning log, an interactive dashboard and a README with findings and limitations.

## Planned projects

SQL (4): Chinook, Sakila, Northwind, Olist. Power BI (5): AdventureWorks, COVID-19, Olympics, Airbnb NYC, Sri Lanka Tourism. Combined (5): Online Retail RFM, Bank Marketing, Walmart, Zomato, World Happiness.

## Tech

HTML, CSS and vanilla JavaScript in a single `index.html` file. No frameworks, no build step and no dependencies. Fonts (Sora and Plus Jakarta Sans) load from Google Fonts.

Features: dark and light theme, responsive layout, project filters, animated counters and a typing headline, keyboard-accessible controls, reduced-motion support, and SEO and Open Graph tags.

## Repository structure

```
index.html   the whole site (HTML, CSS and JavaScript)
README.md    this file
```

## Update a project

Open `index.html`, find the `window.PROJECTS` list and edit the entry. To mark a project as finished, change `status` to `"completed"` and fill in these fields:

```js
{
  no: 5, status: "completed", category: "Excel",
  title: "Project title",
  metric: { value: "00%", label: "what the number means" },
  summary: "One sentence on the question and the data.",
  findings: ["Finding one", "Finding two", "Finding three"],
  tools: ["Excel", "PivotTables"],
  repo: "https://github.com/imanathulreyyan/repository-name"
}
```

Commit the change and GitHub Pages updates the site within a minute or two.

## Run locally

Open `index.html` in any browser. Nothing else is needed.

## Deploy

The repository is named `imanathulreyyan.github.io`, so GitHub Pages serves it at the address above. In **Settings > Pages**, set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`.

## Contact

- Email: imanareyyan@gmail.com
- LinkedIn: https://www.linkedin.com/in/imanathul-reyyan
- GitHub: https://github.com/imanathulreyyan
