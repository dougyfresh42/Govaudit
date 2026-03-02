import { describe, it, expect } from "vitest";
import { CsvParser } from "./csv";

describe("CsvParser", () => {
  const parser = new CsvParser();

  describe("read", () => {
    it("parses basic CSV", () => {
      const csv = `type,category,amount,description
income,Taxes,1000000,Federal revenue`;

      const result = parser.read(csv);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "income",
        category: "Taxes",
        amount: 1000000,
        description: "Federal revenue",
      });
    });

    it("parses multiple rows", () => {
      const csv = `type,category,amount,description
income,Taxes,1000000,Revenue 1
spending,Defense,500000,Spending 1
income,Customs,200000,Revenue 2`;

      const result = parser.read(csv);

      expect(result).toHaveLength(3);
      expect(result[0].type).toBe("income");
      expect(result[1].type).toBe("spending");
      expect(result[2].type).toBe("income");
    });

    it("handles quoted fields with commas", () => {
      const csv = `type,category,amount,description
income,Taxes,1000000,"Federal revenue, includes all taxes"`;

      const result = parser.read(csv);

      expect(result).toHaveLength(1);
      expect(result[0].description).toBe("Federal revenue, includes all taxes");
    });

    it("handles escaped double quotes", () => {
      const csv = `type,category,amount,description
income,Taxes,1000000,"He said ""hello"""`;

      const result = parser.read(csv);

      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('He said "hello"');
    });

    it("handles empty lines", () => {
      const csv = `type,category,amount,description
income,Taxes,1000000,Revenue

spending,Defense,500000,Spending

`;

      const result = parser.read(csv);

      expect(result).toHaveLength(3);
    });

    it("handles different header order", () => {
      const csv = `description,amount,category,type
Revenue,1000000,Taxes,income`;

      const result = parser.read(csv);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "income",
        category: "Taxes",
        amount: 1000000,
        description: "Revenue",
      });
    });

    it("handles numeric amounts with decimals", () => {
      const csv = `type,category,amount,description
income,Taxes,1000000.50,Revenue
spending,Defense,500000.99,Spending`;

      const result = parser.read(csv);

      expect(result[0].amount).toBe(1000000.5);
      expect(result[1].amount).toBe(500000.99);
    });

    it("returns empty array for empty content", () => {
      const csv = "";

      const result = parser.read(csv);

      expect(result).toHaveLength(0);
    });

    it("handles whitespace-only content", () => {
      const csv = "   ";

      const result = parser.read(csv);

      expect(result).toHaveLength(0);
    });
  });

  describe("write", () => {
    it("writes basic CSV", () => {
      const data = [
        {
          type: "income" as const,
          category: "Taxes",
          amount: 1000000,
          description: "Federal revenue",
        },
      ];

      const result = parser.write(data);

      expect(result).toBe("type,category,amount,description\nincome,Taxes,1000000,\"Federal revenue\"");
    });

    it("writes multiple rows", () => {
      const data = [
        { type: "income" as const, category: "Taxes", amount: 1000000, description: "Revenue 1" },
        { type: "spending" as const, category: "Defense", amount: 500000, description: "Spending 1" },
      ];

      const result = parser.write(data);

      const lines = result.split("\n");
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe("type,category,amount,description");
      expect(lines[1]).toBe("income,Taxes,1000000,\"Revenue 1\"");
      expect(lines[2]).toBe("spending,Defense,500000,\"Spending 1\"");
    });

    it("escapes double quotes in description", () => {
      const data = [
        { type: "income" as const, category: "Taxes", amount: 1000000, description: 'He said "hello"' },
      ];

      const result = parser.write(data);

      expect(result).toContain('He said ""hello"""');
    });

    it("handles description with commas", () => {
      const data = [
        { type: "income" as const, category: "Taxes", amount: 1000000, description: "Revenue, includes all" },
      ];

      const result = parser.write(data);

      expect(result).toContain('"Revenue, includes all"');
    });
  });

  describe("round-trip", () => {
    it("read then write produces valid CSV", () => {
      const original = `type,category,amount,description
income,Taxes,1000000,"Federal revenue"
spending,Defense,500000,Defense spending`;

      const items = parser.read(original);
      const written = parser.write(items);
      const reparsed = parser.read(written);

      expect(reparsed).toEqual(parser.read(original));
    });

    it("write then read is lossless", () => {
      const data = [
        { type: "income" as const, category: "Taxes", amount: 1000000, description: "Revenue" },
        { type: "spending" as const, category: "Defense", amount: 500000, description: "Defense, main" },
        { type: "income" as const, category: "Customs", amount: 200000, description: 'He said "hi"' },
      ];

      const written = parser.write(data);
      const readBack = parser.read(written);

      expect(readBack).toEqual(data);
    });
  });
});
