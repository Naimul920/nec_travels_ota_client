import { checkExistingAction } from "@/actions/auth.action";

const existsCache = new Map<string, boolean>();

async function checkExists(
  key: string,
  payload: { email?: string; phone?: string },
): Promise<boolean> {
  if (existsCache.has(key)) return existsCache.get(key)!;
  const result = await checkExistingAction(payload);
  const exists = result.success && result.exists;
  existsCache.set(key, exists);
  return exists;
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return checkExists(`email:${normalized}`, { email: normalized });
}

export async function checkPhoneExists(phone: string): Promise<boolean> {
  const normalized = phone.trim();
  if (!normalized) return false;
  return checkExists(`phone:${normalized}`, { phone: normalized });
}
