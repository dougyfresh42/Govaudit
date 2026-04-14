import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BudgetPieChart from "./BudgetPieChart";
import { ThemeProvider } from "@/app/context/ThemeContext";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const sampleData = [
  { type: "income" as const, category: "Individual Income Taxes", amount: 250_000_000_000, description: "" },
  { type: "income" as const, category: "Corporation Income Taxes", amount: 100_000_000_000, description: "" },
  { type: "spending" as const, category: "Department of Defense", amount: 80_000_000_000, description: "" },
  { type: "spending" as const, category: "Social Security", amount: 120_000_000_000, description: "" },
];

describe("BudgetPieChart", () => {
  it("renders income pie chart without crashing", () => {
    expect(() => {
      renderWithTheme(<BudgetPieChart data={sampleData} type="income" title="Income by Category" />);
    }).not.toThrow();
  });

  it("renders spending pie chart without crashing", () => {
    expect(() => {
      renderWithTheme(<BudgetPieChart data={sampleData} type="spending" title="Spending by Department" />);
    }).not.toThrow();
  });

  it("renders with empty data without crashing", () => {
    expect(() => {
      renderWithTheme(<BudgetPieChart data={[]} type="income" title="Income by Category" />);
    }).not.toThrow();
  });

  it("filters out negative amounts", () => {
    const dataWithNegative = [
      ...sampleData,
      { type: "spending" as const, category: "Other", amount: -35_000_000_000, description: "" },
    ];
    expect(() => {
      renderWithTheme(<BudgetPieChart data={dataWithNegative} type="spending" title="Spending by Department" />);
    }).not.toThrow();
  });
});
