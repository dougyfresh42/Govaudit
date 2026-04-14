"use client";

import React from "react";
import { formatAmount } from "@/lib/utils";

type Props = {
  totalIncome: number;
  totalSpending: number;
};

export default function IncomeSpendingMeter({ totalIncome, totalSpending }: Props) {
  const total = totalIncome + totalSpending;
  const incomePercent = total > 0 ? (totalIncome / total) * 100 : 50;
  const spendingPercent = 100 - incomePercent;

  const surplus = totalIncome - totalSpending;
  const isDeficit = surplus < 0;

  return (
    <div className="bg-background-tertiary rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4 text-center">
        Income vs. Spending
      </h2>

      {/* Meter bar */}
      <div className="relative w-full h-8 sm:h-10 rounded-full overflow-hidden flex" role="meter" aria-label="Income vs Spending ratio">
        <div
          className="bg-green-500 flex items-center justify-center transition-all duration-500"
          style={{ width: `${incomePercent}%` }}
        >
          {incomePercent > 15 && (
            <span className="text-white text-xs font-bold truncate px-1">
              {incomePercent.toFixed(1)}%
            </span>
          )}
        </div>
        <div
          className="bg-red-500 flex items-center justify-center transition-all duration-500"
          style={{ width: `${spendingPercent}%` }}
        >
          {spendingPercent > 15 && (
            <span className="text-white text-xs font-bold truncate px-1">
              {spendingPercent.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Labels below bar */}
      <div className="flex justify-between mt-3 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 shrink-0" />
          <span className="text-sm text-text-secondary">
            Income{" "}
            <span className="font-semibold text-green-600 whitespace-nowrap">
              {formatAmount(totalIncome)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-text-secondary text-right">
            Spending{" "}
            <span className="font-semibold text-red-600 whitespace-nowrap">
              {formatAmount(totalSpending)}
            </span>
          </span>
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 shrink-0" />
        </div>
      </div>

      {/* Surplus / Deficit banner */}
      <div className={`mt-4 text-center text-sm font-medium ${isDeficit ? "text-red-600" : "text-green-600"}`}>
        {isDeficit
          ? `Deficit: ${formatAmount(Math.abs(surplus))}`
          : `Surplus: ${formatAmount(surplus)}`}
      </div>
    </div>
  );
}
