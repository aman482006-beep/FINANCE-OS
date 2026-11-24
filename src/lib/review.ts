export type ReviewDimension="reasoning"|"impact"|"risk"|"evidence"|"clarity";
export type ReviewScore={dimension:ReviewDimension;label:string;score:number;feedback:string};
export type AnalysisReview={total:number;maxScore:number;band:"Needs development"|"Developing"|"Strong structure";dimensions:ReviewScore[];strengths:string[];nextSteps:string[];wordCount:number};
const checks:{dimension:ReviewDimension;label:string;terms:string[];feedback:string}[]=[
{dimension:"reasoning",label:"Causal reasoning",terms:["because","therefore","leads to","results in","transmission","channel","as a result","consequently"],feedback:"Make the causal chain explicit: event → financial mechanism → affected metric or decision."},
{dimension:"impact",label:"Affected parties and market impact",terms:["bank","borrower","lender","consumer","company","sector","bond","equity","currency","investor","customer","supplier"],feedback:"Name who is affected and distinguish the likely first-order impact from indirect effects."},
{dimension:"risk",label:"Risks and counterarguments",terms:["risk","however","although","but","uncertain","downside","counter","depends","limitation","could also"],feedback:"Include a credible counterargument, second-order effect or condition that could reverse your conclusion."},
{dimension:"evidence",label:"Evidence and assumptions",terms:["assume","data","evidence","estimate","historical","expectation","baseline","source","if","assuming"],feedback:"Separate known facts from assumptions. State what additional data would validate your view."},
{dimension:"clarity",label:"Structured communication",terms:["first","second","finally","for example","in conclusion","to begin","next"],feedback:"Organise the response into a clear argument rather than a list of disconnected observations."}
];
/** Transparent heuristic reviewer; a coaching aid, not an expert or AI assessment. */
export function reviewAnalysis(answer:string):AnalysisReview{
 const normalized=answer.toLowerCase(),words=answer.trim().split(/\s+/).filter(Boolean),wordCount=words.length;
 const dimensions=checks.map(check=>{
  const hits=check.terms.filter(term=>normalized.includes(term)).length;
  const lengthBonus=wordCount>=60?1:wordCount>=35?.5:0;
  const score=Math.min(4,Math.min(3,hits)+lengthBonus);
  return{dimension:check.dimension,label:check.label,score,feedback:check.feedback};
 });
 const total=dimensions.reduce((sum,d)=>sum+d.score,0),maxScore=checks.length*4;
 const band=total>=15?"Strong structure":total>=9?"Developing":"Needs development";
 return{total,maxScore,band,dimensions,strengths:dimensions.filter(d=>d.score>=3).map(d=>d.label),nextSteps:dimensions.filter(d=>d.score<3).map(d=>d.feedback),wordCount};
}