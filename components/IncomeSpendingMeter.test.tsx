import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import IncomeSpendingMeter from "./IncomeSpendingMeter";

describe("IncomeSpendingMeter", () => {
  it("renders without crashing with income and spending", () => {
    expect(() => {
      render(<IncomeSpendingMeter totalIncome={500_000_000} totalSpending={400_000_000} />);
    }).not.toThrow();
  });

  it("renders a deficit case without crashing", () => {
    expect(() => {
      render(<IncomeSpendingMeter totalIncome={300_000_000} totalSpending={500_000_000} />);
    }).not.toThrow();
  });

  it("renders when totals are zero without crashing", () => {
    expect(() => {
      render(<IncomeSpendingMeter totalIncome={0} totalSpending={0} />);
    }).not.toThrow();
  });
});
