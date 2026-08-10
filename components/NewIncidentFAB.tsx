// components/NewIncidentFAB.tsx
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function NewIncidentFAB() {
  return (
    <Link
      href="/incidents/new"
      className="md:hidden fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
      aria-label="New Incident"
    >
      <PlusIcon className="size-6" />
    </Link>
  );
}