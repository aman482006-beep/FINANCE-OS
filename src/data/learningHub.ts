export type ResourceItem = {
  id: string;
  title: string;
  provider: string;
  description: string;
  url: string;
  access: "Free" | "Free course" | "Paid credential";
  level: "Beginner" | "Intermediate" | "Advanced" | "All levels";
  modules: string[];
  careerTracks: string[];
  format: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export const resourceLibrary: ResourceItem[] = [
  {
    id: "openstax-finance",
    title: "Principles of Finance 2e",
    provider: "OpenStax · Rice University",
    description: "A complete, openly licensed undergraduate finance textbook. Use it when you need a deeper explanation or a structured chapter sequence.",
    url: "https://openstax.org/books/principles-finance-2e/pages/preface",
    access: "Free",
    level: "Beginner",
    modules: ["foundations", "valuation", "portfolio", "macro"],
    careerTracks: ["Corporate Finance & FP&A", "Private Equity & Venture Capital", "Risk & Quantitative Finance"],
    format: "Open textbook"
  },
  {
    id: "nism-basic",
    title: "Investor Education (Basic)",
    provider: "NISM · SEBI-established institute",
    description: "A free two-hour course covering budgeting, saving, risk and return, inflation, compounding, investment options in India and investor rights.",
    url: "https://online.nism.ac.in/module/Investor%20Education%20%28Basic%29.html",
    access: "Free course",
    level: "Beginner",
    modules: ["foundations", "markets", "portfolio"],
    careerTracks: ["Asset & Portfolio Management", "Trading & Markets"],
    format: "Self-paced course"
  },
  {
    id: "zerodha-varsity",
    title: "Varsity",
    provider: "Zerodha",
    description: "Open-access lessons on financial literacy, markets, instruments, investing and trading. A strong practical companion for Indian-market basics.",
    url: "https://zerodha.com/varsity/",
    access: "Free",
    level: "All levels",
    modules: ["foundations", "markets", "portfolio", "macro"],
    careerTracks: ["Asset & Portfolio Management", "Trading & Markets"],
    format: "Lessons, videos and quizzes"
  },
  {
    id: "nism-investor-ed",
    title: "Investor Education Library",
    provider: "NISM",
    description: "Official investor-education videos, articles, webinars and material on financial concepts, securities markets, products and risk.",
    url: "https://www.nism.ac.in/investor-education/",
    access: "Free",
    level: "All levels",
    modules: ["markets", "portfolio", "macro", "professional"],
    careerTracks: ["Asset & Portfolio Management", "Financial Technology", "Trading & Markets"],
    format: "Official resource library"
  },
  {
    id: "openstax-accounting",
    title: "Principles of Financial Accounting",
    provider: "OpenStax · Rice University",
    description: "A free online accounting textbook covering the financial statements and the underlying accounting concepts.",
    url: "https://openstax.org/books/principles-financial-accounting/pages/preface",
    access: "Free",
    level: "Beginner",
    modules: ["accounting", "modelling"],
    careerTracks: ["Investment Banking", "Corporate Finance & FP&A"],
    format: "Open textbook"
  },
  {
    id: "damodaran-valuation",
    title: "Equity Valuation Class",
    provider: "Aswath Damodaran · NYU Stern",
    description: "University-level valuation material with lecture notes, spreadsheets, projects, practice problems, quizzes and company examples.",
    url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/equity.html",
    access: "Free",
    level: "Advanced",
    modules: ["valuation", "modelling", "professional"],
    careerTracks: ["Investment Banking", "Private Equity & Venture Capital"],
    format: "Course material and spreadsheets"
  },
  {
    id: "damodaran-corpfin",
    title: "Corporate Finance Resources",
    provider: "Aswath Damodaran · NYU Stern",
    description: "Corporate-finance lectures, data, spreadsheets and practical valuation tools. Best used after the foundations and accounting folders.",
    url: "https://pages.stern.nyu.edu/adamodar/New_Home_Page/home.htm",
    access: "Free",
    level: "Intermediate",
    modules: ["valuation", "macro", "modelling"],
    careerTracks: ["Investment Banking", "Corporate Finance & FP&A", "Private Equity & Venture Capital", "Risk & Quantitative Finance"],
    format: "Lectures, data and spreadsheets"
  },
  {
    id: "nse-investor",
    title: "Investor Awareness Programmes",
    provider: "National Stock Exchange of India",
    description: "NSE investor education initiatives and learning material for understanding securities markets and making informed decisions.",
    url: "https://www.nseindia.in/static/invest/investors-awareness-programs",
    access: "Free",
    level: "Beginner",
    modules: ["foundations", "markets", "portfolio"],
    careerTracks: ["Asset & Portfolio Management", "Trading & Markets"],
    format: "Investor education"
  },
  {
    id: "excel-support",
    title: "Excel Help & Learning",
    provider: "Microsoft",
    description: "Official Excel guides and help for formulas, workbooks, charts, tables and other spreadsheet fundamentals used in finance work.",
    url: "https://support.microsoft.com/en-us/excel",
    access: "Free",
    level: "All levels",
    modules: ["accounting", "modelling", "professional"],
    careerTracks: ["Investment Banking", "Corporate Finance & FP&A", "Financial Technology"],
    format: "Guides and tutorials"
  },
  {
    id: "cfa-foundations",
    title: "Investment Foundations Certificate",
    provider: "CFA Institute",
    description: "A structured credential covering the investment industry, instruments, markets, ethics and investment decision-making. Check the current fee and eligibility before enrolling.",
    url: "https://www.cfainstitute.org/programs/investment-foundations-certificate",
    access: "Paid credential",
    level: "Beginner",
    modules: ["markets", "portfolio", "professional"],
    careerTracks: ["Asset & Portfolio Management", "Investment Banking", "Private Equity & Venture Capital"],
    format: "Self-paced certificate"
  }
];

export const moduleQuizzes: Record<string, QuizQuestion[]> = {
  foundations: [
    {
      id: "foundations-q1",
      prompt: "A company buys a machine that is expected to generate cash over five years. What is the central finance decision?",
      options: ["Whether the machine looks expensive", "Whether expected risk-adjusted benefits justify the cash outflow", "Whether the company can call it an asset", "Whether the purchase increases revenue immediately"],
      answerIndex: 1,
      explanation: "Finance compares expected benefits with cost, risk, timing and liquidity. A purchase is not automatically a good investment because it is an asset."
    },
    {
      id: "foundations-q2",
      prompt: "Why does compound interest grow faster than simple interest over time?",
      options: ["The interest rate automatically rises", "Returns are earned on the original principal and previously earned returns", "Inflation is always positive", "The investment becomes risk-free"],
      answerIndex: 1,
      explanation: "Compounding reinvests accumulated returns. The rate does not need to rise for the amount to compound."
    }
  ],
  markets: [
    {
      id: "markets-q1",
      prompt: "A shareholder sells existing shares to another investor on an exchange. Who receives the sale proceeds?",
      options: ["The company that originally issued the shares", "The selling shareholder", "The stock exchange", "The company's auditor"],
      answerIndex: 1,
      explanation: "A secondary-market trade transfers ownership between investors. The issuer typically receives funds when it issues securities, not from ordinary resales."
    },
    {
      id: "markets-q2",
      prompt: "A fixed-coupon bond becomes less attractive than newly issued bonds after market yields rise. What normally happens to its price?",
      options: ["It rises above face value", "It falls, all else equal", "It cannot change", "Its coupon automatically resets"],
      answerIndex: 1,
      explanation: "The older fixed coupon must be offered at a lower price to provide a yield competitive with newly issued bonds."
    }
  ],
  accounting: [
    {
      id: "accounting-q1",
      prompt: "A company records revenue but has not yet collected the customer's cash. Which statement can already reflect the revenue?",
      options: ["Income statement", "Cash flow statement only", "No statement until cash arrives", "Only the statement of changes in equity"],
      answerIndex: 0,
      explanation: "Accrual accounting recognises revenue when earned under the applicable rules. Cash collection may happen later and affects receivables and cash."
    },
    {
      id: "accounting-q2",
      prompt: "A business has assets of ₹500 crore and equity of ₹180 crore. What are its liabilities?",
      options: ["₹680 crore", "₹500 crore", "₹320 crore", "₹180 crore"],
      answerIndex: 2,
      explanation: "Assets = liabilities + equity, so liabilities = ₹500 crore − ₹180 crore = ₹320 crore."
    }
  ],
  valuation: [
    {
      id: "valuation-q1",
      prompt: "Which metric is commonly paired with enterprise value in valuation multiples?",
      options: ["Net income per share", "EBITDA", "Dividend per share only", "Cash balance only"],
      answerIndex: 1,
      explanation: "EV/EBITDA compares operating value with an operating earnings measure before interest, tax, depreciation and amortisation."
    },
    {
      id: "valuation-q2",
      prompt: "In a Gordon-growth terminal value formula, what happens when terminal growth approaches WACC from below?",
      options: ["Terminal value falls to zero", "The denominator narrows and terminal value rises sharply", "The formula becomes insensitive", "Enterprise value must equal equity value"],
      answerIndex: 1,
      explanation: "Terminal value is highly sensitive to WACC − g. A very small denominator produces a very large terminal value, so assumptions need disciplined limits."
    }
  ],
  portfolio: [
    {
      id: "portfolio-q1",
      prompt: "Why can adding a second asset reduce portfolio volatility?",
      options: ["The second asset always earns more", "The assets do not move perfectly together", "Both assets become risk-free", "The portfolio's market exposure disappears"],
      answerIndex: 1,
      explanation: "Diversification benefits depend on weights, volatilities and correlations. It can reduce specific risk, not eliminate all market risk."
    },
    {
      id: "portfolio-q2",
      prompt: "A portfolio falls from a peak of ₹12 lakh to ₹9 lakh. What is its peak-to-trough drawdown?",
      options: ["−10%", "−20%", "−25%", "−33%"],
      answerIndex: 2,
      explanation: "Drawdown = (₹9 lakh − ₹12 lakh) ÷ ₹12 lakh = −25%."
    }
  ],
  macro: [
    {
      id: "macro-q1",
      prompt: "Your deposit earns 4% while inflation is 6%. What happens to purchasing power, approximately?",
      options: ["It rises by 2%", "It falls by 2%", "It remains unchanged", "It rises by 10%"],
      answerIndex: 1,
      explanation: "Approximate real return = nominal return − inflation = 4% − 6% = −2%."
    },
    {
      id: "macro-q2",
      prompt: "Why can an unexpected interest-rate cut still be negative for equities?",
      options: ["Rates always reduce company revenue", "Investors may interpret it as a response to weakening growth or stress", "Equities are legally required to fall", "A rate cut always increases inflation immediately"],
      answerIndex: 1,
      explanation: "The signal about the economy can outweigh cheaper financing. Expected earnings and risk premia may deteriorate."
    }
  ],
  modelling: [
    {
      id: "modelling-q1",
      prompt: "Why should a financial model separate input assumptions from formulas?",
      options: ["To make the workbook larger", "To improve auditability and make scenarios easier to change", "To hide assumptions", "To eliminate the need for checks"],
      answerIndex: 1,
      explanation: "Separating inputs and calculations makes a model easier to review, update and debug."
    },
    {
      id: "modelling-q2",
      prompt: "A company buys equipment for cash. Before depreciation, which treatment is most appropriate?",
      options: ["Record the full amount as an operating expense immediately", "Increase PP&E, reduce cash and show capex as investing cash flow", "Increase revenue", "Do not change any financial statement"],
      answerIndex: 1,
      explanation: "The purchase exchanges cash for a long-lived asset. Depreciation is recognised over the asset's useful life, subject to accounting rules."
    }
  ],
  professional: [
    {
      id: "professional-q1",
      prompt: "What makes an investment thesis defensible?",
      options: ["Only a strong conviction", "A clear argument linked to evidence, catalysts, valuation, risks and what would disprove it", "A long list of financial ratios", "A target price without assumptions"],
      answerIndex: 1,
      explanation: "A good thesis distinguishes facts from assumptions, identifies catalysts and risks, and states what evidence would change the view."
    },
    {
      id: "professional-q2",
    prompt: "A valuation changes materially when WACC moves by 1 percentage point. What should the analyst do?",
    options: ["Hide the sensitivity", "Show the sensitivity and explain how WACC was estimated", "Keep the original value without comment", "Remove the terminal value"],
    answerIndex: 1,
    explanation: "Sensitivity analysis shows model risk. The analyst should expose the dependence on assumptions and avoid false precision."
    }
  ]
};
