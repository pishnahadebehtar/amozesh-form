export const buildFieldKey = (label: string): string =>
  label.toLowerCase().replace(/\s+/g, "_");
