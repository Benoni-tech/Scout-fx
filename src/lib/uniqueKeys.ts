import { createHash } from "crypto";
import type { Firestore, Transaction } from "firebase-admin/firestore";

// One lock document per (scope, email/phone). Created in the same transaction as the
// registration, so two submissions racing each other can't both get through.
// Ids are hashes, so the collection holds no personal data.

export type Scope = `event:${string}` | "community" | "seed";
export type Kind = "email" | "phone";

const COLLECTION = "uniqueKeys";

export function lockRef(db: Firestore, scope: Scope, kind: Kind, value: string) {
  const id = createHash("sha256").update(`${scope}|${kind}|${value}`).digest("hex");
  return db.collection(COLLECTION).doc(id);
}

/** Which of the given keys are already taken, read inside a transaction. */
export async function takenKeys(
  tx: Transaction,
  db: Firestore,
  scope: Scope,
  keys: Partial<Record<Kind, string>>
) {
  const taken: Kind[] = [];
  for (const [kind, value] of Object.entries(keys) as [Kind, string][]) {
    if (value && (await tx.get(lockRef(db, scope, kind, value))).exists) taken.push(kind);
  }
  return taken;
}

/** Claims the keys for `docPath` (call after takenKeys came back empty, in the same transaction). */
export function claimKeys(
  tx: Transaction,
  db: Firestore,
  scope: Scope,
  keys: Partial<Record<Kind, string>>,
  docPath: string
) {
  for (const [kind, value] of Object.entries(keys) as [Kind, string][]) {
    if (value) tx.create(lockRef(db, scope, kind, value), { scope, kind, doc: docPath, createdAt: new Date().toISOString() });
  }
}
