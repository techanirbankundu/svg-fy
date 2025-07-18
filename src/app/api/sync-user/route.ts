// app/api/sync-user/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db"; // your Drizzle instance
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.clerkId, user.id));

  if (existingUser.length === 0) {
    await db.insert(userTable).values({
      clerkId: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      email: user.emailAddresses[0].emailAddress,
    });
  }

  return new Response("User synced", { status: 200 });
}
