// src/services/transactionService.ts

export interface Transaction {
  transactionId: string;
  nameId: string;
  amount: string;             // Total RM paid (string)
  fuelConsumption: string;    // Total liters received (string)
  subsidyLiters: string;      // Liters received from subsidy (string) or "-"
  status: "Eligible" | "Ineligible";
  date: string;               // YYYY-MM-DD
  subsidyType?: string;
  discountPercent?: number;
  pricePerLiter?: number;
}

class TransactionService {
  private STORAGE_KEY = "nocts_transactions";
  private transactions: Transaction[] = [];

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.transactions = stored ? JSON.parse(stored) : [];
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.transactions));
  }

  /**
   * Adds a transaction and persists to localStorage.
   * Returns the transactionId created.
   */
  addTransaction(data: {
    transactionId?: string;
    pumpNumber: number;
    amount: number;            // RM paid
    barcode?: string;
    discountApplied: boolean;
    fuelLiters: number;        // total liters
    subsidyLiters: number;     // liters covered by subsidy
    subsidyType?: string;
    discountPercent?: number;
    pricePerLiter?: number;
  }): string {
    const transactionId = data.transactionId ?? `TXN${Date.now()}`;

    // Mock user names linked to barcode (demo-only)
    const mockNames = [
      "Muhammad Syahmi Afif 050512070895",
      "Muhammad Nur Hakim 050316107837",
      "Muhammad Kurt Danial 050809109543",
      "Zahin Al-Bakry 001210017841",
      "Aishah Nabila 030420109844",
    ];

    const nameId = data.barcode
      ? mockNames[Math.floor(Math.random() * mockNames.length)]
      : "Walk-in Customer " + transactionId.slice(-4);

    const transaction: Transaction = {
      transactionId,
      nameId,
      amount: data.amount.toFixed(2),
      fuelConsumption: data.fuelLiters.toFixed(2),
      subsidyLiters:
        data.subsidyLiters > 0 ? data.subsidyLiters.toFixed(2) : "-",
      status: data.discountApplied ? "Eligible" : "Ineligible",
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      subsidyType: data.subsidyType,
      discountPercent: data.discountPercent,
      pricePerLiter: data.pricePerLiter,
    };

    this.transactions.unshift(transaction);
    this.save();

    return transactionId;
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  /**
   * monthKey format: 'YYYY-MM' (e.g. '2025-09')
   */
  getTransactionsByMonth(monthKey: string): Transaction[] {
    return this.transactions.filter((t) => t.date.startsWith(monthKey));
  }

  getEligibleTransactions(): Transaction[] {
    return this.transactions.filter((t) => t.status === "Eligible");
  }

  getIneligibleTransactions(): Transaction[] {
    return this.transactions.filter((t) => t.status === "Ineligible");
  }

  // Useful for testing / reset in development
  clearAll(): void {
    this.transactions = [];
    this.save();
  }
}

export const transactionService = new TransactionService();
