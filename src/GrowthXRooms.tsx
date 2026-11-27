import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Award, BookOpen, BriefcaseBusiness,
  Check, ChevronRight, CircleHelp, ExternalLink, FileSpreadsheet, Folder,
  FolderOpen, Gift, GraduationCap, LockKeyhole, Search, ShieldCheck, Sparkles,
  Target, Trophy, Zap
} from "lucide-react";
import { curriculum, tracks } from "./data";
import { moduleQuizzes, resourceLibrary } from "./data/learningHub";

type LearningRoomProps = {
  completed: string[];
  markComplete: (id: string) => void;
  setSelectedLesson: (id: string) => void;
  points: number;
  completedQuizzes: string[];
  onQuizPassed: (moduleId: string) => void;
  onOpenRewards: () => void;
};

const moduleMeta: Record<string, { label: string; color: string; outcome: string }> = {
  foundations: { label: "START HERE", color: "mint", outcome: "Understand money, time value and the financial system." },
  markets: { label: "MARKETS", color: "blue", outcome: "Understand how securities, exchanges and market instruments work." },
  accounting: { label: "CORE SKILL", color: "peach", outcome: "Read the three financial statements without guessing." },
  valuation: { label: "VALUATION", color: "lavender", outcome: "Connect business performance to enterprise and equity value." },
  portfolio: { label: "INVESTING", color: "yellow", outcome: "Think clearly about risk, return and diversification." },
  macro: { label: "ECONOMY", color: "blue", outcome: "Translate policy, rates and inflation into financial effects." },
  modelling: { label: "BUILD", color: "peach", outcome: "Build spreadsheets that are traceable and reviewable." },
  professional: { label: "CAREER READY", color: "mint", outcome: "Communicate assumptions and defend professional work." }
};

const resourceIdsByCareer: Record<string, string[]> = {
  "Investment Banking": ["damodaran-valuation", "excel-support", "openstax-accounting"],
  "Asset & Portfolio Management": ["zerodha-varsity", "nism-investor-ed", "nism-basic"],
  "Private Equity & Venture Capital": ["damodaran-valuation", "damodaran-corpfin", "openstax-finance"],
  "Corporate Finance & FP&A": ["openstax-finance", "excel-support", "openstax-accounting"],
  "Risk & Quantitative Finance": ["openstax-finance", "damodaran-corpfin", "zerodha-varsity"],
  "Trading & Markets": ["zerodha-varsity", "nse-investor", "nism-investor-ed"],
  "Financial Technology": ["excel-support", "openstax-finance", "nism-investor-ed"]
};

const careerOutcomes: Record<string, string> = {
  "Investment Banking": "Build a three-statement model, DCF, comparable-company analysis and a concise transaction pitch.",
  "Asset & Portfolio Management": "Create an investment policy note, asset allocation, risk review and performance attribution.",
  "Private Equity & Venture Capital": "Write a deal screen, market map, diligence checklist and investment memo for a real or fictional company.",
  "Corporate Finance & FP&A": "Build a budget, rolling forecast, variance bridge and management commentary.",
  "Risk & Quantitative Finance": "Develop a risk question, document data assumptions, test a model and explain its limitations.",
  "Trading & Markets": "Create a rules-based paper-trading journal with an entry thesis, risk limit and post-trade review.",
  "Financial Technology": "Prototype a finance workflow, document its data sources and test the calculation and user experience."
};

function ResourceCard({ resource }: { resource: (typeof resourceLibrary)[number] }) {
  return <a className="gx-resource-card" href={resource.url} target="_blank" rel="noopener noreferrer">
    <div className="gx-resource-top"><span className={resource.access === "Paid credential" ? "gx-access paid" : "gx-access"}>{resource.access}</span><ExternalLink size={15}/></div>
    <b>{resource.title}</b>
    <small>{resource.provider}</small>
    <p>{resource.description}</p>
    <span className="gx-resource-foot">{resource.format} <ArrowUpRight size={13}/></span>
  </a>;
}

export function LearningRoom({ completed, markComplete, setSelectedLesson, points, completedQuizzes, onQuizPassed, onOpenRewards }: LearningRoomProps) {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<number | null>(null);
  const [quizError, setQuizError] = useState("");
  const activeModule = curriculum.find(module => module.id === activeModuleId);
  const activeQuiz = activeModule ? moduleQuizzes[activeModule.id] ?? [] : [];
  const passed = activeModule ? completedQuizzes.includes(activeModule.id) : false;
  const nextModule = curriculum.find(module => module.lessons.some(lesson => !completed.includes(lesson.id)));

  const filteredModules = useMemo(() => curriculum.filter(module => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return module.title.toLowerCase().includes(term) || module.description.toLowerCase().includes(term)
      || module.lessons.some(lesson => lesson.title.toLowerCase().includes(term));
  }), [search]);

  const submitQuiz = () => {
    if (!activeModule || !activeQuiz.length) return;
    if (activeQuiz.some(question => answers[question.id] === undefined)) {
      setQuizError("Answer every question before checking your score.");
      return;
    }
    const score = activeQuiz.filter(question => answers[question.id] === question.answerIndex).length;
    setQuizResult(score);
    setQuizError("");
    if (score === activeQuiz.length && !passed) onQuizPassed(activeModule.id);
  };

  const openModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setAnswers({});
    setQuizResult(null);
    setQuizError("");
  };

  return <div className="gx-room">
    {activeModule ? <>
      <div className="gx-room-breadcrumb">
        <button className="gx-back-link" onClick={() => setActiveModuleId(null)}><ArrowLeft size={15}/> All learning folders</button>
        <span>/</span><span>{activeModule.title}</span>
      </div>
      <div className="gx-folder-hero">
        <div className="gx-folder-icon large"><FolderOpen size={26}/></div>
        <div className="gx-folder-copy">
          <div className="gx-eyebrow">LEARNING FOLDER · {moduleMeta[activeModule.id]?.label ?? "LEARNING PATH"}</div>
          <h1>{activeModule.title}</h1>
          <p>{activeModule.description}</p>
          <div className="gx-folder-meta">
            <span><BookOpen size={14}/>{activeModule.lessons.length} lessons</span>
            <span><Check size={14}/>{activeModule.lessons.filter(lesson => completed.includes(lesson.id)).length} completed</span>
            <span><Trophy size={14}/>{passed ? "Knowledge check passed" : "Knowledge check available"}</span>
          </div>
        </div>
        <div className="gx-folder-progress">
          <strong>{Math.round(activeModule.lessons.filter(lesson => completed.includes(lesson.id)).length / activeModule.lessons.length * 100)}%</strong>
          <span>folder progress</span>
        </div>
      </div>

      <div className="gx-section-heading"><div><span className="gx-eyebrow">YOUR STUDY SEQUENCE</span><h2>Open a lesson</h2></div><span className="gx-soft-tag">LEARN → PRACTISE → CHECK</span></div>
      <div className="gx-lesson-stack">
        {activeModule.lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return <div className="gx-lesson-row" key={lesson.id}>
            <span className="gx-lesson-index">{String(index + 1).padStart(2, "0")}</span>
            <span className={done ? "gx-lesson-state done" : "gx-lesson-state"}>{done ? <Check size={14}/> : <BookOpen size={14}/>}</span>
            <button className="gx-lesson-open" onClick={() => setSelectedLesson(lesson.id)}>
              <b>{lesson.title}</b><small>{lesson.description}</small>
            </button>
            <span className="gx-level">{lesson.level}</span>
            <span className="gx-duration">{lesson.duration}</span>
            <button className={done ? "gx-complete-toggle done" : "gx-complete-toggle"} onClick={() => markComplete(lesson.id)} aria-label={done ? "Mark lesson incomplete" : "Mark lesson complete"} title={done ? "Mark incomplete" : "Mark complete"}>{done ? <Check size={14}/> : <span/>}</button>
          </div>;
        })}
      </div>

      <div className="gx-two-column">
        <section className="gx-room-section">
          <div className="gx-section-heading"><div><span className="gx-eyebrow">USE THE BEST RESOURCE AVAILABLE</span><h2>Learn from trusted sources</h2></div></div>
          <p className="gx-section-note">We link out when a high-quality course or book already exists. Finance OS adds the sequence, practice and progress layer instead of rebuilding the same material.</p>
          <div className="gx-resource-list">
            {resourceLibrary.filter(resource => resource.modules.includes(activeModule.id)).slice(0, 4).map(resource => <ResourceCard key={resource.id} resource={resource}/>)}
          </div>
        </section>
        <section className="gx-quiz-card">
          <div className="gx-quiz-top"><span className="gx-eyebrow">KNOWLEDGE CHECK</span><span className="gx-points-chip"><Zap size={13}/> +15 DP</span></div>
          <h2>Can you explain it?</h2>
          <p>Answer both questions correctly to earn Dividend Points. You can retry until you pass; points are awarded only once for this folder.</p>
          {passed ? <div className="gx-quiz-passed"><Trophy size={22}/><b>Folder assessment passed</b><span>You have already earned this folder's 15 DP.</span></div> : <>
            {activeQuiz.map((question, index) => <div className="gx-question" key={question.id}>
              <b><span>{String(index + 1).padStart(2, "0")}</span>{question.prompt}</b>
              <div className="gx-options">{question.options.map((option, optionIndex) => <label className={answers[question.id] === optionIndex ? "selected" : ""} key={option}>
                <input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => { setAnswers(previous => ({ ...previous, [question.id]: optionIndex })); setQuizResult(null); setQuizError(""); }}/>
                <span>{option}</span>
              </label>)}</div>
              {quizResult !== null && <div className={answers[question.id] === question.answerIndex ? "gx-answer-note correct" : "gx-answer-note"}>{question.explanation}</div>}
            </div>)}
            {quizError && <p className="gx-form-error" role="alert">{quizError}</p>}
            {quizResult === null ? <button className="gx-primary-button" onClick={submitQuiz}>Check answers <ArrowRight size={15}/></button> : quizResult === activeQuiz.length
              ? <div className="gx-score-success"><Check size={16}/> Perfect score. 15 Dividend Points added to your wallet.</div>
              : <div className="gx-quiz-retry"><span>{quizResult}/{activeQuiz.length} correct. Review the explanations and try again.</span><button className="gx-secondary-button" onClick={() => { setAnswers({}); setQuizResult(null); }}>Try again</button></div>}
          </>}
        </section>
      </div>
    </> : <>
      <div className="gx-page-intro">
        <div><div className="gx-eyebrow">THE FINANCE OS LEARNING LIBRARY</div><h1>Learn finance. Build judgement.</h1><p>Pick a folder, follow a clear sequence, learn from the best resources on the internet and prove what you understood.</p></div>
        <div className="gx-points-wallet"><span><Zap size={15}/> DIVIDEND POINTS</span><strong>{points.toLocaleString("en-IN")} <small>DP</small></strong><button onClick={onOpenRewards}>View rewards <ArrowRight size={13}/></button></div>
      </div>
      <div className="gx-guidance-banner"><div className="gx-guidance-icon"><Sparkles size={18}/></div><div><b>How this learning system works</b><p>Use a trusted external course for the explanation, open our lessons for finance-specific examples, then complete a short quiz. Finish folders to unlock points and practical case files.</p></div><span className="gx-guidance-step">01 / 03</span></div>
      <div className="gx-continue-card">
        <div className="gx-continue-icon"><Target size={20}/></div>
        <div><span className="gx-eyebrow">RECOMMENDED NEXT FOLDER</span><b>{nextModule?.title ?? "You have completed the starter curriculum"}</b><small>{nextModule?.description ?? "Explore career tracks or deepen your valuation and modelling practice."}</small></div>
        {nextModule && <button className="gx-secondary-button" onClick={() => openModule(nextModule.id)}>Continue <ArrowRight size={14}/></button>}
      </div>
      <div className="gx-library-toolbar"><div><span className="gx-eyebrow">THE CURRICULUM</span><h2>Learning folders</h2></div><label className="gx-search"><Search size={15}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search folders or lessons" aria-label="Search folders or lessons"/></label></div>
      <div className="gx-folder-grid">
        {filteredModules.map((module, index) => {
          const meta = moduleMeta[module.id] ?? moduleMeta.foundations;
          const done = module.lessons.filter(lesson => completed.includes(lesson.id)).length;
          const percent = Math.round(done / module.lessons.length * 100);
          const linkedResources = resourceLibrary.filter(resource => resource.modules.includes(module.id));
          return <button className="gx-folder-card" key={module.id} onClick={() => openModule(module.id)}>
            <div className="gx-folder-card-top"><span className={"gx-folder-icon " + meta.color}><Folder size={20}/></span><span className="gx-folder-label">{meta.label}</span><ArrowUpRight size={17}/></div>
            <b>{module.title}</b><p>{meta.outcome}</p>
            <div className="gx-folder-card-bottom"><span>{done}/{module.lessons.length} lessons</span><span>{linkedResources.length} external resources</span></div>
            <div className="gx-progress-line"><span style={{ width: percent + "%" }}/></div>
          </button>;
        })}
        {filteredModules.length === 0 && <div className="gx-empty">No folder matches that search. Try a broader finance topic.</div>}
      </div>
    </>}
  </div>;
}

export function ResourcesRoom() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filters = ["All", "Beginner", "Intermediate", "Advanced", "Paid credential"];
  const resources = resourceLibrary.filter(resource => {
    const matchesFilter = filter === "All" || resource.level === filter || resource.access === filter;
    const term = search.trim().toLowerCase();
    return matchesFilter && (!term || (resource.title + " " + resource.provider + " " + resource.description).toLowerCase().includes(term));
  });
  return <div className="gx-room">
    <div className="gx-page-intro"><div><div className="gx-eyebrow">CURATED EXTERNAL LEARNING</div><h1>Don't rebuild what already exists.</h1><p>High-quality free courses, official learning material and serious finance references—collected in one place and mapped to our curriculum.</p></div><div className="gx-resource-total"><strong>{resourceLibrary.length}</strong><span>curated resources</span></div></div>
    <div className="gx-guidance-banner compact"><div className="gx-guidance-icon"><ShieldCheck size={18}/></div><div><b>Quality over quantity</b><p>Links are curated from official institutions, universities and established providers. External websites have their own terms, availability and pricing. Paid credentials are labelled.</p></div></div>
    <div className="gx-resource-toolbar"><label className="gx-search"><Search size={15}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search providers, courses or topics" aria-label="Search external resources"/></label><div className="gx-filter-pills">{filters.map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    <div className="gx-resource-grid">{resources.map(resource => <ResourceCard key={resource.id} resource={resource}/>)}</div>
    {resources.length === 0 && <div className="gx-empty">No resource found. Clear the filter or try a different search.</div>}
    <div className="gx-editorial-note"><CircleHelp size={16}/><p>We do not claim ownership of third-party lessons. Finance OS provides the learning map, local exercises and progress tracking; the linked provider hosts its own content.</p></div>
  </div>;
}

export function CareerRoom() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const track = activeTrack === null ? null : tracks[activeTrack];
  const recommendedResources = track ? (resourceIdsByCareer[track.name] ?? []).map(id => resourceLibrary.find(resource => resource.id === id)).filter(Boolean) as (typeof resourceLibrary[number])[] : [];
  return <div className="gx-room">
    {track && activeTrack !== null ? <>
      <div className="gx-room-breadcrumb"><button className="gx-back-link" onClick={() => setActiveTrack(null)}><ArrowLeft size={15}/> All career folders</button><span>/</span><span>{track.name}</span></div>
      <div className="gx-folder-hero career">
        <div className="gx-folder-icon large"><BriefcaseBusiness size={25}/></div>
        <div className="gx-folder-copy"><div className="gx-eyebrow">CAREER OS · ROLE PATHWAY</div><h1>{track.name}</h1><p>Build the skills behind this role and produce work samples that show how you think—not just what courses you watched.</p><div className="gx-folder-meta"><span><Target size={14}/>{track.skills.length} core capabilities</span><span><FileSpreadsheet size={14}/>Portfolio-based learning</span></div></div>
      </div>
      <div className="gx-career-detail-grid">
        <section className="gx-room-section"><div className="gx-section-heading"><div><span className="gx-eyebrow">SKILLS TO BUILD</span><h2>What the role uses</h2></div></div><div className="gx-skill-grid">{track.skills.map((skill, index) => <div className="gx-skill-chip" key={skill}><span>{String(index + 1).padStart(2, "0")}</span>{skill}</div>)}</div><div className="gx-capstone-card"><div className="gx-guidance-icon"><Award size={18}/></div><div><span className="gx-eyebrow">YOUR PORTFOLIO CHALLENGE</span><b>Build evidence, not just a certificate</b><p>{careerOutcomes[track.name] ?? "Complete a role-relevant case and explain your assumptions, evidence and limitations."}</p></div></div></section>
        <section className="gx-room-section"><div className="gx-section-heading"><div><span className="gx-eyebrow">START WITH THESE</span><h2>Recommended resources</h2></div></div><div className="gx-resource-list">{recommendedResources.map(resource => <ResourceCard key={resource.id} resource={resource}/>)}</div><div className="gx-career-next"><b>Suggested next step</b><p>Choose one capability, study one external resource, then create a short work sample and add it to your portfolio.</p></div></section>
      </div>
    </> : <>
      <div className="gx-page-intro"><div><div className="gx-eyebrow">CAREER OS</div><h1>Choose the work you want to master.</h1><p>Role folders map the skills, learning resources and practical evidence associated with seven finance career paths.</p></div><div className="gx-resource-total"><strong>{tracks.length}</strong><span>career folders</span></div></div>
      <div className="gx-guidance-banner compact"><div className="gx-guidance-icon"><BriefcaseBusiness size={18}/></div><div><b>How to use Career OS</b><p>Open a role folder, pick a capability, learn it from a trusted source and create an output you can defend in an interview.</p></div></div>
      <div className="gx-career-grid">{tracks.map((item, index) => <button className="gx-career-card" key={item.name} onClick={() => setActiveTrack(index)}><div className="gx-folder-card-top"><span className="gx-folder-icon lavender"><Folder size={20}/></span><span className="gx-folder-label">CAREER PATH {String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={17}/></div><b>{item.name}</b><p>{item.skills.slice(0, 4).join(" · ")}</p><div className="gx-folder-card-bottom"><span>{item.skills.length} capabilities</span><span>Open pathway <ChevronRight size={13}/></span></div></button>)}</div>
    </>}
  </div>;
}

const rewardCatalog = [
  {
    id: "analyst-checklist", title: "Analyst Starter Pack", category: "Research toolkit", cost: 20,
    description: "A practical checklist for screening a company before writing an investment view.",
    content: [
      "Business: What does the company sell, to whom, and why do customers choose it?",
      "Industry: What drives demand, pricing, capacity and competition?",
      "Financials: Track revenue growth, margins, cash conversion, debt and return on capital.",
      "Valuation: Compare the implied expectations with a sensible base, upside and downside case.",
      "Risks: Write down what would invalidate the thesis and what evidence you need next."
    ]
  },
  {
    id: "valuation-case", title: "DCF Sensitivity Case File", category: "Valuation practice", cost: 45,
    description: "A guided scenario brief for testing WACC, terminal growth and operating assumptions.",
    content: [
      "Base case: Starting FCF ₹100 crore, annual growth 8%, WACC 12%, terminal growth 4%, five forecast years.",
      "Downside case: Reduce growth to 4%, raise WACC to 13%, and reduce terminal growth to 3%.",
      "Upside case: Increase growth to 10%, reduce WACC to 11%, and use terminal growth of 4%.",
      "Deliverable: Present enterprise value, equity value, a sensitivity table and three limitations.",
      "Check: Terminal growth must stay below WACC. Explain why terminal value can dominate a DCF."
    ]
  },
  {
    id: "interview-vault", title: "Finance Interview Vault", category: "Career preparation", cost: 70,
    description: "A question pack for explaining accounting, valuation, markets and your own work.",
    content: [
      "Accounting: Walk through how a ₹10 depreciation increase affects all three statements.",
      "Valuation: Why can two companies with identical EBITDA trade at different EV/EBITDA multiples?",
      "Markets: Explain why a bond price can fall when market yields rise.",
      "Modelling: What checks do you build to catch a broken three-statement model?",
      "Behavioural: Tell me about an assumption you changed after seeing contradictory evidence."
    ]
  },
  {
    id: "startup-case", title: "Startup Finance Case Room", category: "Applied case", cost: 100,
    description: "An early-stage business case covering runway, unit economics, pricing and financing trade-offs.",
    content: [
      "A subscription startup has 2,000 paying customers, ₹900 monthly average revenue per user and 5% monthly churn.",
      "Monthly gross margin is 72%; monthly fixed operating costs are ₹18 lakh; cash balance is ₹1.2 crore.",
      "Calculate monthly recurring revenue, gross profit, approximate runway and the effect of reducing churn to 3.5%.",
      "Recommend two operating changes before raising capital. State what data you would request.",
      "Do not confuse accounting revenue, cash collections and contracted ARR."
    ]
  }
];

type RewardsRoomProps = {
  points: number;
  unlockedIds: string[];
  onRedeem: (id: string, cost: number) => void;
};

export function RewardsRoom({ points, unlockedIds, onRedeem }: RewardsRoomProps) {
  const [openReward, setOpenReward] = useState<string | null>(null);
  return <div className="gx-room">
    <div className="gx-page-intro"><div><div className="gx-eyebrow">DIVIDEND POINTS WALLET</div><h1>Make learning unlock something.</h1><p>Earn points for completing lessons and proving your understanding. Spend them on useful practice material inside Finance OS.</p></div><div className="gx-wallet-card"><span><Zap size={15}/> YOUR BALANCE</span><strong>{points.toLocaleString("en-IN")} <small>DP</small></strong><small>Dividend Points</small></div></div>
    <div className="gx-guidance-banner compact"><div className="gx-guidance-icon"><Gift size={18}/></div><div><b>Rewards are earned through learning</b><p>Complete a lesson once to earn 5 DP. Pass a folder quiz with a perfect score to earn 15 DP. Rewards unlock extra content in this website; points have no cash value and are not financial dividends, securities or investment returns.</p></div></div>
    <div className="gx-reward-grid">{rewardCatalog.map(reward => {
      const unlocked = unlockedIds.includes(reward.id);
      const affordable = points >= reward.cost;
      return <article className={unlocked ? "gx-reward-card unlocked" : "gx-reward-card"} key={reward.id}>
        <div className="gx-reward-card-top"><span className="gx-reward-icon">{unlocked ? <Check size={20}/> : <Gift size={20}/>}</span><span className="gx-access">{reward.category}</span></div>
        <h2>{reward.title}</h2><p>{reward.description}</p>
        <div className="gx-reward-cost"><strong>{reward.cost} DP</strong><span>{unlocked ? "Unlocked" : affordable ? "Ready to unlock" : (reward.cost - points) + " DP to go"}</span></div>
        {unlocked ? <button className="gx-primary-button" onClick={() => setOpenReward(openReward === reward.id ? null : reward.id)}>{openReward === reward.id ? "Hide content" : "Open unlocked content"} <ArrowRight size={14}/></button>
          : <button className="gx-secondary-button" disabled={!affordable} onClick={() => onRedeem(reward.id, reward.cost)}><LockKeyhole size={14}/>{affordable ? "Unlock with points" : "Keep learning"}</button>}
        {unlocked && openReward === reward.id && <div className="gx-reward-content"><b>Unlocked content</b><ul>{reward.content.map(item => <li key={item}>{item}</li>)}</ul></div>}
      </article>;
    })}</div>
    <div className="gx-editorial-note"><ShieldCheck size={16}/><p>In this prototype, wallet balances and unlocks are stored in your browser. They are not secure, transferable or shared across devices. Server-side verification will be needed before operating a public leaderboard or rewards programme.</p></div>
  </div>;
}
