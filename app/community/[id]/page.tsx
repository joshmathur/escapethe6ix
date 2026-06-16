"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCommunities } from "@/context/CommunityContext";
import { parcels, getMunicipalityByName, getRoadAccessScore, getLegalScore } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import ThresholdTracker from "@/components/ThresholdTracker";
import type { DiscussionMessage, Poll } from "@/lib/types";

function ProgressBar({
  label,
  score,
  explanation,
}: {
  label: string;
  score: number;
  explanation: string;
}) {
  let barColor = "bg-red-500";
  if (score >= 80) barColor = "bg-green-600";
  else if (score >= 50) barColor = "bg-amber-500";

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-neutral-900">{label}</span>
        <span className="text-neutral-600">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-neutral-200">
        <div
          className={`h-2 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-neutral-500">{explanation}</p>
    </div>
  );
}

export default function CommunityPage() {
  const params = useParams();
  const id = params.id as string;
  const { communities } = useCommunities();

  const community = communities.find((c) => c.id === id);
  const parcel = community
    ? parcels.find((p) => p.id === community.parcelId)
    : null;
  const municipality = community
    ? getMunicipalityByName(community.municipalPartner)
    : null;

  const [discussion, setDiscussion] = useState<DiscussionMessage[]>(
    community?.discussion ?? []
  );
  const [newMessage, setNewMessage] = useState("");
  const [polls, setPolls] = useState<Poll[]>(community?.polls ?? []);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  if (!community || !parcel) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-600">Community not found.</p>
      </div>
    );
  }

  const legalScore = getLegalScore(parcel.legalStatus);
  const roadScore = getRoadAccessScore(parcel.roadAccessKm);
  const infraScore = community.infrastructureScore;

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setDiscussion([
      ...discussion,
      {
        user: "You",
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
  }

  function handleVote(pollId: string, optionIndex: number) {
    if (votedPolls.has(pollId)) return;
    setPolls(
      polls.map((poll) => {
        if (poll.id !== pollId) return poll;
        const newVotes = [...poll.votes];
        newVotes[optionIndex] = (newVotes[optionIndex] ?? 0) + 1;
        return { ...poll, votes: newVotes };
      })
    );
    setVotedPolls((prev) => {
      const next = new Set(prev);
      next.add(pollId);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8 border-b border-neutral-200 pb-6">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {community.name}
          </h1>
          <StatusBadge status={parcel.status} />
        </div>
        <ThresholdTracker
          currentPledges={community.currentPledges}
          threshold={community.threshold}
        />
      </div>

      <section className="mb-8 border border-neutral-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Readiness Breakdown
        </h2>
        <div className="space-y-4">
          <ProgressBar
            label="Legal Status"
            score={legalScore}
            explanation={
              parcel.legalStatus === "verified"
                ? "Land title and zoning have been verified by legal counsel."
                : "Legal verification is pending — title search in progress."
            }
          />
          <ProgressBar
            label="Road Access Score"
            score={roadScore}
            explanation={`${parcel.roadAccessKm} km from nearest maintained road.`}
          />
          <ProgressBar
            label="Infrastructure Score"
            score={infraScore}
            explanation="Based on proximity to utilities, municipal services, and existing infrastructure."
          />
        </div>
      </section>

      <section className="mb-8 border border-neutral-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Discussion Board
        </h2>
        <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
          {discussion.map((msg, i) => (
            <div key={i} className="border border-neutral-100 bg-neutral-50 p-3">
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-sm font-medium text-neutral-900">
                  {msg.user}
                </span>
                <span className="text-xs text-neutral-400">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-neutral-700">{msg.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-neutral-900 px-4 py-2 text-sm text-white"
          >
            Send
          </button>
        </form>
      </section>

      <section className="mb-8 border border-neutral-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Community Polls
        </h2>
        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
            const hasVoted = votedPolls.has(poll.id);

            return (
              <div key={poll.id} className="border border-neutral-100 p-4">
                <p className="mb-3 text-sm font-medium text-neutral-900">
                  {poll.question}
                </p>
                <div className="space-y-2">
                  {poll.options.map((option, idx) => {
                    const votes = poll.votes[idx] ?? 0;
                    const pct =
                      totalVotes > 0
                        ? Math.round((votes / totalVotes) * 100)
                        : 0;

                    return (
                      <div key={idx}>
                        <button
                          onClick={() => handleVote(poll.id, idx)}
                          disabled={hasVoted}
                          className={`mb-1 w-full border px-3 py-1.5 text-left text-sm ${
                            hasVoted
                              ? "cursor-default border-neutral-200 text-neutral-600"
                              : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                          }`}
                        >
                          {option}
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-neutral-200">
                            <div
                              className="h-2 bg-neutral-900"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-neutral-500">
                            {votes} ({pct}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {municipality && (
        <section className="border border-neutral-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Municipal Partner
          </h2>
          <div className="mb-3 flex items-center gap-3">
            <span className="font-medium text-neutral-900">
              {municipality.name}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                municipality.partnershipStatus === "confirmed"
                  ? "bg-green-600"
                  : "bg-amber-500"
              }`}
            >
              {municipality.partnershipStatus === "confirmed"
                ? "Confirmed"
                : "Interested"}
            </span>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-neutral-700">
            {municipality.incentivesOffered.map((incentive, i) => (
              <li key={i}>{incentive}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
