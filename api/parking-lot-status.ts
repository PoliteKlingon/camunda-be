import type { VercelRequest, VercelResponse } from "@vercel/node";

const unusualActivities = [
    { type: "Vehicle in No-Parking Zone", details: "Blue Honda, Plate XYZ-123, near exit ramp" },
    { type: "Abandoned Vehicle", details: "Black SUV, Plate ABC-456, parked for over 72 hours" },
    { type: "Blocked Fire Lane", details: "Red Sedan, Plate DEF-789, blocking emergency access" },
    { type: "Unauthorized Vehicle", details: "White Van, Plate GHI-101, in reserved space" },
    { type: "Suspicious Activity", details: "Unknown individual checking multiple vehicles in Section C" }
];

const columnIds = ["A", "B", "C", "D"];

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (req.query.deliberate === "true") {
        return res.status(500).json({ error: "Camera failure simulated (deliberate parameter present)" });
    }

    const timestamp = new Date().toISOString();
    const overallCapacity = 200;
    const currentVehicleCountSystem = Math.floor(Math.random() * 80) + 10;

    const columns = columnIds.map(columnId => {
        const capacity = 50;
        const occupiedSpaces = Math.floor(Math.random() * (capacity + 1));

        return {
            column_id: columnId,
            capacity,
            occupied_spaces: occupiedSpaces,
            plate_numbers_detected: occupiedSpaces
        };
    });

    //  activity flags (30% chance)
    let unusualActivityFlags = [];
    if (Math.random() < 0.75) {
        // Pick 1-2 random unusual activities
        const numActivities = Math.floor(Math.random() * 2) + 1;
        unusualActivityFlags = [...unusualActivities]
            .sort(() => 0.5 - Math.random())
            .slice(0, numActivities);
    }

    return res.status(200).json({
        timestamp,
        overall_capacity: overallCapacity,
        current_vehicle_count_system: currentVehicleCountSystem,
        columns,
        unusual_activity_flags: unusualActivityFlags
    });
}

