import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect the root path (/) to /dashboard
  redirect("/dashboard");
}
