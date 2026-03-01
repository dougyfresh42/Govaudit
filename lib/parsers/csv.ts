import { BudgetItem, BudgetParser } from "./index";

export class CsvParser implements BudgetParser {
  name = "csv";

  read(content: string): BudgetItem[] {
    const lines = content.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    const typeIdx = headers.indexOf("type");
    const categoryIdx = headers.indexOf("category");
    const amountIdx = headers.indexOf("amount");
    const descriptionIdx = headers.indexOf("description");

    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line);
      return {
        type: values[typeIdx] as "income" | "spending",
        category: values[categoryIdx],
        amount: parseFloat(values[amountIdx]),
        description: values[descriptionIdx],
      };
    });
  }

  write(data: BudgetItem[]): string {
    const headers = ["type", "category", "amount", "description"];
    const rows = data.map((item) =>
      [item.type, item.category, item.amount, `"${item.description.replace(/"/g, '""')}"`].join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }
}
