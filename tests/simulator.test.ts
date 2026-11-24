import {describe,expect,it} from "vitest";
import {deriveHoldings,executeSimulatedOrder} from "../src/lib/simulator";
const base={symbol:"INFY",side:"BUY" as const,quantity:2,price:100,cash:1000,currentPosition:0,executedAt:"2026-01-01T00:00:00.000Z"};
describe("simulated order engine",()=>{
 it("executes a buy and calculates cash and units",()=>{const r=executeSimulatedOrder(base);expect(r.ok).toBe(true);if(r.ok){expect(r.cashAfter).toBe(800);expect(r.positionAfter).toBe(2);}});
 it("blocks unaffordable buys",()=>expect(executeSimulatedOrder({...base,cash:100})).toMatchObject({ok:false,reason:"INSUFFICIENT_CASH"}));
 it("blocks overselling",()=>expect(executeSimulatedOrder({...base,side:"SELL",currentPosition:1})).toMatchObject({ok:false,reason:"INSUFFICIENT_HOLDINGS"}));
 it("rejects invalid quantities",()=>{for(const quantity of [0,-1,1.5,Number.MAX_SAFE_INTEGER+1])expect(executeSimulatedOrder({...base,quantity}).ok).toBe(false);});
 it("rejects invalid prices",()=>{for(const price of [0,-1,Infinity,NaN])expect(executeSimulatedOrder({...base,price}).ok).toBe(false);});
 it("derives net long holdings",()=>{const r=deriveHoldings([{symbol:"INFY",side:"BUY",quantity:4,price:10,executedAt:"x"},{symbol:"INFY",side:"SELL",quantity:2,price:12,executedAt:"x"},{symbol:"TCS",side:"BUY",quantity:2,price:10,executedAt:"x"},{symbol:"TCS",side:"SELL",quantity:2,price:10,executedAt:"x"}]);expect(r).toEqual({INFY:2});});
});