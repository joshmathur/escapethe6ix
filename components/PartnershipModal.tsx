"use client";

import { useState } from "react";

interface PartnershipModalProps {
  communityName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnershipModal({
  communityName,
  isOpen,
  onClose,
}: PartnershipModalProps) {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setOrganization("");
      setMessage("");
      onClose();
    }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-sm">
        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-green-600">
              Partnership request submitted
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Our team will be in touch regarding {communityName}.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Initiate Partnership — {communityName}
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
                  Organization
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-neutral-700">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-neutral-900 px-4 py-2 text-sm text-white"
                >
                  Submit
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
