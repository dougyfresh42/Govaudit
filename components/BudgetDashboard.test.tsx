import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BudgetDashboard from "./BudgetDashboard";
import { ThemeProvider } from "@/app/context/ThemeContext";
import type { BudgetSnapshot } from "@/lib/importers/types";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const makeMeta = (
  snapshotKey: string,
  reportingPeriod: string,
  datasetId: string = "treasury"
) => ({
  snapshotKey,
  datasetId,
  dataStatus: "pulled" as const,
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

// ── Dataset selector ────────────────────────────────────────────────────────

const ohioCsv = `type,category,amount,description
income,State Income Tax,750000000,"Ohio income tax"
spending,Education,700000000,"Ohio education"`;

const makeOhioMeta = (dataStatus: "pulled" | "stub" = "pulled") => ({
  snapshotKey: "2026-03",
  datasetId: "ohio",
  dataStatus,
  sourceName: "Ohio Checkbook",
  sourceUrl: "https://ohiocheckbook.ohio.gov/",
  reportingPeriod: "March 2026",
  dataDate: "2026-03-31",
  importedAt: "2026-04-15T00:00:00.000Z",
  transformationNotes: "Ohio notes.",
});

const mixedSnapshots: BudgetSnapshot[] = [
  { meta: makeMeta("2026-01", "January 2026", "treasury"), csv: csvA },
  { meta: makeOhioMeta(), csv: ohioCsv },
];

describe("BudgetDashboard — dataset selector", () => {
  it("always renders the dataset selector", () => {
    renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    expect(screen.getByLabelText("Dataset selector")).toBeTruthy();
  });

  it("renders a select element with all dataset options (treasury + 50 states)", () => {
    renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    const select = screen.getByRole("combobox", { name: /data source/i });
    expect(select).toBeTruthy();
    const options = screen.getAllByRole("option");
    // treasury + 50 states = 51 options
    expect(options.length).toBe(51);
  });

  it("defaults to the 'treasury' dataset", () => {
    renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    const select = screen.getByRole("combobox", { name: /data source/i }) as HTMLSelectElement;
    expect(select.value).toBe("treasury");
  });

  it("accepts a defaultDatasetId prop", () => {
    renderWithTheme(
      <BudgetDashboard snapshots={mixedSnapshots} defaultDatasetId="ohio" />
    );
    const select = screen.getByRole("combobox", { name: /data source/i }) as HTMLSelectElement;
    expect(select.value).toBe("ohio");
  });

  it("shows data for the default dataset on initial render", () => {
    renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    // singleSnapshot is treasury — DataSourceInfo shows treasury source name
    expect(screen.getByText(/U.S. Treasury MTS/)).toBeTruthy();
  });

  it("switches the displayed data when a different dataset is selected", () => {
    renderWithTheme(<BudgetDashboard snapshots={mixedSnapshots} />);
    // Initially shows treasury data (January 2026 dataDate)
    expect(screen.getByText(/2026-01-28/)).toBeTruthy();

    // Switch to Ohio — DataSourceInfo should now show Ohio's dataDate
    const select = screen.getByRole("combobox", { name: /data source/i });
    fireEvent.change(select, { target: { value: "ohio" } });

    expect(screen.getByText(/2026-03-31/)).toBeTruthy();
  });

  it("shows a 'not yet available' message when the selected dataset has no snapshots", () => {
    // washington has no snapshots in mixedSnapshots
    renderWithTheme(
      <BudgetDashboard snapshots={mixedSnapshots} defaultDatasetId="washington" />
    );
    expect(screen.getByText(/Data not yet available for Washington/i)).toBeTruthy();
  });

  it("resets to snapshot index 0 when switching datasets", () => {
    // Use two treasury snapshots plus one ohio snapshot
    const twoTreasuryPlusOhio: BudgetSnapshot[] = [
      { meta: makeMeta("2026-02", "February 2026", "treasury"), csv: csvB },
      { meta: makeMeta("2026-01", "January 2026", "treasury"), csv: csvA },
      { meta: makeOhioMeta(), csv: ohioCsv },
    ];
    renderWithTheme(<BudgetDashboard snapshots={twoTreasuryPlusOhio} />);

    // Click January to move to snapshot index 1
    fireEvent.click(screen.getByRole("button", { name: /January 2026/ }));
    expect(screen.getByText(/2026-01-28/)).toBeTruthy();

    // Switch to Ohio — should reset to Ohio's first (only) snapshot, showing Ohio dataDate
    const select = screen.getByRole("combobox", { name: /data source/i });
    fireEvent.change(select, { target: { value: "ohio" } });
    expect(screen.getByText(/2026-03-31/)).toBeTruthy();
  });

  it("snapshot selector is hidden for a dataset with only one snapshot", () => {
    // Ohio has only one snapshot
    renderWithTheme(
      <BudgetDashboard snapshots={mixedSnapshots} defaultDatasetId="ohio" />
    );
    expect(screen.queryByLabelText("Snapshot selector")).toBeNull();
  });

  it("does not show a stub warning banner for pulled data", () => {
    renderWithTheme(<BudgetDashboard snapshots={singleSnapshot} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows a stub warning banner when the active snapshot has dataStatus 'stub'", () => {
    const stubSnapshots: BudgetSnapshot[] = [
      { meta: makeOhioMeta("stub"), csv: ohioCsv },
    ];
    renderWithTheme(
      <BudgetDashboard snapshots={stubSnapshots} defaultDatasetId="ohio" />
    );
    const banner = screen.getByRole("alert");
    expect(banner).toBeTruthy();
    // The banner text includes "Placeholder data" (case-insensitive match within the alert)
    expect(banner.textContent).toMatch(/Placeholder data/i);
  });
});
