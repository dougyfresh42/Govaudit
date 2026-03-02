import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartErrorBoundary } from "./ChartErrorBoundary";

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div data-testid="child">Child rendered</div>;
}

describe("ChartErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ChartErrorBoundary>
        <div data-testid="child">Chart content</div>
      </ChartErrorBoundary>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("shows fallback UI when error is thrown", () => {
    render(
      <ChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChartErrorBoundary>
    );

    expect(screen.getByText("Failed to load chart")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("retry button is present in fallback", () => {
    render(
      <ChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChartErrorBoundary>
    );

    expect(screen.getByText("Try again")).toBeInTheDocument();
  });
});
