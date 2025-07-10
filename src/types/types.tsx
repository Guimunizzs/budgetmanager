export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
}

export interface TransactionFormValues {
  description: string;
  amount: string;
  date: string;
  type: TransactionType;
  category: string;
}

export type CreateTransactionDate = Omit<Transaction, "id">;
