import { unstable_cache, revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { upcomingEvents } from "@/lib/events";

// Whether registration is open for the Seed Program and each event. Admins flip it
// from the dashboard (Archive / Events pages); it's stored in Firestore so no deploy
// is needed. Public pages read a cached copy that is refreshed the moment an admin
// changes it. The form APIs always read the live value.

export type RegistrationKey = "seed" | `event:${string}`;

/** Used when nothing has been set yet. The Seed Program has ended; events start open. */
function defaultOpen(key: RegistrationKey) {
  return key !== "seed";
}

const DOC = () => getAdminDb().collection("settings").doc("registration");
const TAG = "registration";

type Stored = Partial<Record<RegistrationKey, { open: boolean; updatedAt: string; updatedBy: string }>>;

async function readStored(): Promise<Stored> {
  try {
    return ((await DOC().get()).data() as Stored) ?? {};
  } catch (err) {
    // Never take the site down over this; fall back to the defaults.
    console.error("Couldn't read registration settings:", err);
    return {};
  }
}

const readCached = unstable_cache(readStored, ["registration-settings"], { tags: [TAG], revalidate: 300 });

function resolve(stored: Stored, key: RegistrationKey) {
  return stored[key]?.open ?? defaultOpen(key);
}

/** For pages, navbar and footer (cached). */
export async function registrationOpen(key: RegistrationKey) {
  return resolve(await readCached(), key);
}

/** Upcoming events whose registration is open, for listings and the home page. */
export async function openEvents() {
  const stored = await readCached();
  return upcomingEvents.filter((e) => resolve(stored, `event:${e.id}`));
}

/** For the form APIs: always the live value, so a closed form can't be submitted. */
export async function registrationOpenNow(key: RegistrationKey) {
  return resolve(await readStored(), key);
}

/** Every key's state, for the admin dashboard. */
export async function registrationStates(keys: RegistrationKey[]) {
  const stored = await readStored();
  return Object.fromEntries(keys.map((k) => [k, { open: resolve(stored, k), ...stored[k] }]));
}

export async function setRegistrationOpen(key: RegistrationKey, open: boolean, by: string) {
  await DOC().set({ [key]: { open, updatedAt: new Date().toISOString(), updatedBy: by } }, { merge: true });
  revalidateTag(TAG);
}
