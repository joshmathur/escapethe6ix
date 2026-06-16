import type { Status } from "@/lib/types";

const statusStyles: Record<Status, string> = {
  available: "bg-slate-400 text-white",
  forming: "bg-amber-500 text-white",
  triggered: "bg-green-600 text-white",
};

const statusLabels: Record<Status, string> = {
  available: "Available",
  forming: "Forming",
  triggered: "Triggered",
};

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
