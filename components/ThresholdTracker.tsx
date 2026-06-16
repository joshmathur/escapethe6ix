interface ThresholdTrackerProps {
  currentPledges: number;
  threshold: number;
}

export default function ThresholdTracker({
  currentPledges,
  threshold,
}: ThresholdTrackerProps) {
  const percentage = Math.min((currentPledges / threshold) * 100, 100);
  const remaining = Math.max(threshold - currentPledges, 0);

  let barColor = "bg-neutral-300";
  let label = "Forming";
  let sublabel = `${remaining} more pledges needed`;

  if (percentage >= 100) {
    barColor = "bg-green-600";
    label = "Community Triggered";
    sublabel = "";
  } else if (percentage >= 80) {
    barColor = "bg-amber-500";
    label = "Almost There";
    sublabel = `${remaining} more pledges needed`;
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-neutral-600">
          {currentPledges} / {threshold} pledges
        </span>
        <span className="font-medium text-neutral-900">{label}</span>
      </div>
      <div className="h-2 w-full rounded-sm bg-neutral-200">
        <div
          className={`h-2 rounded-sm ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {sublabel && (
        <p className="mt-1 text-xs text-neutral-500">{sublabel}</p>
      )}
    </div>
  );
}
