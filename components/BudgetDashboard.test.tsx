import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BudgetDashboard from "./BudgetDashboard";
import { ThemeProvider } from "@/app/context/ThemeContext";
import type { BudgetSnapshot } from "@/lib/importers/types";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const makeMeta = (snapshotKey: string, reportingPeriod: string) => ({
  snapshotKey,
  sourceName: "U.S. Treasury MTS",
  sourceUrl: "https://fiscaldata.treasury.gov/",
  reportingPeriod,
  dataDate: `${snapshotKey}-28`,
  importedAt: "2026-03-01T00:00:00.000Z",
  transformationNotes: "Test notes.",
});

const csvA = `type,category,amount,description
income,Individual Income Taxes,100000000000,"Federal revenue - Individual Income Taxes"
spending,Department of Defense,80000000000,"Federal spending - Department of Defense"`;

const csvB = `type,category,amount,description
income,Individual Income Taxes,90000000000,"Federal revenue - Individual Income Taxes"
spending,Department of Defense,70000000000,"Federal spending - Department of Defense"`;

const singleSnapshot: BudgetSnapshot[] = [
  { meta: makeMeta("2026-01", "January 2026"), csv: csvA },
];

const twoSnapshots: BudgetSnapshot[] = [
  { meta: makeMeta("2026-02", "February 2026"), csv: csvB },
  { meta: makeMeta("2026-01", "January 2026"), csv: csvA },
];

describe("BudgetDashboard", () => {
  it("renders without crashing with a single snapshot", () => {
    expect(() => {
      renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    }).not.toThrow();
  });

  it("does not show a snapshot selector when only one snapshot is available", () => {
    renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    expect(screen.queryByLabelText("Snapshot selector")).toBeNull();
  });

  it("shows a snapshot selector when multiple snapshots are available", () => {
    renderWithTheme(<BudgetDashboard snapshots={twoSnapshots} />);
    expect(screen.getByLabelText("Snapshot selector")).toBeTruthy();
  });

  it("displays the latest snapshot label with (latest) annotation", () => {
    renderWithTheme(<BudgetDashboard snapshots={twoSnapshots} />);
    expect(screen.getByText(/\(latest\)/)).toBeTruthy();
  });

  it("shows all snapshot period buttons in the selector", () => {
    renderWithTheme(<BudgetDashboard snapshots={twoSnapshots} />);
    expect(screen.getByRole("button", { name: /February 2026/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /January 2026/ })).toBeTruthy();
  });

  it("defaults to the first (latest) snapshot", () => {
    renderWithTheme(<BudgetDashboard snapshots={twoSnapshots} />);
    // DataSourceInfo should show the latest data date
    expect(screen.getByText(/2026-02-28/)).toBeTruthy();
  });

  it("switches to a prior snapshot when its button is clicked", () => {
    renderWithTheme(<BudgetDashboard snapshots={twoSnapshots} />);
    const janButton = screen.getByRole("button", { name: /January 2026/ });
    fireEvent.click(janButton);
    // DataSourceInfo should now show January 2026 data date
    expect(screen.getByText(/2026-01-28/)).toBeTruthy();
  });

  it("renders DataSourceInfo with the current snapshot's provenance", () => {
    renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    expect(screen.getByRole("complementary", { name: "Data source information" })).toBeTruthy();
    expect(screen.getByText(/U.S. Treasury MTS/)).toBeTruthy();
  });

  it("renders the data source info for whichever snapshot is selected", () => {
    renderWithTheme(<BudgetDashboard snapshots={twoSnapshots} />);
    // Initially shows February 2026 source info
    expect(screen.getByText(/2026-02-28/)).toBeTruthy();
    // Switch to January
    fireEvent.click(screen.getByRole("button", { name: /January 2026/ }));
    expect(screen.getByText(/2026-01-28/)).toBeTruthy();
  });
});
