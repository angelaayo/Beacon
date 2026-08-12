"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Log Out"}
    </Button>
  );
}