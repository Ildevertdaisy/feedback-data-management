import { buildApiUrl } from "@/lib/api";

const DEFAULT_FILENAME = "export-rentree.csv";

const triggerDownload = (blob: Blob, filename: string) => {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

export const downloadRentreeCsv = async (rentreeId: number) => {
  const url = buildApiUrl(`/rentrees/${rentreeId}/export-csv`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Export des fruits impossible (code ${response.status ?? "inconnu"}).`,
    );
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("content-disposition");
  const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
  const filename = filenameMatch?.[1] ?? DEFAULT_FILENAME;

  triggerDownload(blob, filename);
};
