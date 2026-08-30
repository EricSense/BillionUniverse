export function uid(prefix = "n"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36).slice(-4);
  return `${prefix}_${t}${rand}`;
}

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
