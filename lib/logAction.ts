import AdminLog from "@/models/AdminLog";

export async function logAction({
    userId,
    action,
    target,
    targetId,
}: {
    userId: string;
    action: string;
    target: string;
    targetId: string;
}) {
    try {
        await AdminLog.create({
            userId,
            action,
            target,
            targetId,
        });
    } catch (err) {
        console.error("Failed to log action:", err);
    }
}