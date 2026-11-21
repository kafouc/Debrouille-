const NNBSP = " ";
const NBSP = " ";
const MINUS = "−";

function groupThousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
}

/** « 18 750 € », « −1 234 € », « 1,2 M€ ». */
export function formatMoney(amount: number): string {
  const value = Math.round(amount);
  const sign = value < 0 ? MINUS : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const millions = Math.round(abs / 100_000) / 10;
    const text = Number.isInteger(millions) ? String(millions) : millions.toFixed(1).replace(".", ",");
    return `${sign}${text}${NBSP}M€`;
  }
  return `${sign}${groupThousands(abs)}${NBSP}€`;
}

export function formatAge(age: number): string {
  return `${age} ans`;
}
