export type DcfInputs = {
  startingFcf: number;
  growthRate: number;
  wacc: number;
  terminalGrowth: number;
  forecastYears: number;
  netDebt?: number;
};
export type DcfResult = {
  projectedCashFlows: number[];
  presentValues: number[];
  terminalValue: number;
  presentValueTerminal: number;
  enterpriseValue: number;
  equityValue: number;
  pvExplicitPeriod: number;
};
export function calculateDcf(input:DcfInputs):DcfResult {
  const {startingFcf,growthRate,wacc,terminalGrowth,forecastYears,netDebt=0}=input;
  const numeric=[startingFcf,growthRate,wacc,terminalGrowth,netDebt];
  if (!numeric.every(Number.isFinite)) throw new Error("All DCF assumptions must be finite numbers.");
  if (startingFcf < 0) throw new Error("Starting free cash flow cannot be negative in this simplified model.");
  if (wacc <= -1 || wacc > 1) throw new Error("WACC must be greater than -100% and no more than 100%.");
  if (terminalGrowth <= -1 || terminalGrowth >= wacc) throw new Error("Terminal growth must be greater than -100% and below WACC.");
  if (growthRate <= -1 || growthRate > 1) throw new Error("Growth must be greater than -100% and no more than 100%.");
  if (!Number.isInteger(forecastYears) || forecastYears < 1 || forecastYears > 10) throw new Error("Forecast period must be an integer from 1 to 10 years.");
  const projectedCashFlows=Array.from({length:forecastYears},(_,i)=>startingFcf*Math.pow(1+growthRate,i+1));
  const presentValues=projectedCashFlows.map((fcf,i)=>fcf/Math.pow(1+wacc,i+1));
  const last=projectedCashFlows[projectedCashFlows.length-1];
  const terminalValue=last*(1+terminalGrowth)/(wacc-terminalGrowth);
  const presentValueTerminal=terminalValue/Math.pow(1+wacc,forecastYears);
  const pvExplicitPeriod=presentValues.reduce((sum,value)=>sum+value,0);
  const enterpriseValue=pvExplicitPeriod+presentValueTerminal;
  return {projectedCashFlows,presentValues,terminalValue,presentValueTerminal,enterpriseValue,equityValue:enterpriseValue-netDebt,pvExplicitPeriod};
}
