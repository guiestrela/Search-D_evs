"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ProfileView = dynamic(
  () => import("@/components/profile-view").then((module) => module.ProfileView),
  { ssr: false }
);

// Reads the dynamic route param and renders the profile client component.
export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = typeof params?.username === "string" ? params.username : "";

  return <ProfileView username={username} />;
}
