"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCommunities } from "@/context/CommunityContext";
import { parcels, calculateMonthlyCost } from "@/lib/data";
import type { HousingPreference } from "@/lib/types";

const UTILITIES = 400;
const MAINTENANCE = 120;

export default function CalculatorPage() {
  const { communities } = useCommunities();
  const [currentRent, setCurrentRent] = useState(2400);
  const [householdSize, setHouseholdSize] = useState("2");
  const [targetCommunityId, setTargetCommunityId] = useState(
    communities[0]?.id ?? ""
  );
  const [housingPreference, setHousingPreference] =
    useState<HousingPreference>("Standard");

  const selectedCommunity = communities.find((c) => c.id === targetCommunityId);
  const selectedParcel = selectedCommunity
    ? parcels.find((p) => p.id === selectedCommunity.parcelId)
    : null;

  const costs = useMemo(() => {
    if (!selectedCommunity || !selectedParcel) {
      return {
        landLease: 0,
        utilities: UTILITIES,
        maintenance: MAINTENANCE,
        total: 0,
        savings: 0,
        annualSavings: 0,
        tenYearSavings: 0,
      };
    }

    const landLease = Math.round(
      selectedParcel.landCostTotal / selectedCommunity.threshold / 300
    );
    const total = calculateMonthlyCost(
      selectedParcel.landCostTotal,
      selectedCommunity.threshold
    );
    const savings = currentRent - total;

    return {
      landLease,
      utilities: UTILITIES,
      maintenance: MAINTENANCE,
      total,
      savings,
      annualSavings: savings * 12,
      tenYearSavings: savings * 120,
    };
  }, [selectedCommunity, selectedParcel, currentRent]);

  const chartData = [
    { name: "Current Rent", amount: currentRent },
    { name: "Community Cost", amount: costs.total },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <div className="w-1/2 border-r border-neutral-200 p-8">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">
          Cost Calculator
        </h1>
        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-neutral-700">
              Current Monthly Rent ($)
            </label>
            <input
              type="number"
              value={currentRent}
              onChange={(e) => setCurrentRent(Number(e.target.value) || 0)}
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
              Target Community
            </label>
            <select
              value={targetCommunityId}
              onChange={(e) => setTargetCommunityId(e.target.value)}
              className="w-full border border-neutral-300 px-3 py-2 text-sm"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-700">
              Housing Type Preference
            </label>
            <select
              value={housingPreference}
              onChange={(e) =>
                setHousingPreference(e.target.value as HousingPreference)
              }
              className="w-full border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="Tiny Home">Tiny Home</option>
              <option value="Prefab">Prefab</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-1/2 p-8">
        <h2 className="mb-6 text-lg font-semibold text-neutral-900">
          Estimated Savings
        </h2>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">
              Est. Community Monthly Cost
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              ${costs.total.toLocaleString()}/mo
            </p>
            <p className="text-xs text-neutral-400">estimate</p>
          </div>
          <div className="border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Monthly Savings</p>
            <p
              className={`mt-1 text-2xl font-semibold ${
                costs.savings >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              ${costs.savings.toLocaleString()}/mo
            </p>
            <p className="text-xs text-neutral-400">estimate</p>
          </div>
          <div className="border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">Annual Savings</p>
            <p className="mt-1 text-xl font-semibold text-neutral-900">
              ${costs.annualSavings.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-400">estimate</p>
          </div>
          <div className="border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">10 Year Savings</p>
            <p className="mt-1 text-xl font-semibold text-neutral-900">
              ${costs.tenYearSavings.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-400">estimate</p>
          </div>
        </div>

        <div className="mb-8 h-64 border border-neutral-200 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
              />
              <Bar dataKey="amount" barSize={60}>
                <Cell fill="#171717" />
                <Cell fill="#16a34a" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-neutral-200 p-4">
          <h3 className="mb-3 text-sm font-medium text-neutral-900">
            Cost Breakdown (estimate)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Land lease per month</span>
              <span className="text-neutral-900">
                ${costs.landLease.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Utilities estimate</span>
              <span className="text-neutral-900">
                ${costs.utilities.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Maintenance estimate</span>
              <span className="text-neutral-900">
                ${costs.maintenance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 font-medium">
              <span className="text-neutral-900">Total monthly</span>
              <span className="text-neutral-900">
                ${costs.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
