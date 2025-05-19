import type { VercelRequest, VercelResponse } from "@vercel/node";

function randomUsage(): number {
  return parseFloat((Math.random() * 75).toFixed(2));
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { since } = req.query;

  if (!since) {
    return res.status(400).json({ error: "Missing since parameter" });
  }

  return res.status(200).json({
    usage: parseFloat(randomUsage().toFixed(2)),
  });
}
