import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BudgetChart from "./BudgetChart";

describe("BudgetChart", () => {
  it("renders without crashing with valid data", () => {
    const data = [
      {
        type: "income" as const,
        category: "Taxes",
        amount: 1000000000,
        description: "Federal revenue",
      },
      {
        type: "spending" as const,
        category: "Defense",
        amount: 800000000,
        description: "Federal spending",
      },
    ];

    expect(() => {
      render(<BudgetChart data={data} />);
    }).not.toThrow();
  });

  it("renders with empty data", () => {
    expect(() => {
      render(<BudgetChart data={[]} />);
    }).not.toThrow();
  });

  it("renders with single income item", () => {
    const data = [
      {
        type: "income" as const,
        category: "Individual Income Taxes",
        amount: 1000000000,
        description: "Federal revenue",
      },
    ];

    expect(() => {
      render(<BudgetChart data={data} />);
    }).not.toThrow();
  });

  it("renders with single spending item", () => {
    const data = [
      {
        type: "spending" as const,
        category: "Department of Defense",
        amount: 800000000,
        description: "Federal spending",
      },
    ];

    expect(() => {
      render(<BudgetChart data={data} />);
    }).not.toThrow();
  });
});