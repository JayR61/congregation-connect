
export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string[]; // Array of strings
  type: 'income' | 'expense';
  paymentMethod?: string;
  reference?: string;
  status?: 'pending' | 'completed' | 'failed';
  attachments?: string[];
  notes?: string;
  recurring?: boolean;
  recurrencePattern?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdById?: string;
  isRecurring?: boolean; // Used in some components
  categoryId?: string; // Used in some forms
  deletedAt?: Date;
  deletedById?: string;
  deletedByName?: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  color?: string;
  parentId?: string;
  budget?: number;
}
