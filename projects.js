/*
 * Project data. To add or update a project, edit this file only:
 *  - status: "completed" or "planned"
 *  - category: "Excel" | "SQL" | "Power BI" | "Combined"
 *  - image (optional): path to a dashboard screenshot, e.g. "assets/img/netflix.png"
 */
window.PROJECTS = [
  {
    no: 1, status: "completed", category: "Excel",
    title: "Global Superstore Sales & Profit Analysis",
    metric: { value: "$815K", label: "profit lost to discounts above 20%" },
    summary: "A sales and profit analysis of a global retailer, with an interactive Excel dashboard.",
    findings: [
      "Sales doubled in four years",
      "Heavy discounting (above 20%) cost about $815K in profit"
    ],
    tools: ["Excel", "PivotTables", "Dashboard"],
    repo: "https://github.com/imanathulreyyan/excel-superstore-sales-analysis"
  },
  {
    no: 2, status: "completed", category: "Excel",
    title: "Telco Customer Churn Analysis",
    metric: { value: "26.5%", label: "of 7,043 customers churned" },
    summary: "Who leaves a telecom provider, why, and how much revenue it costs ($139,131 a month).",
    findings: [
      "Month-to-month contracts churn at 45.8%, two-year contracts at only 2.5%",
      "47.4% of customers leave in their first 12 months",
      "45% of customers who left cited a competitor"
    ],
    tools: ["Excel", "PivotTables", "Slicers", "KPI tiles"],
    repo: "https://github.com/imanathulreyyan/excel-telco-churn-analysis"
  },
  {
    no: 3, status: "completed", category: "Excel",
    title: "Netflix Content Library Analysis",
    metric: { value: "8,804", label: "titles cleaned and analysed" },
    summary: "How the Netflix library grew, what it contains, where it comes from and who it is made for.",
    findings: [
      "Yearly additions grew nearly 5x between 2016 and 2019",
      "Movies outnumber TV shows more than 2 to 1",
      "Two in three TV shows stop after one season"
    ],
    tools: ["Excel", "Data cleaning", "Slicers", "Dashboard"],
    repo: "https://github.com/imanathulreyyan/excel-netflix-content-analysis"
  },
  {
    no: 4, status: "completed", category: "Excel",
    title: "HR Employee Attrition Analysis",
    metric: { value: "30.5%", label: "attrition with overtime, versus 10.4% without" },
    summary: "Which employees leave and what they have in common, across 1,470 employees (16.1% attrition).",
    findings: [
      "Employees aged 18-24 leave at 39.2%",
      "29.8% leave within their first two years",
      "Under $3K earners leave at 28.6%, over 3x the rate above $10K"
    ],
    tools: ["Excel", "IFS", "AVERAGEIFS", "Slicers"],
    repo: "https://github.com/imanathulreyyan/excel-hr-attrition-analysis"
  },

  { no: 5, status: "planned", category: "Excel", title: "Spotify Most Streamed Songs Analysis", summary: "What makes a song a hit?" },
  { no: 6, status: "planned", category: "SQL", title: "Chinook Music Store Revenue Analysis", summary: "Which artists, genres and countries earn the most?" },
  { no: 7, status: "planned", category: "SQL", title: "Sakila DVD Rental Analysis", summary: "Which films, stores and customers drive rentals?" },
  { no: 8, status: "planned", category: "SQL", title: "Northwind Trading Analysis", summary: "Which products, suppliers and employees perform best?" },
  { no: 9, status: "planned", category: "SQL", title: "Olist E-commerce Delivery Analysis", summary: "Where do deliveries and reviews go wrong?" },
  { no: 10, status: "planned", category: "Power BI", title: "AdventureWorks Sales Dashboard", summary: "Which products, regions and customers grow revenue?" },
  { no: 11, status: "planned", category: "Power BI", title: "COVID-19 Global Tracker", summary: "How did the pandemic spread across countries?" },
  { no: 12, status: "planned", category: "Power BI", title: "120 Years of Olympic History", summary: "Which countries and sports dominate?" },
  { no: 13, status: "planned", category: "Power BI", title: "Airbnb New York Market Analysis", summary: "What drives price and demand?" },
  { no: 14, status: "planned", category: "Power BI", title: "Sri Lanka Tourism Dashboard", summary: "Where do visitors come from, and when?" },
  { no: 15, status: "planned", category: "Combined", title: "Online Retail Customer Segmentation (RFM)", summary: "Who are the best customers? Excel, SQL and Power BI together." },
  { no: 16, status: "planned", category: "Combined", title: "Bank Marketing Campaign Analysis", summary: "Who says yes to a term deposit?" },
  { no: 17, status: "planned", category: "Combined", title: "Walmart Weekly Sales Analysis", summary: "How do holidays and stores affect sales?" },
  { no: 18, status: "planned", category: "Combined", title: "Zomato Restaurants Analysis", summary: "What makes a restaurant rated well?" },
  { no: 19, status: "planned", category: "Combined", title: "World Happiness Report Analysis", summary: "What drives a happier country?" }
];
