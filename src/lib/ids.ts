import { randomBytes } from "crypto";

export function uid(prefix: string): string {
  return `${prefix}-${randomBytes(4).toString("hex")}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
