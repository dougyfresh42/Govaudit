export function formatAmount(amount: number): string {
  return `$${(amount / 1000000).toFixed(1)}M`;
}
