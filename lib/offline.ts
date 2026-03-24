"use client";
import { get, set } from "idb-keyval";

const QUEUE_KEY = "offline-actions";

export async function queueOfflineAction(action: unknown) {
  const current = (await get(QUEUE_KEY)) || [];
  current.push(action);
  await set(QUEUE_KEY, current);
}
