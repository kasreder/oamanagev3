const UNIT_IN_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export const parseDuration = (value: string): number => {
  const trimmed = value.trim();

  const exactNumber = Number(trimmed);
  if (!Number.isNaN(exactNumber)) {
    return exactNumber;
  }

  const match = trimmed.match(/^(\d+)(ms|[smhd])$/i);

  if (!match) {
    throw new Error(`Unsupported duration format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multiplier = UNIT_IN_MS[unit];

  if (!multiplier) {
    throw new Error(`Unsupported duration unit: ${unit}`);
  }

  return amount * multiplier;
};

export const addDurationToNow = (durationMs: number): string => {
  const expires = new Date(Date.now() + durationMs);

  return expires.toISOString().slice(0, 19).replace('T', ' ');
};
