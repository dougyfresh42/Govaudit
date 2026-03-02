"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import type { BudgetItem } from "@/lib/parsers";

type Props = {
  data: BudgetItem[];
};

export default function BudgetChart({ data }: Props) {
  const sortedByAmount = [...data].sort((a, b) => b.amount - a.amount);

  const categories = sortedByAmount.map((d) => d.category);

  const incomeData = categories.map((cat) => {
    const item = data.find((d) => d.category === cat && d.type === "income");
    return item ? item.amount / 1000000 : 0;
  });

  const spendingData = categories.map((cat) => {
    const item = data.find((d) => d.category === cat && d.type === "spending");
    return item ? item.amount / 1000000 : 0;
  });

  const option = {
    title: {
      text: "Treasury Income and Spending by Category",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: { name: string; value: number; seriesName: string }[]) => {
        let result = `<strong>${params[0].name}</strong><br/>`;
        params.forEach((p) => {
          result += `${p.seriesName}: $${p.value.toFixed(1)}M<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ["Income", "Spending"],
      top: 30,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Amount (millions)",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        formatter: (value: number) => `$${value}M`,
      },
    },
    yAxis: {
      type: "category",
      data: categories,
    },
    series: [
      {
        name: "Income",
        type: "bar",
        data: incomeData,
        itemStyle: {
          color: "#2e7d32",
        },
      },
      {
        name: "Spending",
        type: "bar",
        data: spendingData,
        itemStyle: {
          color: "#c62828",
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "500px", width: "100%" }}
    />
  );
}
