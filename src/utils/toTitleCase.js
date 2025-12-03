export function toTitleCase(input = "") {
  if (!input || typeof input !== "string") return "";

  return input
    .trim()                   // remove leading/trailing spaces
    .split(/\s+/)             // split by one or more spaces
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
