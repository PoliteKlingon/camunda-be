import type { VercelRequest, VercelResponse } from "@vercel/node";

const sectors = ["A", "B", "C", "D", "E"];

function randomUsage(): number {
  return parseFloat((50 + Math.random() * 50).toFixed(2));
}

function generateSectorUsages(): Record<string, number> {
  const usageMap: Record<string, number> = {};
  sectors.forEach((sector) => {
    usageMap[sector] = randomUsage();
  });
  return usageMap;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { since, until } = req.query;

  if (!since || !until) {
    return res.status(400).json({ error: "Missing since/until parameters" });
  }

  const baseUsages = generateSectorUsages();
  const overallUsage =
    Object.values(baseUsages).reduce((sum, val) => sum + val, 0) /
    sectors.length;

  const problemSectors = Object.entries(baseUsages)
    .filter(([_, usage]) => usage > 75)
    .map(([sector, usage]) => ({ sector, usage }));

  const issues = problemSectors.map(({ sector, usage }) => {
    const sinceMs = Date.parse(since as string);
    const untilMs = Date.parse(until as string);
    const minWindow = 1 * 60 * 60 * 1000;

    const maxStart = untilMs - minWindow;
    const issueSinceMs = sinceMs + Math.random() * (maxStart - sinceMs);
    const issueDuration = minWindow + Math.random() * (3 * 60 * 60 * 1000);

    const issueUntilMs = Math.min(issueSinceMs + issueDuration, untilMs);

    const issueSince = new Date(issueSinceMs).toISOString();
    const issueUntil = new Date(issueUntilMs).toISOString();

    const sectorList = sectors.map((sec) => {
      const base = baseUsages[sec];
      const fluctuation = base * (Math.random() * 0.2 - 0.1);
      const final = Math.min(Math.max(base + fluctuation, 0), 100);
      return {
        sector: sec,
        usage: sector === sec ? usage : parseFloat(final.toFixed(2)),
      };
    });

    return {
      since: issueSince,
      until: issueUntil,
      sector,
      usage,
      sectors: sectorList,
    };
  });

  return res.status(200).json({
    usage: parseFloat(overallUsage.toFixed(2)),
    issues,
  });
}
