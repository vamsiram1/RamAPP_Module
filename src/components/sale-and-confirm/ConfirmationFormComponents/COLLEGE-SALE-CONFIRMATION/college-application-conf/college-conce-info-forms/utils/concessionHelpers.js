// Small helpers to keep hook clean and readable

export const isValidValue = (value) => {
  if (value === null || value === undefined) return false;
  const s = String(value).trim();
  return s !== "" && s !== "-";
};

// Normalize any supported overviewData shapes into an array of concession-like objects
export const normalizeConcessionsFromOverview = (overviewData = {}) => {
  if (!overviewData) return [];

  if (Array.isArray(overviewData.concessions)) return overviewData.concessions;
  if (overviewData.concessionInfo) {
    return Array.isArray(overviewData.concessionInfo)
      ? overviewData.concessionInfo
      : [overviewData.concessionInfo];
  }
  if (overviewData.concessionData) {
    return Array.isArray(overviewData.concessionData)
      ? overviewData.concessionData
      : [overviewData.concessionData];
  }

  // Flat structure fallback
  if (
    overviewData.firstYearConcession ||
    overviewData.secondYearConcession ||
    overviewData.concessionAmount
  ) {
    const first = {
      concessionTypeName: "1st Year",
      amount: overviewData.firstYearConcession || overviewData["1stYearConcession"],
      comments: overviewData.concessionDescription || overviewData.description,
      referredBy: overviewData.referredBy,
      authorizedBy: overviewData.authorizedBy,
      reasonName: overviewData.concessionReason,
    };
    const second = {
      concessionTypeName: "2nd Year",
      amount: overviewData.secondYearConcession || overviewData["2ndYearConcession"],
      comments: overviewData.concessionDescription || overviewData.description,
      referredBy: overviewData.referredBy,
      authorizedBy: overviewData.authorizedBy,
      reasonName: overviewData.concessionReason,
    };
    return [first, second].filter((x) => isValidValue(x.amount));
  }

  return [];
};

export const findConcessionByType = (concessions = [], labelParts = []) => {
  const parts = labelParts.map((s) => s.toLowerCase());
  return concessions.find((c) => {
    const n = (c?.concessionTypeName || "").toLowerCase();
    return parts.some((p) => n.includes(p)) || parts.includes(n);
  });
};

export const getDisplayValueById = (list = [], id) => {
  if (!id) return "";
  if (typeof id === "string" && id.includes(" - ")) return id; // already display text
  const found = list.find((i) => String(i.id) === String(id));
  return found ? found.displayText : "";
};

export const findOptionByFuzzyText = (list = [], text = "") => {
  if (!text) return null;
  const t = text.toLowerCase();
  return list.find(
    (i) => i.displayText.toLowerCase().includes(t) || t.includes(i.displayText.toLowerCase())
  );
};
