import { FruitConversionStatus, FruitStatusLabel } from "@/lib/types";

export const FRUIT_STATUS_LABELS: readonly FruitStatusLabel[] = [
  "CHATGUI",
  "TTAGUI",
  "BB",
  "CENTRE",
  "DROP",
];

const FRUIT_STATUS_VALUE_MAP: Record<FruitStatusLabel, number> = {
  CHATGUI: 0,
  TTAGUI: 1,
  BB: 3,
  CENTRE: 2,
  DROP: 4,
};

const FRUIT_STATUS_LABEL_MAP = Object.entries(FRUIT_STATUS_VALUE_MAP).reduce(
  (acc, [label, value]) => {
    acc[value] = label as FruitStatusLabel;
    return acc;
  },
  {} as Record<number, FruitStatusLabel>,
);

export const FRUIT_CONVERSION_STATUS_LABELS: readonly FruitConversionStatus[] = [
  "TTAGUI",
  "BB",
  "CENTRE",
  "DROP",
];

export const formatFruitStatusLabel = (label: FruitStatusLabel) => {
  switch (label) {
    case "TTAGUI":
      return "TTagui";
    case "BB":
      return "BB";
    case "CENTRE":
      return "Centre";
    case "DROP":
      return "Drop";
    case "CHATGUI":
      return "Chatgui";
    default:
      return label;
  }
};

export const FRUIT_STATUS_SELECT_OPTIONS = FRUIT_STATUS_LABELS.map((label) => ({
  label: formatFruitStatusLabel(label),
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
