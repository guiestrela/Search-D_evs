import { redirect } from "next/navigation";

// Redirects the root route to the app's main search page.
export default function RootPage() {
  redirect("/home");
}
