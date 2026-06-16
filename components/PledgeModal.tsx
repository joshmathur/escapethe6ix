"use client";

import { useState } from "react";
import type { BudgetRange } from "@/lib/types";

interface PledgeModalProps {
  communityName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function PledgeModal({
  communityName,
  isOpen,
  onClose,
  onSubmit,
}: PledgeModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [householdSize, setHouseholdSize] = useState("1");
  const [budgetRange, setBudgetRange] = useState<BudgetRange>("Under $500/mo");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acknowledged) return;
    onSubmit();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setHouseholdSize("1");
      setBudgetRange("Under $500/mo");
      setAcknowledged(false);
      onClose();
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-sm">
        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-green-600">
              Pledge recorded successfully
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Thank you for your interest in {communityName}.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Pledge Interest — {communityName}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-neutral-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-neutral-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-neutral-700">
                  Household Size
                </label>
                <select
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-neutral-700">
                  Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) =>
                    setBudgetRange(e.target.value as BudgetRange)
                  }
                  className="w-full border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="Under $500/mo">Under $500/mo</option>
                  <option value="$500-$800/mo">$500-$800/mo</option>
                  <option value="$800-$1200/mo">$800-$1200/mo</option>
                  <option value="Over $1200/mo">Over $1200/mo</option>
                </select>
              </div>
              <label className="flex items-start gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5"
                />
                I understand this is a non-binding expression of interest
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!acknowledged}
                  className="flex-1 bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  Submit Pledge
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-neutral-300 px-4 py-2 text-sm text-neutral-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
