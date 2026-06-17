// Tailored Premium Medical Palette Hex Codes
const COLORS = [
  "#0ea5e9", // Sky
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#f97316", // Orange
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#14b8a6", // Teal
];

export function generateColor(name = "") {
  if (!name) return "#3b82f6"; // Default fallback (Blue)
  
  let total = 0;
  for (let i = 0; i < name.length; i++) {
    total += name.charCodeAt(i);
  }

  return COLORS[total % COLORS.length];
}