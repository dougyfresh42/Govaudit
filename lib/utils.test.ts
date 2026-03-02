import { describe, it, expect } from "vitest";
import { formatAmount } from "./utils";

describe("formatAmount", () => {
  it("formats positive millions", () => {
    expect(formatAmount(1000000)).toBe("$1.0M");
    expect(formatAmount(1500000)).toBe("$1.5M");
    expect(formatAmount(12345678)).toBe("$12.3M");
  });

  it("formats negative millions", () => {
    expect(formatAmount(-1000000)).toBe("$-1.0M");
    expect(formatAmount(-500000)).toBe("$-0.5M");
  });

  it("formats zero", () => {
    expect(formatAmount(0)).toBe("$0.0M");
  });

  it("formats small amounts less than 1M", () => {
    expect(formatAmount(500000)).toBe("$0.5M");
    expect(formatAmount(1)).toBe("$0.0M");
  });

  it("formats large amounts in billions", () => {
    expect(formatAmount(1000000000)).toBe("$1000.0M");
    expect(formatAmount(3500000000)).toBe("$3500.0M");
  });

  it("rounds to one decimal place", () => {
    expect(formatAmount(1500001)).toBe("$1.5M");
    expect(formatAmount(1500004)).toBe("$1.5M");
    expect(formatAmount(1500005)).toBe("$1.5M");
    expect(formatAmount(1500006)).toBe("$1.5M");
  });
});
