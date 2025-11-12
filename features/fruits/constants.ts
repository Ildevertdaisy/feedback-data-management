import { FruitConversionStatus, FruitStatusLabel } from "@/lib/types";

export const FRUIT_STATUS_LABELS: readonly FruitStatusLabel[] = [
  "CHATGUI",
  "TAGUI",
  "BB",
  "CENTRE",
  "DROP",
];

const FRUIT_STATUS_VALUE_MAP: Partial<Record<FruitStatusLabel, number>> = {
  CHATGUI: 0,
  TAGUI: 1,
  BB: 3,
  CENTRE: 2,
  DROP: 4,
};

const FRUIT_STATUS_LABEL_MAP = Object.entries(FRUIT_STATUS_VALUE_MAP).reduce(
  (acc, [label, value]) => {
    if (typeof value === "number") {
      acc[value] = label as FruitStatusLabel;
    }
    return acc;
  },
  {} as Record<number, FruitStatusLabel>,
);

const FRUIT_STATUS_ALIAS_MAP: Record<string, FruitStatusLabel> = {
  CHATGUI: "CHATGUI",
  "CHAT GUI": "CHATGUI",
  TAGUI: "TAGUI",
  TTAGUI: "TAGUI",
  "T TAGUI": "TAGUI",
  "T-TAGUI": "TAGUI",
  BB: "BB",
  CENTRE: "CENTRE",
  CENTER: "CENTRE",
  DROP: "DROP",
};

export const FRUIT_CONVERSION_STATUS_LABELS: readonly FruitConversionStatus[] = [
  "TAGUI",
  "BB",
  "CENTRE",
  "DROP",
];

export const formatFruitStatusLabel = (label: FruitStatusLabel) => {
  switch (label) {
    case "TAGUI":
      return "Tagui";
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

const normalizeStatusKey = (value: string) =>
  value
    .replace(/[_\s-]+/g, "")
    .toUpperCase()
    .trim();

export const getFruitStatusLabel = (
  status: number | string | null | undefined,
): FruitStatusLabel | null => {
  if (status === null || status === undefined) {
    return null;
  }

  if (typeof status === "number") {
    return FRUIT_STATUS_LABEL_MAP[status] ?? null;
  }

  const key = normalizeStatusKey(status);
  return FRUIT_STATUS_ALIAS_MAP[key] ?? null;
};

export const getFruitStatusValue = (
  label: FruitStatusLabel | null | undefined,
): number | null => {
  if (!label) {
    return null;
  }

  const normalized = FRUIT_STATUS_ALIAS_MAP[normalizeStatusKey(label)] ?? label;
  const value =
    typeof FRUIT_STATUS_VALUE_MAP[normalized] === "number"
      ? FRUIT_STATUS_VALUE_MAP[normalized]
      : null;

  return value ?? null;
};

export const toFruitStatusPayload = (
  label: FruitStatusLabel | null | undefined,
): { status: FruitStatusLabel | null; status_value: number | null } => ({
  status: label ?? null,
  status_value: getFruitStatusValue(label),
});
