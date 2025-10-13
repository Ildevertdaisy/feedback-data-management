import { FruitStatusLabel } from "@/lib/types";

export const FRUIT_STATUS_LABELS: readonly FruitStatusLabel[] = [
  "CHATGUI",
  "TTAGUI",
  "COT",
  "BB",
  "DROP",
];

const FRUIT_STATUS_VALUE_MAP: Record<FruitStatusLabel, number> = {
  CHATGUI: 0,
  TTAGUI: 1,
  COT: 2,
  BB: 3,
  DROP: 4,
};

const FRUIT_STATUS_LABEL_MAP = Object.entries(FRUIT_STATUS_VALUE_MAP).reduce(
  (acc, [label, value]) => {
    acc[value] = label as FruitStatusLabel;
    return acc;
  },
  {} as Record<number, FruitStatusLabel>,
);

export const FRUIT_STATUS_SELECT_OPTIONS = FRUIT_STATUS_LABELS.map((label) => ({
  label,
  value: label,
}));

export const getFruitStatusLabel = (
  status: number | null | undefined,
): FruitStatusLabel | null => {
  if (status === null || status === undefined) {
    return null;
  }

  return FRUIT_STATUS_LABEL_MAP[status] ?? null;
};

export const getFruitStatusValue = (
  label: FruitStatusLabel | null | undefined,
): number | null => {
  if (!label) {
    return null;
  }

  return FRUIT_STATUS_VALUE_MAP[label] ?? null;
};
