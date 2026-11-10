const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** 900 → $900.00 */
export const formatMoney = (amount: number) => usd.format(amount);

/** A 10-digit US or Canadian number → (813) 555-0100; anything else as it was entered. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  const local =
    digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  return local.length === 10
    ? `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
    : value;
}

/** A name's initials for an avatar: "Cora Lee" → CL. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('');
}
