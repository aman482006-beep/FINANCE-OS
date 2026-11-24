import {describe,expect,it} from "vitest";
import {calculateDcf} from "../src/lib/finance";
describe("multi-year DCF",()=>{
 it("discounts explicit forecast cash flows and terminal value",()=>{const d=calculateDcf({startingFcf:100,growthRate:.05,wacc:.10,terminalGrowth:.03,forecastYears:5,netDebt:50});expect(d.projectedCashFlows).toHaveLength(5);expect(d.presentValues).toHaveLength(5);expect(d.enterpriseValue).toBeGreaterThan(d.pvExplicitPeriod);expect(d.equityValue).toBeCloseTo(d.enterpriseValue-50);});
 it("rejects terminal growth greater than or equal to WACC",()=>{expect(()=>calculateDcf({startingFcf:100,growthRate:.05,wacc:.08,terminalGrowth:.08,forecastYears:5})).toThrow();});
 it("rejects unbounded forecast periods and non-finite assumptions",()=>{expect(()=>calculateDcf({startingFcf:100,growthRate:.05,wacc:.1,terminalGrowth:.03,forecastYears:11})).toThrow();expect(()=>calculateDcf({startingFcf:NaN,growthRate:.05,wacc:.1,terminalGrowth:.03,forecastYears:5})).toThrow();});
});
