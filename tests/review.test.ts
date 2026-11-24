import {describe,expect,it} from "vitest";
import {reviewAnalysis} from "../src/lib/review";
describe("written analysis review rubric",()=>{
 it("returns a structured score and actionable gaps",()=>{const result=reviewAnalysis("First, the rate cut could reduce funding costs for banks because deposit rates may reprice. However, credit risk could increase if growth is weaker. Assuming loan demand improves, borrowers and companies could benefit. Evidence from bank margins and bond prices would help validate this view. In conclusion, the impact depends on the starting macro conditions.");expect(result.maxScore).toBe(20);expect(result.dimensions).toHaveLength(5);expect(result.wordCount).toBeGreaterThan(30);expect(result.nextSteps.length).toBeLessThan(5);});
 it("does not award a strong score for empty or generic answers",()=>{const result=reviewAnalysis("");expect(result.total).toBe(0);expect(result.band).toBe("Needs development");expect(result.nextSteps).toHaveLength(5);});
});
