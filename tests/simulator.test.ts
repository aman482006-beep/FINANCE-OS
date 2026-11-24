import { describe,expect,it } from "vitest";
import { deriveHoldings,executeSimulatedOrder } from "../src/lib/simulator";
const base={symbol:"INFY",side:"BUY" as const,quantity:2,price:100,cash:1000,currentPosition:0,executedAt:"2026-01-01T00:00:00.000Z"};
describe("simulated order engine",()=>{
 it("executes a buy and calculates the remaining cash and units",()=>{const result=executeSimulatedOrder(base);expect(result.ok).toBe(true);if(result.ok){expect(result.cashAfter).toBe(800);expect(result.positionAfter).toBe(2);}});
 it("blocks orders when virtual cash is insufficient",()=>{const result=executeSimulatedOrder({...base,cash:100});expect(result).toMatchObject({ok:false,reason:"INSUFFICIENT_CASH"});});
 it("blocks selling more than the current position",()=>{const result=executeSimulatedOrder({...base,side:"SELL",currentPosition:1});expect(result).toMatchObject({ok:false,reason:"INSUFFICIENT_HOLDINGS"});});
 it("rejects fractional, zero and unsafe quantities",()=>{for(const quantity of [0,-1,1.5,Number.MAX_SAFE_INTEGER+1])expect(executeSimulatedOrder({...base,quantity}).ok).toBe(false);});
 it("rejects non-finite or non-positive prices",()=>{for(const price of [0,-1,Infinity,NaN])expect(executeSimulatedOrder({...base,price}).ok).toBe(false);});
 it("derives only net positive long holdings",()=>{const result=deriveHoldings([{symbol:"INFY",side:"BUY",quantity:4,price:10,executedAt:"x"},{symbol:"INFY",side:"SELL",quantity:2,price:12,executedAt:"x"},{symbol:"TCS",side:"BUY",quantity:2,price:10,executedAt:"x"},{symbol:"TCS",side:"SELL",quantity:2,price:10,executedAt:"x"}]);expect(result).toEqual({INFY:2});});
});
