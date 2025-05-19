import type { VercelRequest, VercelResponse } from "@vercel/node";

const unusualActivities = [
    { type: "Vehicle in No-Parking Zone", details: "Blue Honda, Plate XYZ-123, near exit ramp" },
    { type: "Blocked Fire Lane", details: "Red Sedan, Plate DEF-789, blocking emergency access" },
    { type: "Unauthorized Vehicle", details: "White Van, Plate GHI-101, in reserved space" },
    { type: "Suspicious Activity", details: "Unknown individual checking multiple vehicles in Section C" }
];

const columnIds = ["A", "B", "C"];

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (req.query.deliberate === "true") {
        return res.status(500).json({ error: "Camera failure simulated (deliberate parameter present)" });
    }

    const timestamp = new Date().toISOString();
    const overallCapacity = 150;
    const currentVehicleCountSystem = Math.floor(Math.random() * 80) + 10;

    // Create individual column objects instead of an array
    const colEntries = columnIds.reduce((acc, columnId) => {
        const capacity = 50;
        const occupiedSpaces = Math.floor(Math.random() * (capacity + 1));

        acc[`Col${columnId}`] = {
            capacity,
            occupied_spaces: occupiedSpaces,
            plate_numbers_detected: occupiedSpaces
        };

        return acc;
    }, {} as Record<string, any>);

    // Activity flags (75% chance)
    let unusualActivityMessage = "";
    if (Math.random() < 0.75) {
        // Pick 1-2 random unusual activities
        const numActivities = Math.floor(Math.random() * 2) + 1;
        const selectedActivities = [...unusualActivities]
            .sort(() => 0.5 - Math.random())
            .slice(0, numActivities);

        unusualActivityMessage = selectedActivities
            .map(activity => `${activity.type}:\n${activity.details}`)
            .join('\n\n');
    }

    return res.status(200).json({
        timestamp,
        overall_capacity: overallCapacity,
        current_vehicle_count_system: currentVehicleCountSystem,
        ...colEntries, // Spread individual column objects
        unusual_activity: unusualActivityMessage
    });
}

