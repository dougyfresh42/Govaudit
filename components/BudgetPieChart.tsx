"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import type { BudgetItem } from "@/lib/parsers";
import { useTheme } from "@/app/context/ThemeContext";

type Props = {
  data: BudgetItem[];
  type: "income" | "spending";
  title: string;
};

const INCOME_COLORS = [
  "#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0",
  "#15803d", "#166534", "#14532d", "#052e16",
];

const SPENDING_COLORS = [
  "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca",
  "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a",
  "#e05252", "#c84040", "#d43535", "#f06060", "#fa7272",
];

export default function BudgetPieChart({ data, type, title }: Props) {
  const { theme } = useTheme();

  const filtered = data
    .filter((d) => d.type === type && d.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const colors = type === "income" ? INCOME_COLORS : SPENDING_COLORS;

  const seriesData = filtered.map((d, i) => ({
    name: d.category,
    value: Math.round(d.amount / 1000000),
    itemStyle: { color: colors[i % colors.length] },
  }));

  const textColor = theme === "dark" ? "#f1f5f9" : "#111827";
  const subTextColor = theme === "dark" ? "#cbd5e1" : "#4b5563";

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params: { name: string; value: number; percent: number }) =>
        `${params.name}<br/>$${params.value.toLocaleString()}M (${params.percent}%)`,
    },
    legend: {
      type: "scroll" as const,
      orient: "horizontal" as const,
      bottom: 0,
      left: "center",
      width: "90%",
      pageIconColor: subTextColor,
      pageTextStyle: { color: subTextColor },
      itemGap: 8,
      textStyle: {
        color: subTextColor,
        fontSize: 11,
      },
      formatter: (name: string) => {
        const maxLen = 18;
        return name.length > maxLen ? name.slice(0, maxLen) + "…" : name;
      },
    },
    series: [
      {
        name: title,
        type: "pie",
        radius: ["35%", "65%"],
        center: ["50%", "42%"],
        avoidLabelOverlap: true,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
            color: textColor,
            formatter: (params: { name: string; percent: number }) =>
              `${params.percent}%`,
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: seriesData,
      },
    ],
  };

  return (
    <div className="bg-background-tertiary rounded-lg shadow p-4">
      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <ReactECharts
        option={option}
        style={{ height: "380px", width: "100%" }}
      />
    </div>
  );
}
