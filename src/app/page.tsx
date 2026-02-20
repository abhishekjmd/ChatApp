import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";

const FALLBACK_AVATAR =
  "https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundColor=10b77f";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  const dashboardUser = {
    name: user?.fullName ?? user?.firstName ?? "User",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    imageUrl: user?.imageUrl ?? FALLBACK_AVATAR,
  };

  return <Dashboard user={dashboardUser} />;
}
