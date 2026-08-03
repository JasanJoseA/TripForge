/**
 * Uses exchangerate.host — a free, keyless exchange-rate API — so currency
 * conversion works without any API key to manage.
 */
export async function fetchExchangeRate(from: string, to: string): Promise<number | null> {
  if (from === to) return 1;
  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.rates?.[to] ?? null;
  } catch {
    return null;
  }
}

export function parseUsdAmount(costString: string): number | null {
  const match = costString.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}
