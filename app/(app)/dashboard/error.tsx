
"use client";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong loading your dashboard.</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}