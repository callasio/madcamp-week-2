import { Session } from "next-auth";
import { getUrl } from "../utils/url";

export async function postBlinks(startTimeStamp: string, minutes: number, count: number, session: Session): Promise<{
  success: boolean;
}> {
  const res = await fetch(getUrl('blinks', startTimeStamp, minutes.toString()), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.idToken}`,
    },
    body: JSON.stringify({ count }),
  });

  if (res.status !== 200) return { success: false };

  const data = await res.json();
  return data;
}