"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ProfileView = dynamic(
  () => import("@/components/profile-view").then((module) => module.ProfileView),
  { ssr: false }
);

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = typeof params?.username === "string" ? params.username : "";

  return <ProfileView username={username} />;
}
