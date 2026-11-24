export type Lesson = { id: string; title: string; duration: string; level: string; description: string; completed?: boolean };
export type Module = { id: string; title: string; description: string; lessons: Lesson[] };
export const curriculum: Module[] = [
  { id: "foundations", title: "Financial Foundations", description: "Understand money, banking, time value and the economy.", lessons: [
    { id: "fin-101", title: "What is finance?", duration: "12 min", level: "Beginner", description: "How capital moves between households, businesses, governments and markets." },
    { id: "fin-102", title: "Simple vs compound interest", duration: "15 min", level: "Beginner", description: "Calculate how money changes over time and why compounding matters." },
    { id: "fin-103", title: "Present value and future value", duration: "18 min", level: "Beginner", description: "Translate cash flows across time using a discount rate." }
  ]},
  { id: "markets", title: "Financial Markets & Instruments", description: "Explore equities, fixed income, funds, derivatives and FX.", lessons: [
    { id: "mkt-101", title: "How equity markets work", duration: "16 min", level: "Beginner", description: "Primary markets, secondary markets, exchanges and market capitalisation." },
    { id: "mkt-102", title: "Bond prices and yields", duration: "20 min", level: "Intermediate", description: "Understand the inverse relationship between bond prices and yields." },
    { id: "mkt-103", title: "Derivatives: futures and options", duration: "22 min", level: "Intermediate", description: "Understand contracts, payoffs, hedging and speculation." }
  ]},
  { id: "accounting", title: "Accounting & Financial Statements", description: "Read the three statements and understand business performance.", lessons: [
    { id: "acc-101", title: "The income statement", duration: "18 min", level: "Beginner", description: "Revenue, margins, operating expenses and net income." },
    { id: "acc-102", title: "The balance sheet", duration: "20 min", level: "Beginner", description: "Assets, liabilities, equity and the accounting equation." },
    { id: "acc-103", title: "The cash flow statement", duration: "20 min", level: "Intermediate", description: "Operating, investing and financing cash flows." }
  ]},
  { id: "valuation", title: "Corporate Finance & Valuation", description: "Learn capital allocation, WACC, DCF and comparable valuation.", lessons: [
    { id: "val-101", title: "Enterprise value vs equity value", duration: "18 min", level: "Intermediate", description: "Bridge operating value to the value attributable to shareholders." },
    { id: "val-102", title: "Cost of capital and WACC", duration: "25 min", level: "Intermediate", description: "Estimate the blended required return on a company's capital." },
    { id: "val-103", title: "DCF valuation", duration: "30 min", level: "Advanced", description: "Forecast free cash flow, discount it and estimate terminal value." }
  ]},
  { id: "portfolio", title: "Investing & Portfolio Management", description: "Connect risk, return, diversification and portfolio construction.", lessons: [
    { id: "pm-101", title: "Risk and return", duration: "17 min", level: "Beginner", description: "Understand volatility, drawdowns and risk-adjusted return." },
    { id: "pm-102", title: "Diversification and correlation", duration: "20 min", level: "Intermediate", description: "Why combining assets can change portfolio risk." }
  ]},
  { id: "macro", title: "Macroeconomics & Global Finance", description: "Interpret inflation, rates, currencies and economic cycles.", lessons: [
    { id: "mac-101", title: "Inflation and interest rates", duration: "18 min", level: "Beginner", description: "How purchasing power and monetary policy interact." },
    { id: "mac-102", title: "Reading a central-bank decision", duration: "22 min", level: "Intermediate", description: "Translate policy language into potential market transmission channels." }
  ]},
  { id: "modelling", title: "Financial Modelling & Excel", description: "Build forecasting, three-statement and valuation models.", lessons: [
    { id: "mod-101", title: "Excel fundamentals for finance", duration: "25 min", level: "Beginner", description: "Structure, formulas, references and error checks." },
    { id: "mod-102", title: "Three-statement model architecture", duration: "35 min", level: "Advanced", description: "Link income statement, balance sheet and cash flow forecasts." }
  ]},
  { id: "professional", title: "Professional Finance Skills", description: "Turn analysis into clear, defensible professional work.", lessons: [
    { id: "pro-101", title: "Writing an investment thesis", duration: "25 min", level: "Intermediate", description: "Build a balanced case with catalysts, risks and valuation." },
    { id: "pro-102", title: "Defending assumptions", duration: "15 min", level: "Advanced", description: "Explain evidence, uncertainty and sensitivity in your work." }
  ]}
];

export const tracks = [
  { name: "Investment Banking", skills: ["Accounting", "Valuation", "DCF", "M&A", "LBO fundamentals", "Pitch decks"] },
  { name: "Asset & Portfolio Management", skills: ["Portfolio theory", "Asset allocation", "Risk", "Performance attribution"] },
  { name: "Private Equity & Venture Capital", skills: ["Business analysis", "Due diligence", "Deal structuring", "Investment memos"] },
  { name: "Corporate Finance & FP&A", skills: ["Budgeting", "Forecasting", "Variance analysis", "Capital allocation"] },
  { name: "Risk & Quantitative Finance", skills: ["Statistics", "Derivatives", "Risk models", "Python"] },
  { name: "Trading & Markets", skills: ["Market structure", "Order types", "Backtesting", "Trading journal"] },
  { name: "Financial Technology", skills: ["Python for finance", "Automation", "Data analysis", "AI validation"] }
];

export const newsCases = [
  { id: 1, category: "Monetary Policy", headline: "Central bank cuts its policy rate by 25 basis points", summary: "A hypothetical policy announcement. Inflation has eased for three consecutive readings, while growth has softened.", date: "Simulation · Case 01", question: "Explain two channels through which this decision could affect commercial banks. Include one risk or counterargument." },
  { id: 2, category: "Corporate Earnings", headline: "A manufacturer reports revenue growth but weaker cash conversion", summary: "A hypothetical quarterly result. Revenue rose 18%, receivables rose 36%, and operating cash flow declined.", date: "Simulation · Case 02", question: "What could explain the divergence between reported growth and cash generation? What would you investigate next?" },
  { id: 3, category: "Commodities", headline: "Crude oil rises sharply amid a supply disruption", summary: "A hypothetical supply shock. Import-dependent companies face higher input costs and uncertainty.", date: "Simulation · Case 03", question: "Identify likely winners and losers across sectors. Explain why the impact may differ by company." }
];

export const watchlist = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 1284.5, change: 1.24, sector: "Energy & Retail" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1688.2, change: -0.62, sector: "Banking" },
  { symbol: "INFY", name: "Infosys", price: 1510.0, change: 0.84, sector: "IT Services" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3422.6, change: -0.18, sector: "IT Services" },
  { symbol: "ITC", name: "ITC", price: 398.3, change: 0.42, sector: "FMCG" }
];