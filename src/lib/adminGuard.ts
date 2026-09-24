import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Verifies the Firebase ID token sent as "Authorization: Bearer <token>" and
// checks the account is on the ADMIN_EMAILS allowlist.
export async function requireAdmin(
  req: NextRequest
): Promise<{ email: string } | NextResponse> {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const email = decoded.email?.toLowerCase();
    if (!email || !adminEmails().includes(email)) {
      return NextResponse.json(
        { error: "This account doesn't have admin access." },
        { status: 403 }
      );
    }
    return { email };
  } catch {
    return NextResponse.json(
      { error: "Session expired. Sign in again." },
      { status: 401 }
    );
  }
}
