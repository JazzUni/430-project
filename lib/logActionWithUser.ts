import { getUserIdFromSession } from "./getUserId";
import { logAction } from "./logAction";

export async function logActionWithUser({
  action,
  target,
  targetId,
}: {
  action: string;
  target: string;
  targetId: string;
}) {
  const userId = await getUserIdFromSession();

  if (!userId) {
    console.warn("No userId found in session; skipping admin log");
    return;
  }

  await logAction({
    userId,
    action,
    target,
    targetId,
  });
}