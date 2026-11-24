import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, BookOpen, BriefcaseBusiness, BrainCircuit, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Coins, Compass, GraduationCap, LayoutDashboard, LineChart, Menu, Newspaper, Plus, Search, Send, ShieldCheck, Sparkles, Target, TrendingUp, Wallet, X, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { curriculum, newsCases, tracks, watchlist } from "./data";
import { lessonContent } from "./data/lessonContent";
import { deriveHoldings, executeSimulatedOrder } from "./lib/simulator";
import { calculateDcf } from "./lib/finance";
import { reviewAnalysis } from "./lib/review";

type Page = "Overview" | "Learn" | "Markets" | "News Lab" | "Career" | "Workbench" | "My Progress" | "AI Mentor";
type Trade = { symbol: string; side: "BUY" | "SELL"; quantity: number; price: number; date: string };
const nav: { label: Page; icon: typeof LayoutDashboard; group: string }[] = [
  { label: "Overview", icon: LayoutDashboard, group: "Workspace" },
  { label: "Learn", icon: BookOpen, group: "Workspace" },
  { label: "Markets", icon: LineChart, group: "Workspace" },
  { label: "News Lab", icon: Newspaper, group: "Workspace" },
  { label: "Career", icon: BriefcaseBusiness, group: "Develop" },
  { label: "Workbench", icon: Coins, group: "Develop" },
  { label: "My Progress", icon: Target, group: "Develop" },
  { label: "AI Mentor", icon: BrainCircuit, group: "Develop" }
];
const chartData = [
  { day: "Mon", value: 9.82 }, { day: "Tue", value: 9.91 }, { day: "Wed", value: 9.87 },
  { day: "Thu", value: 10.04 }, { day: "Fri", value: 10.12 }, { day: "Mon", value: 10.08 },
  { day: "Tue", value: 10.24 }, { day: "Wed", value: 10.19 }, { day: "Thu", value: 10.36 },
  { day: "Fri", value: 10.48 }, { day: "Mon", value: 10.42 }, { day: "Tue", value: 10.63 }
];
const money = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
const readStored = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};

export default function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [completed, setCompleted] = useState<string[]>(() => readStored("fos-completed", ["fin-101"]));
  const [trades, setTrades] = useState<Trade[]>(() => readStored("fos-trades", []));
  const [cash, setCash] = useState(() => readStored("fos-cash", 1000000));
  const [mentorInput, setMentorInput] = useState("");
  const [mentorMessages, setMentorMessages] = useState<{ role: string; text: string }[]>([{ role: "assistant", text: "Welcome to Finance OS. I can help you reason through finance concepts, practise calculations and structure your learning. This demo mentor uses guided responses; connect an AI provider to enable model-generated answers." }]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const [search, setSearch] = useState("");
  const [activeNews, setActiveNews] = useState(1);
  const [newsAnswer, setNewsAnswer] = useState("");
  const [newsSubmitted, setNewsSubmitted] = useState(false);
  const [newsReview, setNewsReview] = useState<ReturnType<typeof reviewAnalysis> | null>(null);
  const [tradeSymbol, setTradeSymbol] = useState("RELIANCE");
  const [tradeQty, setTradeQty] = useState("1");
  const [tradeSide, setTradeSide] = useState<"BUY" | "SELL">("BUY");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!selectedLesson) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setSelectedLesson(null); return; }
      if (event.key !== "Tab") return;
      const selector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>(selector) ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    modalCloseRef.current?.focus();
    return () => { window.removeEventListener("keydown", onKeyDown); previousFocus?.focus(); };
  }, [selectedLesson]);

  const allLessons = curriculum.flatMap(m => m.lessons);
  const progress = Math.round(completed.length / allLessons.length * 100);
  const totalLessons = allLessons.length;
  const holdings = useMemo(() => deriveHoldings(trades.map(t => ({ ...t, executedAt: t.date }))), [trades]);
  const invested = Object.entries(holdings).reduce((sum, [symbol, qty]) => sum + qty * (watchlist.find(s => s.symbol === symbol)?.price || 0), 0);
  const save = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be unavailable */ } };
  const go = (next: Page) => { setPage(next); setMobileNav(false); setNotice(""); };
  const markComplete = (id: string) => {
    const next = completed.includes(id) ? completed.filter(x => x !== id) : [...completed, id];
    setCompleted(next); save("fos-completed", next);
  };
  const executeTrade = () => {
    const security = watchlist.find(s => s.symbol === tradeSymbol);
    if (!security) { setNotice("Select a supported instrument."); return; }
    const result = executeSimulatedOrder({
      symbol: tradeSymbol,
      side: tradeSide,
      quantity: Number(tradeQty),
      price: security.price,
      cash,
      currentPosition: holdings[tradeSymbol] || 0
    });
    if (!result.ok) {
      const messages: Record<typeof result.reason, string> = {
        INVALID_SYMBOL: "The selected instrument is invalid.",
        INVALID_SIDE: "Select buy or sell.",
        INVALID_QUANTITY: "Enter a positive whole-number quantity.",
        INVALID_PRICE: "The demo price is invalid. No order was placed.",
        INVALID_CASH: "The simulated account state is invalid. Reset the demo account before continuing.",
        INSUFFICIENT_CASH: "Insufficient virtual cash for this order.",
        INSUFFICIENT_HOLDINGS: "You cannot sell more units than you hold."
      };
      setNotice(messages[result.reason]);
      return;
    }
    const nextTrade: Trade = { ...result.trade, date: result.trade.executedAt };
    const nextTrades = [nextTrade, ...trades];
    setCash(result.cashAfter);
    setTrades(nextTrades);
    save("fos-cash", result.cashAfter);
    save("fos-trades", nextTrades);
    setNotice(`${tradeSide} order simulated: ${result.trade.quantity} ${tradeSymbol} at ${money(result.trade.price)}. No real order was placed.`);
  };
  const submitNews = () => {
    setNewsReview(reviewAnalysis(newsAnswer));
    setNewsSubmitted(true);
  };
  const submitMentor = () => {
    const question = mentorInput.trim(); if (!question) return;
    setMentorMessages(prev => [...prev, { role: "user", text: question }, { role: "assistant", text: "A model is not connected yet, so I will not invent an AI-generated answer. Try framing the question as: (1) what do I know, (2) what assumption am I making, and (3) what evidence would change my conclusion? Add an AI provider key on the backend to enable personalised responses." }]);
    setMentorInput("");
  };
  const total = allLessons.length;
  const lesson = allLessons.find(l => l.id === selectedLesson);
  const lessonContentData = lesson ? lessonContent[lesson.id] : undefined;

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <aside id="primary-sidebar" className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Activity size={20}/></div><div><strong>finance<span>OS</span></strong><small>THE FINANCE LEARNING TERMINAL</small></div><button className="icon-btn mobile-close" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-switch"><div className="avatar">AM</div><div><b>My Workspace</b><small>Personal account</small></div><ChevronDown size={15}/></div>
      <nav aria-label="Primary navigation">{["Workspace", "Develop"].map(group => <div className="nav-group" key={group}><p className="nav-label">{group}</p>{nav.filter(n => n.group === group).map(item => <button key={item.label} className={`nav-item ${page === item.label ? "active" : ""}`} aria-current={page === item.label ? "page" : undefined} onClick={() => go(item.label)}><item.icon size={17}/><span>{item.label}</span>{item.label === "News Lab" && <i className="nav-dot"/>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="mentor-mini"><div className="mentor-icon"><Sparkles size={16}/></div><div><b>Your AI Mentor</b><small>Here to sharpen your thinking</small></div><ChevronRight size={15}/></div><div className="profile-row"><div className="avatar">AM</div><div><b>Aman</b><small>Finance learner</small></div><button className="icon-btn" aria-label="Open progress profile" onClick={() => go("My Progress")}><ChevronRight size={16}/></button></div></div>
    </aside>
    {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)}/>}
    <main id="main-content" tabIndex={-1} className="main-area">
      <header className="topbar"><div className="crumb"><button className="icon-btn menu-btn" aria-label="Open navigation" aria-controls="primary-sidebar" aria-expanded={mobileNav} onClick={() => setMobileNav(true)}><Menu size={19}/></button><span>Finance OS</span><ChevronRight size={14}/><b>{page}</b></div><div className="top-actions"><div className="live-pill"><span/> Demo environment</div><button className="top-avatar" aria-label="AM — Open progress profile" onClick={() => go("My Progress")}>AM</button></div></header>
      <div className="content">
        {notice && <div className="notice"><ShieldCheck size={16}/>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15}/></button></div>}
        {page === "Overview" && <Overview progress={progress} completed={completed.length} total={total} go={go} cash={cash} invested={invested} trades={trades.length} />}
        {page === "Learn" && <Learn completed={completed} markComplete={markComplete} setSelectedLesson={setSelectedLesson} search={search} setSearch={setSearch}/>}
        {page === "Markets" && <Markets cash={cash} invested={invested} holdings={holdings} trades={trades} tradeSymbol={tradeSymbol} setTradeSymbol={setTradeSymbol} tradeQty={tradeQty} setTradeQty={setTradeQty} tradeSide={tradeSide} setTradeSide={setTradeSide} executeTrade={executeTrade}/>}
        {page === "News Lab" && <NewsLab active={activeNews} setActive={id => {setActiveNews(id); setNewsAnswer(""); setNewsSubmitted(false); setNewsReview(null);}} answer={newsAnswer} setAnswer={setNewsAnswer} submitted={newsSubmitted} review={newsReview} submit={submitNews}/>}
        {page === "Career" && <Career />}
        {page === "Workbench" && <Workbench />}
        {page === "My Progress" && <Progress completed={completed} total={total} progress={progress} trades={trades.length}/>}
        {page === "AI Mentor" && <Mentor messages={mentorMessages} value={mentorInput} setValue={setMentorInput} submit={submitMentor}/>}
      </div>
      <footer className="footer"><span>FINANCE OS <i>v0.1.0</i></span><span>Educational use only · Simulated data unless stated otherwise</span><span>Built to turn knowledge into practice <Zap size={12}/></span></footer>
    </main>
    {selectedLesson && lesson && <div className="modal-backdrop" onClick={() => setSelectedLesson(null)}><div ref={modalRef} className="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title" tabIndex={-1} onClick={e => e.stopPropagation()}><div className="modal-head"><span className="eyebrow">LESSON · {lesson.level.toUpperCase()}</span><button ref={modalCloseRef} className="icon-btn" aria-label="Close lesson" onClick={() => setSelectedLesson(null)}><X size={18}/></button></div><h2 id="lesson-title">{lesson.title}</h2><p className="muted">{lesson.description}</p><section className="lesson-key-idea"><div className="eyebrow">KEY IDEA</div><p>{lessonContentData?.keyIdea ?? lesson.description}</p></section><div className="lesson-callout"><b>Concept walkthrough</b><p>{lessonContentData?.explanation ?? "Connect the definition to a practical financial decision. Identify the assumptions and what evidence could change your conclusion."}</p></div><section className="lesson-example"><div className="eyebrow">WORKED EXAMPLE</div><p>{lessonContentData?.workedExample ?? "Work through a numerical or real-world illustration before attempting the exercise."}</p></section><section className="exercise-box"><div className="eyebrow">APPLY WHAT YOU LEARNED</div><b>Try it yourself</b><p>{lessonContentData?.exercise ?? "Explain the concept in your own words and apply it to a practical situation."}</p><details><summary>Reveal guided answer</summary><p>{lessonContentData?.answer ?? "Explain the reasoning step by step, state assumptions and identify at least one limitation."}</p></details></section><div className="modal-actions"><span><Clock3 size={14}/>{lesson.duration}</span><button className="primary-btn" onClick={() => {markComplete(lesson.id); setSelectedLesson(null);}}> <Check size={15}/> {completed.includes(lesson.id) ? "Mark as incomplete" : "Mark lesson complete"}</button></div></div></div>}
  </div>;
}

function PageTitle({eyebrow, title, description, action}: {eyebrow: string; title: string; description: string; action?: ReactNode}) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}
function Overview({progress, completed, total, go, cash, invested, trades}: {progress:number; completed:number; total:number; go:(p:Page)=>void; cash:number; invested:number; trades:number}) {
  return <>
    <PageTitle eyebrow={`${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).toUpperCase()} · YOUR LEARNING DESK`} title="Good morning, Aman." description="Build practical finance skills, one deliberate decision at a time." action={<button className="outline-btn" onClick={() => go("Learn")}><Compass size={15}/> Open learning path</button>}/>
    <div className="hero-panel"><div className="hero-copy"><div className="hero-kicker"><span className="spark-dot"/> YOUR FINANCE JOURNEY</div><h2>Don't just learn finance.<br/><em>Learn to think in finance.</em></h2><p>Your learning desk connects concepts, market simulations and practical work into one continuous journey.</p><button className="light-btn" onClick={() => go("Learn")}>Continue learning <ArrowRight size={15}/></button></div><div className="hero-orbit"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><Activity size={30}/></div><span className="orbit-node node-a"><BookOpen size={15}/></span><span className="orbit-node node-b"><LineChart size={15}/></span><span className="orbit-node node-c"><BrainCircuit size={15}/></span></div><div className="hero-index">01 <span>/ 08</span></div></div>
    <div className="stats-grid"><Stat label="Learning progress" value={`${progress}%`} sub={`${completed} of ${total} lessons complete`} icon={GraduationCap} trend="Your journey so far"/><Stat label="Virtual cash" value={money(cash)} sub="Paper trading balance" icon={Wallet} trend="Simulated account"/><Stat label="Portfolio value" value={money(cash+invested)} sub={`${trades} simulated orders`} icon={TrendingUp} trend="Cash + holdings"/><Stat label="Learning streak" value="1 day" sub="Show up and compound knowledge" icon={Zap} trend="Consistency beats intensity"/> </div>
    <div className="dashboard-grid"><section className="panel learning-panel"><div className="panel-head"><div><div className="eyebrow">PICK UP WHERE YOU LEFT OFF</div><h3>Your learning path</h3></div><button className="text-btn" onClick={() => go("Learn")}>View curriculum <ArrowRight size={14}/></button></div><div className="learning-row"><div className="lesson-number">01</div><div className="lesson-info"><b>Financial Foundations</b><p>Start with the principles behind money and markets.</p><div className="progress-track"><span style={{width:`${Math.min(progress,100)}%`}}/></div><small>{completed} lessons completed across the curriculum</small></div><button className="round-arrow" aria-label="Open learning path" onClick={() => go("Learn")}><ArrowRight size={16}/></button></div><div className="module-links">{["Markets & Instruments","Accounting & Statements","Corporate Finance & Valuation"].map((s,i)=><button key={s} onClick={() => go("Learn")}><span className="module-index">0{i+2}</span>{s}<ChevronRight size={15}/></button>)}</div></section>
      <section className="panel chart-panel"><div className="panel-head"><div><div className="eyebrow">SIMULATED ACCOUNT</div><h3>Portfolio snapshot</h3></div><span className="tag">DEMO DATA</span></div><div className="chart-value">{money(cash+invested)} <span className="positive"><ArrowUpRight size={13}/>Virtual account</span></div><div className="chart-wrap" role="img" aria-label="Illustrative portfolio index chart. Values are simulated and are not actual market returns."><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#72c6ab" stopOpacity={0.22}/><stop offset="95%" stopColor="#72c6ab" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e5ece8" vertical={false}/><XAxis dataKey="day" tick={{fill:"#7b8b82",fontSize:11}} axisLine={false} tickLine={false}/><YAxis hide domain={["dataMin - 0.2","dataMax + 0.2"]}/><Tooltip contentStyle={{background:"#ffffff",border:"1px solid #dce7e0",borderRadius:10,color:"#24382d",boxShadow:"0 8px 24px rgba(24,58,39,.12)"}} formatter={(v:any)=>[`${v}L`,"Portfolio index"]}/><Area type="monotone" dataKey="value" stroke="#72c6ab" strokeWidth={2} fill="url(#chartFill)"/></AreaChart></ResponsiveContainer></div><div className="chart-foot"><span>Illustrative index · not actual market performance</span><button className="text-btn" onClick={() => go("Markets")}>Open markets <ArrowRight size={13}/></button></div></section></div>
    <div className="bottom-grid"><section className="panel"><div className="panel-head"><div><div className="eyebrow">TODAY'S FOCUS</div><h3>Make one idea practical</h3></div><span className="date-chip">24 NOV</span></div><div className="focus-card"><div className="focus-icon"><Newspaper size={18}/></div><div><b>Why cash flow matters more than a headline growth rate</b><p>Work through a short company-analysis case in the News Lab.</p><button className="text-btn" onClick={() => go("News Lab")}>Start the challenge <ArrowRight size={13}/></button></div></div></section><section className="panel mentor-panel"><div className="panel-head"><div><div className="eyebrow">YOUR PERSONAL GUIDE</div><h3>Ask the AI Mentor</h3></div><BrainCircuit size={20} className="muted-icon"/></div><p>Stuck on a concept? Challenge an assumption or get a clearer learning direction.</p><button className="outline-btn full-btn" onClick={() => go("AI Mentor")}>Open mentor <ArrowRight size={14}/></button></section></div>
  </>;
}
function Stat({label,value,sub,icon:Icon,trend}:{label:string;value:string;sub:string;icon:typeof Activity;trend:string}) {return <div className="stat-card"><div className="stat-top"><span>{label}</span><i><Icon size={17}/></i></div><strong>{value}</strong><p>{sub}</p><small>{trend}</small></div>}

function Learn({completed,markComplete,setSelectedLesson,search,setSearch}:{completed:string[];markComplete:(id:string)=>void;setSelectedLesson:(id:string)=>void;search:string;setSearch:(s:string)=>void}) {
  const filtered = curriculum.map(m=>({...m,lessons:m.lessons.filter(l=>l.title.toLowerCase().includes(search.toLowerCase())||m.title.toLowerCase().includes(search.toLowerCase()))})).filter(m=>m.lessons.length);
  return <><PageTitle eyebrow="THE FINANCE LEARNING ENGINE" title="Learn by understanding." description="A structured path from financial foundations to professional application."/><div className="learn-summary"><div><BookOpen size={19}/><span><b>{completed.length} lessons completed</b><small>Progress is saved in this browser on this device.</small></span></div><div className="searchbox"><Search size={16}/><input aria-label="Search lessons and modules" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics or modules"/></div></div><div className="curriculum-list">{filtered.map((m,i)=><section className="panel module-card" key={m.id}><div className="module-header"><div className="module-number">{String(i+1).padStart(2,"0")}</div><div><h3>{m.title}</h3><p>{m.description}</p></div><span className="module-count">{m.lessons.filter(l=>completed.includes(l.id)).length}/{m.lessons.length} DONE</span></div><div className="lesson-list">{m.lessons.map(l=><div className="lesson-item" key={l.id}><button className={`check-circle ${completed.includes(l.id)?"checked":""}`} aria-label={completed.includes(l.id) ? `Mark ${l.title} incomplete` : `Mark ${l.title} complete`} aria-pressed={completed.includes(l.id)} onClick={()=>markComplete(l.id)}>{completed.includes(l.id)?<Check size={13}/>:null}</button><button className="lesson-name" onClick={()=>setSelectedLesson(l.id)}><b>{l.title}</b><small>{l.description}</small></button><span className="level-tag">{l.level}</span><span className="duration"><Clock3 size={13}/>{l.duration}</span><button className="round-arrow small" aria-label={`Open ${l.title} lesson`} onClick={()=>setSelectedLesson(l.id)}><ArrowRight size={14}/></button></div>)}</div></section>)}</div></>;
}

function Markets({cash,invested,holdings,trades,tradeSymbol,setTradeSymbol,tradeQty,setTradeQty,tradeSide,setTradeSide,executeTrade}:{cash:number;invested:number;holdings:Record<string,number>;trades:Trade[];tradeSymbol:string;setTradeSymbol:(s:string)=>void;tradeQty:string;setTradeQty:(s:string)=>void;tradeSide:"BUY"|"SELL";setTradeSide:(s:"BUY"|"SELL")=>void;executeTrade:()=>void}) {
 return <><PageTitle eyebrow="MARKET SIMULATION LAB" title="Practise your decisions." description="Explore a sample watchlist and place simulated orders using virtual capital." action={<span className="tag"><span className="tag-dot"/> MARKET DATA: DEMO</span>}/><div className="stats-grid market-stats"><Stat label="Available cash" value={money(cash)} sub="Virtual buying power" icon={Wallet} trend="No real money involved"/><Stat label="Holdings value" value={money(invested)} sub="Based on illustrative prices" icon={Coins} trend="Mark-to-demo-price"/><Stat label="Open positions" value={String(Object.values(holdings).filter(q=>q>0).length)} sub="Net positive holdings" icon={BriefcaseBusiness} trend="Paper portfolio"/></div><div className="markets-layout"><section className="panel"><div className="panel-head"><div><div className="eyebrow">INDIA WATCHLIST</div><h3>Market monitor</h3></div><span className="tag">ILLUSTRATIVE PRICES</span></div><div className="watch-table"><div className="table-head"><span>INSTRUMENT</span><span>LAST PRICE</span><span>CHANGE</span><span>HOLDING</span></div>{watchlist.map(s=><div className="watch-row" key={s.symbol}><div><b>{s.symbol}</b><small>{s.name}</small></div><b>{money(s.price)}</b><span className={s.change>=0?"positive":"negative"}>{s.change>=0?"+":""}{s.change.toFixed(2)}%</span><span>{holdings[s.symbol]||0}</span></div>)}</div><p className="disclaimer"><CircleHelp size={14}/> These are hardcoded illustrative prices for product demonstration, not live quotes.</p></section><section className="panel order-panel"><div className="eyebrow">VIRTUAL ORDER TICKET</div><h3>Place an order</h3><div className="segmented"><button className={tradeSide==="BUY"?"buy-active":""} onClick={()=>setTradeSide("BUY")}>Buy</button><button className={tradeSide==="SELL"?"sell-active":""} onClick={()=>setTradeSide("SELL")}>Sell</button></div><label htmlFor="trade-symbol">Instrument</label><select id="trade-symbol" value={tradeSymbol} aria-label="Instrument" onChange={e=>setTradeSymbol(e.target.value)}>{watchlist.map(s=><option key={s.symbol} value={s.symbol}>{s.symbol} · {s.name}</option>)}</select><label htmlFor="trade-quantity">Quantity</label><input id="trade-quantity" aria-label="Quantity" type="number" min="1" step="1" value={tradeQty} onChange={e=>setTradeQty(e.target.value)}/><div className="order-estimate"><span>Indicative price</span><b>{money(watchlist.find(s=>s.symbol===tradeSymbol)?.price||0)}</b></div><button className="primary-btn full-btn" onClick={executeTrade}>{tradeSide==="BUY"?"Simulate buy":"Simulate sell"} <ArrowRight size={14}/></button><p className="micro-note">Orders execute instantly at the static demo price. No exchange, broker or live feed is connected.</p></section></div><section className="panel history-panel"><div className="panel-head"><div><div className="eyebrow">YOUR DECISION LOG</div><h3>Order history</h3></div><span className="tag">{trades.length} ORDERS</span></div>{trades.length===0?<div className="empty-state">Your simulated orders will appear here. Start with a small position and record the reasoning behind it.</div>:<div className="trade-history">{trades.slice(0,8).map((t,i)=><div key={i}><span className={t.side==="BUY"?"buy-pill":"sell-pill"}>{t.side}</span><b>{t.symbol}</b><span>{t.quantity} units</span><span>{money(t.price)}</span><small>{t.date}</small></div>)}</div>}</section></>;
}

function NewsLab({active,setActive,answer,setAnswer,submitted,review,submit}:{active:number;setActive:(id:number)=>void;answer:string;setAnswer:(s:string)=>void;submitted:boolean;review:ReturnType<typeof reviewAnalysis>|null;submit:()=>void}) {
  const item=newsCases.find(n=>n.id===active)!;
  return <><PageTitle eyebrow="FINANCIAL NEWS INTELLIGENCE" title="Read the event. Build the view." description="Practise turning a market development into a structured financial argument."/>
    <div className="news-layout">
      <section className="news-main">
        <div className="news-feature">
          <div className="news-feature-top"><span className="tag">{item.category}</span><span>{item.date}</span></div>
          <div className="news-illustration"><div className="news-ring ring-1"/><div className="news-ring ring-2"/><div className="news-symbol"><Newspaper size={28}/></div><span className="news-label">ANALYST BRIEFING</span></div>
          <h2>{item.headline}</h2><p>{item.summary}</p>
          <div className="source-note"><ShieldCheck size={15}/> Scenario created for practice · Not a live news report</div>
        </div>
        <div className="panel response-panel">
          <div className="eyebrow">YOUR ANALYSIS</div><h3>Think like an analyst</h3><p>{item.question}</p>
          <label className="sr-only" htmlFor="news-analysis">Your written analysis</label>
          <textarea id="news-analysis" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Structure your response. State assumptions, explain mechanisms and include a counterargument..." rows={7} maxLength={8000}/>
          <div className="response-actions"><span>{answer.trim().split(/\s+/).filter(Boolean).length} words · {answer.length}/8000</span><button className="primary-btn" onClick={submit} disabled={answer.trim().length<30}>Review my analysis <ArrowRight size={14}/></button></div>
          {submitted&&review&&<section className="review-results" aria-live="polite">
            <div className="review-summary"><div><span className="eyebrow">STRUCTURED REVIEW</span><strong>{review.total}<small> / {review.maxScore}</small></strong><b>{review.band}</b></div><p>This is a transparent keyword-and-structure rubric, not an AI judgement or a prediction of market outcomes.</p></div>
            <div className="review-dimensions">{review.dimensions.map(d=><div className="review-dimension" key={d.dimension}><div><b>{d.label}</b><strong>{d.score}/4</strong></div><div className="review-meter"><span style={{width:`${d.score/4*100}%`}}/></div><p>{d.feedback}</p></div>)}</div>
            {review.strengths.length>0&&<div className="review-feedback"><b>What is already present</b><p>{review.strengths.join(" · ")}</p></div>}
            {review.nextSteps.length>0&&<div className="review-feedback"><b>Improve next</b><ul>{review.nextSteps.map((step,i)=><li key={i}>{step}</li>)}</ul></div>}
          </section>}
        </div>
      </section>
      <aside className="news-sidebar panel"><div className="eyebrow">CASE LIBRARY</div><h3>Practice briefings</h3>{newsCases.map(n=><button key={n.id} className={`case-item ${active===n.id?"selected":""}`} onClick={()=>setActive(n.id)}><span>{String(n.id).padStart(2,"0")} · {n.category}</span><b>{n.headline}</b><small>5–10 min exercise <ChevronRight size={13}/></small></button>)}<div className="tip-card"><Target size={17}/><b>What good analysis looks like</b><p>Mechanism → affected parties → magnitude → uncertainty → alternative explanation.</p></div></aside>
    </div>
  </>;
}

function Career() {const [track,setTrack]=useState(0);return <><PageTitle eyebrow="CAREER DEVELOPMENT" title="Choose the work you want to master." description="Explore role pathways and the practical capabilities associated with each one."/><div className="career-layout"><div className="track-list">{tracks.map((t,i)=><button className={track===i?"selected":""} key={t.name} onClick={()=>setTrack(i)}><span>{String(i+1).padStart(2,"0")}</span><b>{t.name}</b><ChevronRight size={15}/></button>)}</div><section className="panel track-detail"><div className="eyebrow">CAREER TRACK · {String(track+1).padStart(2,"0")}</div><h2>{tracks[track].name}</h2><p>Build the knowledge, technical skills and judgement needed to perform entry-level tasks in this area. The pathway combines learning with practical assignments.</p><h3>Core capabilities</h3><div className="skill-chips">{tracks[track].skills.map(s=><span key={s}>{s}</span>)}</div><div className="capstone-box"><div className="capstone-icon"><BriefcaseBusiness size={18}/></div><div><b>Suggested practical assignment</b><p>Complete a structured case, document assumptions, show your calculations and present a recommendation with risks and limitations.</p><span className="tag">CAPSTONE TEMPLATE · COMING NEXT</span></div></div><div className="notice-inline"><ShieldCheck size={15}/> Simulations are educational exercises, not real employment experience or a job guarantee.</div></section></div></>}

function Workbench() {
  const [tool,setTool]=useState("DCF Snapshot");
  const [startingFcf,setStartingFcf]=useState("100");
  const [growth,setGrowth]=useState("8");
  const [wacc,setWacc]=useState("12");
  const [terminal,setTerminal]=useState("4");
  const [years,setYears]=useState("5");
  const [netDebt,setNetDebt]=useState("0");
  let dcf:ReturnType<typeof calculateDcf>|null=null;
  let dcfError="";
  try { dcf=calculateDcf({startingFcf:Number(startingFcf),growthRate:Number(growth)/100,wacc:Number(wacc)/100,terminalGrowth:Number(terminal)/100,forecastYears:Number(years),netDebt:Number(netDebt)}); }
  catch(error) { dcfError=error instanceof Error?error.message:"Check the DCF assumptions."; }
  return <><PageTitle eyebrow="PRACTICAL FINANCE WORKSPACE" title="From concepts to outputs." description="Build a transparent valuation, inspect the assumptions and understand what drives the result."/>
    <div className="workbench-layout">
      <aside className="tool-list">{["DCF Snapshot","Company Research","Investment Memo","Three-Statement Model"].map(t=><button key={t} className={tool===t?"selected":""} onClick={()=>setTool(t)}><BarChart3 size={16}/>{t}<ChevronRight size={14}/></button>)}</aside>
      <section className="panel workbench-main"><div className="eyebrow">VALUATION TOOL · EDUCATIONAL MODEL</div><h2>{tool}</h2>
        {tool==="DCF Snapshot"?<>
          <p className="muted">Five-year unlevered free-cash-flow DCF with a constant growth assumption. This is a teaching model, not investment research. Taxes, explicit working-capital schedules, share count, dilution and scenario weighting are not modelled.</p>
          <div className="input-grid">
            <label>Next-year starting FCF (₹ cr)<input type="number" min="0" step="any" value={startingFcf} onChange={e=>setStartingFcf(e.target.value)}/></label>
            <label>Annual FCF growth (%)<input type="number" min="-99" max="100" step="0.1" value={growth} onChange={e=>setGrowth(e.target.value)}/></label>
            <label>WACC / discount rate (%)<input type="number" min="-99" max="100" step="0.1" value={wacc} onChange={e=>setWacc(e.target.value)}/></label>
            <label>Terminal growth (%)<input type="number" min="-99" max="100" step="0.1" value={terminal} onChange={e=>setTerminal(e.target.value)}/></label>
            <label>Forecast years (1–10)<input type="number" min="1" max="10" step="1" value={years} onChange={e=>setYears(e.target.value)}/></label>
            <label>Net debt (₹ cr)<input type="number" step="any" value={netDebt} onChange={e=>setNetDebt(e.target.value)}/></label>
          </div>
          {dcfError?<div className="validation-error" role="alert">{dcfError}</div>:dcf&&<>
            <div className="valuation-output">
              <div><small>Enterprise value</small><b>₹{dcf.enterpriseValue.toFixed(2)} cr</b><em>Enterprise value · unlevered</em></div>
              <div><small>Equity value</small><b>₹{dcf.equityValue.toFixed(2)} cr</b><em>EV less net debt</em></div>
              <div><small>PV of forecast period</small><b>₹{dcf.pvExplicitPeriod.toFixed(2)} cr</b><em>{dcf.presentValues.length} forecast years</em></div>
              <div><small>PV of terminal value</small><b>₹{dcf.presentValueTerminal.toFixed(2)} cr</b><em>Gordon growth method</em></div>
            </div>
            <div className="forecast-table"><div><b>Year</b><b>Projected FCF</b><b>Present value</b></div>{dcf.projectedCashFlows.map((fcf,i)=><div key={i}><span>Year {i+1}</span><span>₹{fcf.toFixed(2)} cr</span><span>₹{dcf.presentValues[i].toFixed(2)} cr</span></div>)}</div>
          </>}
          <p className="micro-note">Enterprise value = PV of explicit forecast cash flows + PV of terminal value. Equity value = enterprise value − net debt. Keep WACC above terminal growth; small assumption changes can materially change terminal value.</p>
        </>:<div className="coming-panel"><Sparkles size={22}/><h3>{tool} workspace</h3><p>This module is on the roadmap. It will support source-linked inputs, structured analysis, calculation validation and exportable work samples.</p><span className="tag">PLANNED MODULE</span></div>}
      </section>
    </div>
  </>;
}

function Progress({completed,total,progress,trades}:{completed:string[];total:number;progress:number;trades:number}) {const skills=[["Financial foundations",Math.min(100,completed.length*16)],["Accounting",completed.some(x=>x.startsWith("acc"))?45:8],["Markets",completed.some(x=>x.startsWith("mkt"))?35:5],["Valuation",completed.some(x=>x.startsWith("val"))?28:0],["Modelling",completed.some(x=>x.startsWith("mod"))?22:0],["Professional communication",12]];return <><PageTitle eyebrow="YOUR DEVELOPMENT RECORD" title="Progress you can inspect." description="Track demonstrated activity—not just time spent inside a platform."/><div className="stats-grid"><Stat label="Curriculum progress" value={`${progress}%`} sub={`${completed.length} / ${total} lessons`} icon={GraduationCap} trend="Lesson completion"/><Stat label="Simulated orders" value={String(trades)} sub="Paper trading activity" icon={Activity} trend="Decision practice"/><Stat label="Skill domains" value="6" sub="Tracked capability areas" icon={Target} trend="Starter framework"/></div><section className="panel skill-panel"><div className="panel-head"><div><div className="eyebrow">SKILL MAP</div><h3>Capability snapshot</h3></div><span className="tag">PROVISIONAL INDICATORS</span></div>{skills.map(([name,score])=><div className="skill-row" key={name as string}><span>{name}</span><div className="progress-track"><span style={{width:`${score}%`}}/></div><b>{score}%</b></div>)}<p className="micro-note">These indicators are simple product-demo placeholders and are not validated proficiency scores. Real skill scoring needs assessments and rubric-based evaluation.</p></section><section className="panel portfolio-panel"><div className="eyebrow">PRACTICAL PORTFOLIO</div><h3>Your work should become evidence.</h3><p>Completed models, company research, news interpretations and career assignments will be collected here with methodology, assumptions, results and limitations.</p><div className="empty-state">No portfolio projects yet. Start with a News Lab analysis or a DCF exercise.</div></section></>}

function Mentor({messages,value,setValue,submit}:{messages:{role:string;text:string}[];value:string;setValue:(s:string)=>void;submit:()=>void}) {return <><PageTitle eyebrow="CENTRAL INTELLIGENCE LAYER" title="A mentor that challenges your thinking." description="Ask, explain, reason and revise. Good finance work starts with good questions."/><div className="mentor-layout"><section className="panel chat-panel"><div className="chat-header"><div className="mentor-icon large"><BrainCircuit size={19}/></div><div><b>Finance OS Mentor</b><small><span className="status-dot"/> Guided demo · AI API not connected</small></div><span className="tag">EXPLAIN MODE</span></div><div className="chat-messages">{messages.map((m,i)=><div className={`chat-message ${m.role}`} key={i}><div className="message-avatar">{m.role==="assistant"?<Sparkles size={15}/>: "AM"}</div><p>{m.text}</p></div>)}</div><form className="chat-input" onSubmit={e=>{e.preventDefault();submit();}}><input aria-label="Ask the AI Mentor" value={value} onChange={e=>setValue(e.target.value)} placeholder="Ask a finance question or challenge an assumption..."/><button className="primary-btn" type="submit" aria-label="Send message"><Send size={15}/></button></form><p className="micro-note">No external AI service is called. Do not enter private or sensitive information.</p></section><aside className="panel mentor-prompts"><div className="eyebrow">TRY A PROMPT</div><h3>Start with a better question.</h3>{["Explain why bond prices fall when yields rise.","Challenge my understanding of working capital.","What assumptions drive a DCF valuation?","Help me interpret revenue growth with falling cash flow."].map(p=><button key={p} onClick={()=>setValue(p)}>{p}<ArrowRight size={14}/></button>)}<div className="tip-card"><BrainCircuit size={17}/><b>Mentor principle</b><p>When your answer sounds confident, ask what evidence could prove it wrong.</p></div></aside></div></>}
