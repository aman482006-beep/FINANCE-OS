export type Side = "BUY" | "SELL";
export type SimulatedTrade = {
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
  executedAt: string;
};
export type OrderRequest = {
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
  cash: number;
  currentPosition: number;
  executedAt?: string;
};
export type OrderResult =
  | { ok: true; trade: SimulatedTrade; cashAfter: number; positionAfter: number }
  | { ok: false; reason: "INVALID_SYMBOL" | "INVALID_SIDE" | "INVALID_QUANTITY" | "INVALID_PRICE" | "INVALID_CASH" | "INSUFFICIENT_CASH" | "INSUFFICIENT_HOLDINGS" };
export function executeSimulatedOrder(request: OrderRequest): OrderResult {
  const {symbol,side,quantity,price,cash,currentPosition}=request;
  if (!symbol || !/^[A-Z0-9._-]{1,20}$/.test(symbol)) return {ok:false,reason:"INVALID_SYMBOL"};
  if (side !== "BUY" && side !== "SELL") return {ok:false,reason:"INVALID_SIDE"};
  if (!Number.isSafeInteger(quantity) || quantity <= 0) return {ok:false,reason:"INVALID_QUANTITY"};
  if (!Number.isFinite(price) || price <= 0) return {ok:false,reason:"INVALID_PRICE"};
  if (!Number.isFinite(cash) || cash < 0 || !Number.isSafeInteger(currentPosition) || currentPosition < 0) return {ok:false,reason:"INVALID_CASH"};
  const gross = price * quantity;
  if (!Number.isFinite(gross) || !Number.isSafeInteger(Math.round(gross * 100))) return {ok:false,reason:"INVALID_PRICE"};
  if (side === "BUY" && cash + 1e-8 < gross) return {ok:false,reason:"INSUFFICIENT_CASH"};
  if (side === "SELL" && currentPosition < quantity) return {ok:false,reason:"INSUFFICIENT_HOLDINGS"};
  return {
    ok:true,
    trade:{symbol,side,quantity,price,executedAt:request.executedAt ?? new Date().toISOString()},
    cashAfter:Number((cash + (side === "BUY" ? -gross : gross)).toFixed(2)),
    positionAfter:currentPosition + (side === "BUY" ? quantity : -quantity)
  };
}
export function deriveHoldings(trades: readonly SimulatedTrade[]): Record<string,number> {
  const holdings: Record<string,number> = Object.create(null) as Record<string,number>;
  for (const trade of trades) {
    if (!trade || !trade.symbol || !Number.isSafeInteger(trade.quantity) || trade.quantity <= 0) continue;
    const delta = trade.side === "BUY" ? trade.quantity : trade.side === "SELL" ? -trade.quantity : 0;
    holdings[trade.symbol] = (holdings[trade.symbol] ?? 0) + delta;
  }
  for (const [symbol,quantity] of Object.entries(holdings)) {
    if (quantity <= 0) delete holdings[symbol];
  }
  return holdings;
}
