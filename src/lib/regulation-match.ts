import { AIRLINE_GROUPS } from "@/lib/jetclaim";

export type Jurisdiction = "EU" | "UK" | "US" | "CA" | "IN" | "BR" | "TR" | "OTHER";

type Region = { jurisdiction: Jurisdiction; label: string };

/** Major airports by IATA code -> jurisdiction. */
const AIRPORT_CODES: Record<string, Jurisdiction> = {
  // United Kingdom
  LHR: "UK", LGW: "UK", STN: "UK", LTN: "UK", LCY: "UK", MAN: "UK", BHX: "UK",
  EDI: "UK", GLA: "UK", BRS: "UK", NCL: "UK", LPL: "UK", BFS: "UK",
  // European Union / EEA
  CDG: "EU", ORY: "EU", NCE: "EU", LYS: "EU", MRS: "EU", TLS: "EU",
  FRA: "EU", MUC: "EU", BER: "EU", DUS: "EU", HAM: "EU", CGN: "EU", STR: "EU",
  AMS: "EU", EIN: "EU", BRU: "EU", CRL: "EU", LUX: "EU",
  MAD: "EU", BCN: "EU", AGP: "EU", PMI: "EU", ALC: "EU", VLC: "EU", SVQ: "EU",
  LIS: "EU", OPO: "EU", FAO: "EU",
  FCO: "EU", MXP: "EU", LIN: "EU", BGY: "EU", VCE: "EU", NAP: "EU", BLQ: "EU", CTA: "EU",
  ATH: "EU", SKG: "EU", HER: "EU", RHO: "EU",
  VIE: "EU", ZRH: "EU", GVA: "EU", BSL: "EU",
  CPH: "EU", ARN: "EU", GOT: "EU", OSL: "EU", BGO: "EU", HEL: "EU", KEF: "EU",
  DUB: "EU", ORK: "EU", SNN: "EU",
  WAW: "EU", KRK: "EU", GDN: "EU", PRG: "EU", BUD: "EU", OTP: "EU", SOF: "EU",
  ZAG: "EU", LJU: "EU", BTS: "EU", RIX: "EU", TLL: "EU", VNO: "EU", MLA: "EU", LCA: "EU",
  // United States
  JFK: "US", EWR: "US", LGA: "US", BOS: "US", PHL: "US", IAD: "US", DCA: "US", BWI: "US",
  ATL: "US", MIA: "US", FLL: "US", MCO: "US", TPA: "US", CLT: "US", RDU: "US", BNA: "US",
  ORD: "US", MDW: "US", DTW: "US", MSP: "US", STL: "US", CLE: "US", CVG: "US", IND: "US",
  DFW: "US", IAH: "US", HOU: "US", AUS: "US", SAT: "US", DEN: "US", SLC: "US", PHX: "US",
  LAX: "US", SFO: "US", SAN: "US", SJC: "US", OAK: "US", SEA: "US", PDX: "US", LAS: "US",
  HNL: "US", ANC: "US", SJU: "US",
  // Canada
  YYZ: "CA", YUL: "CA", YVR: "CA", YYC: "CA", YEG: "CA", YOW: "CA", YHZ: "CA", YWG: "CA", YQB: "CA",
  // India
  DEL: "IN", BOM: "IN", BLR: "IN", MAA: "IN", HYD: "IN", CCU: "IN", COK: "IN", AMD: "IN",
  GOI: "IN", PNQ: "IN", TRV: "IN", JAI: "IN", LKO: "IN",
  // Brazil
  GRU: "BR", CGH: "BR", GIG: "BR", SDU: "BR", BSB: "BR", CNF: "BR", POA: "BR", REC: "BR",
  SSA: "BR", FOR: "BR", VCP: "BR", CWB: "BR", MAO: "BR",
  // Türkiye
  IST: "TR", SAW: "TR", AYT: "TR", ESB: "TR", ADB: "TR", DLM: "TR", BJV: "TR", TZX: "TR",
};

/** Country / city keywords -> jurisdiction, for free-typed airport fields. */
const KEYWORDS: Array<[string, Jurisdiction]> = [
  ["united kingdom", "UK"], ["england", "UK"], ["scotland", "UK"], ["wales", "UK"],
  ["northern ireland", "UK"], ["britain", "UK"], ["london", "UK"], ["heathrow", "UK"],
  ["gatwick", "UK"], ["manchester", "UK"], ["edinburgh", "UK"], ["glasgow", "UK"],
  ["united states", "US"], ["u.s.", "US"], ["usa", "US"], ["america", "US"],
  ["new york", "US"], ["chicago", "US"], ["los angeles", "US"], ["miami", "US"],
  ["atlanta", "US"], ["boston", "US"], ["dallas", "US"], ["houston", "US"],
  ["san francisco", "US"], ["seattle", "US"], ["washington", "US"], ["denver", "US"],
  ["canada", "CA"], ["toronto", "CA"], ["montreal", "CA"], ["vancouver", "CA"], ["calgary", "CA"],
  ["india", "IN"], ["delhi", "IN"], ["mumbai", "IN"], ["bengaluru", "IN"], ["bangalore", "IN"],
  ["chennai", "IN"], ["hyderabad", "IN"], ["kolkata", "IN"],
  ["brazil", "BR"], ["brasil", "BR"], ["sao paulo", "BR"], ["são paulo", "BR"],
  ["rio de janeiro", "BR"], ["brasilia", "BR"],
  ["turkey", "TR"], ["türkiye", "TR"], ["turkiye", "TR"], ["istanbul", "TR"], ["antalya", "TR"], ["ankara", "TR"],
  ["france", "EU"], ["paris", "EU"], ["germany", "EU"], ["frankfurt", "EU"], ["munich", "EU"],
  ["berlin", "EU"], ["netherlands", "EU"], ["amsterdam", "EU"], ["belgium", "EU"], ["brussels", "EU"],
  ["spain", "EU"], ["madrid", "EU"], ["barcelona", "EU"], ["portugal", "EU"], ["lisbon", "EU"],
  ["italy", "EU"], ["rome", "EU"], ["milan", "EU"], ["greece", "EU"], ["athens", "EU"],
  ["austria", "EU"], ["vienna", "EU"], ["switzerland", "EU"], ["zurich", "EU"], ["geneva", "EU"],
  ["denmark", "EU"], ["copenhagen", "EU"], ["sweden", "EU"], ["stockholm", "EU"],
  ["norway", "EU"], ["oslo", "EU"], ["finland", "EU"], ["helsinki", "EU"], ["iceland", "EU"],
  ["ireland", "EU"], ["dublin", "EU"], ["poland", "EU"], ["warsaw", "EU"], ["czech", "EU"],
  ["prague", "EU"], ["hungary", "EU"], ["budapest", "EU"], ["romania", "EU"], ["bucharest", "EU"],
  ["croatia", "EU"], ["malta", "EU"], ["cyprus", "EU"], ["luxembourg", "EU"],
];

/** Airline group label -> home jurisdiction. */
const GROUP_JURISDICTION: Record<string, Jurisdiction> = {
  "United States — US DOT": "US",
  "Europe — EU261": "EU",
  "United Kingdom — UK261": "UK",
  "Canada — APPR": "CA",
  "India — DGCA": "IN",
  "South America — ANAC": "BR",
};

const REG_BY_JURISDICTION: Record<Exclude<Jurisdiction, "OTHER">, string> = {
  EU: "EU261",
  UK: "UK261",
  US: "USDOT",
  CA: "APPR",
  IN: "DGCA",
  BR: "ANAC",
  TR: "SHY",
};

const JURISDICTION_LABEL: Record<Jurisdiction, string> = {
  EU: "the EU/EEA",
  UK: "the United Kingdom",
  US: "the United States",
  CA: "Canada",
  IN: "India",
  BR: "Brazil",
  TR: "Türkiye",
  OTHER: "another region",
};

const BAGGAGE_ISSUES = ["Lost Baggage", "Damaged Baggage"];
const DISRUPTION_ISSUES = ["Delay", "Cancellation", "Denied Boarding"];

function normalise(value: string) {
  return value.toLowerCase().trim();
}

/** Levenshtein distance, used to snap typos to the nearest known airport/airline. */
function distance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(prev[j]! + 1, curr[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = curr;
  }
  return prev[b.length]!;
}

/** Words in the input that are almost a known keyword (1-2 typos) match the nearest one. */
function nearestKeywordJurisdiction(text: string): Jurisdiction | null {
  const words = text.split(/[^a-z]+/).filter((w) => w.length >= 4);
  let best: { jurisdiction: Jurisdiction; score: number } | null = null;
  for (const word of words) {
    for (const [keyword, jurisdiction] of KEYWORDS) {
      for (const part of keyword.split(" ")) {
        if (part.length < 4) continue;
        const d = distance(word, part);
        const allowed = part.length >= 8 ? 2 : 1;
        if (d <= allowed && (!best || d < best.score)) best = { jurisdiction, score: d };
      }
    }
  }
  return best?.jurisdiction ?? null;
}

export function detectAirportJurisdiction(input: string): Region {
  const text = normalise(input);
  // Explicit IATA code, e.g. "London Heathrow (LHR)" or "LHR"
  const codes = input.toUpperCase().match(/\b[A-Z]{3}\b/g) ?? [];
  for (const code of codes) {
    const hit = AIRPORT_CODES[code];
    if (hit) return { jurisdiction: hit, label: JURISDICTION_LABEL[hit] };
  }
  // Partial IATA-like tokens, e.g. "lhr" typed lowercase inside a word
  const lowerTokens = text.match(/[a-z]{3}/g) ?? [];
  for (const token of lowerTokens) {
    const hit = AIRPORT_CODES[token.toUpperCase()];
    if (hit) return { jurisdiction: hit, label: JURISDICTION_LABEL[hit] };
  }
  for (const [keyword, jurisdiction] of KEYWORDS) {
    if (text.includes(keyword)) return { jurisdiction, label: JURISDICTION_LABEL[jurisdiction] };
  }
  // Snap near-miss spellings ("londn", "pariss") to the nearest known region.
  const near = nearestKeywordJurisdiction(text);
  if (near) return { jurisdiction: near, label: JURISDICTION_LABEL[near] };
  return { jurisdiction: "OTHER", label: JURISDICTION_LABEL.OTHER };
}

export function detectAirlineJurisdiction(airlineName: string): Jurisdiction {
  const target = normalise(airlineName);
  if (!target) return "OTHER";
  for (const group of AIRLINE_GROUPS) {
    for (const airline of group.airlines) {
      const name = normalise(airline.name);
      if (name === target || target.includes(name) || (target.length >= 4 && name.includes(target))) {
        if (name.includes("turkish")) return "TR";
        return GROUP_JURISDICTION[group.label] ?? "OTHER";
      }
    }
  }
  // Nearest known airline by edit distance — catches typos like "lufthanzsa".
  let best: { jurisdiction: Jurisdiction; score: number } | null = null;
  for (const group of AIRLINE_GROUPS) {
    for (const airline of group.airlines) {
      const name = normalise(airline.name);
      const d = distance(target, name);
      const allowed = name.length >= 10 ? 3 : name.length >= 6 ? 2 : 1;
      if (d <= allowed && (!best || d < best.score)) {
        best = {
          jurisdiction: name.includes("turkish") ? "TR" : (GROUP_JURISDICTION[group.label] ?? "OTHER"),
          score: d,
        };
      }
    }
  }
  if (best) return best.jurisdiction;
  if (target.includes("turkish") || target.includes("pegasus")) return "TR";
  return "OTHER";
}

export type RegulationMatch = {
  code: string | null;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  alternatives: string[];
};

export function matchRegulation(input: {
  airline_name: string;
  departure_airport: string;
  arrival_airport: string;
  issue_type: string;
}): RegulationMatch {
  const departure = detectAirportJurisdiction(input.departure_airport);
  const arrival = detectAirportJurisdiction(input.arrival_airport);
  const airline = detectAirlineJurisdiction(input.airline_name);
  const reasons: string[] = [];
  const alternatives: string[] = [];

  const isBaggage = BAGGAGE_ISSUES.includes(input.issue_type);
  const isDisruption = DISRUPTION_ISSUES.includes(input.issue_type);
  const international = departure.jurisdiction !== arrival.jurisdiction;

  let code: string | null = null;
  let confidence: RegulationMatch["confidence"] = "low";

  // 1. Departure jurisdiction almost always governs disruption claims.
  if (departure.jurisdiction !== "OTHER") {
    code = REG_BY_JURISDICTION[departure.jurisdiction];
    confidence = "high";
    reasons.push(`Flight departs from ${departure.label}, so ${code} applies to the departure.`);
  }

  // 2. Inbound flights: EU/UK rules also cover arrivals on a home carrier.
  if (!code && arrival.jurisdiction !== "OTHER") {
    const arrivalCode = REG_BY_JURISDICTION[arrival.jurisdiction];
    const carrierMatches = airline === arrival.jurisdiction;
    const arrivalAlwaysCounts = arrival.jurisdiction === "CA" || arrival.jurisdiction === "IN" || arrival.jurisdiction === "BR";
    if (carrierMatches || arrivalAlwaysCounts) {
      code = arrivalCode;
      confidence = carrierMatches ? "high" : "medium";
      reasons.push(
        carrierMatches
          ? `Flight lands in ${arrival.label} on a home carrier (${input.airline_name}), so ${arrivalCode} applies.`
          : `Flight lands in ${arrival.label}, where ${arrivalCode} covers inbound flights.`,
      );
    } else {
      alternatives.push(arrivalCode);
      reasons.push(`Arrival is in ${arrival.label} — ${arrivalCode} may apply if the operating carrier is based there.`);
    }
  }

  // 3. Baggage claims sit under the Montreal Convention on international routes.
  if (isBaggage) {
    if (international || departure.jurisdiction === "OTHER") {
      if (code) alternatives.unshift(code);
      code = "MONTREAL";
      confidence = "high";
      reasons.unshift("Baggage loss, damage or delay on an international flight falls under the Montreal Convention.");
    } else {
      alternatives.push("MONTREAL");
      reasons.push("Montreal Convention may also apply if any leg of the trip was international.");
    }
  }

  // 4. Carrier home jurisdiction as the last resort.
  if (!code && airline !== "OTHER") {
    code = REG_BY_JURISDICTION[airline];
    confidence = "low";
    reasons.push(
      `Airports were not recognised, so the match falls back to the carrier's home rules (${input.airline_name} — ${JURISDICTION_LABEL[airline]}).`,
    );
  }

  if (!code) {
    reasons.push("Route and carrier could not be matched to a regulation — review manually.");
  } else if (isDisruption && (code === "EU261" || code === "UK261")) {
    reasons.push("Delay of 3+ hours, cancellation inside 14 days or denied boarding triggers fixed compensation.");
  }

  if (code && departure.jurisdiction !== "OTHER" && arrival.jurisdiction !== "OTHER" && international && !alternatives.length) {
    const other = REG_BY_JURISDICTION[arrival.jurisdiction === departure.jurisdiction ? departure.jurisdiction : arrival.jurisdiction];
    if (other && other !== code) alternatives.push(other);
  }

  return { code, confidence, reasons, alternatives: Array.from(new Set(alternatives.filter((a) => a !== code))) };
}

/** True when the matched regulation normally pays cash compensation for this incident. */
export function isLikelyRefundable(code: string | null, issueType: string) {
  if (!code) return false;
  if (BAGGAGE_ISSUES.includes(issueType)) return true;
  if (DISRUPTION_ISSUES.includes(issueType)) return true;
  return false;
}
