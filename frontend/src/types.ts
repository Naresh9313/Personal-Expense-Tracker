export interface Category {
    id: number; 
    name: string; 
    createdAt?: string; 
    updatedAt?: string; 
}


export interface Expense {
    id: number;
    title: string; 
    amount: string | number; 
    categoryId: number; 
    categoryName?: string; 
    expenseDate: string; 
    notes?: string | null; 
}
export interface CategorySummary { 
    categoryName: string; 
    totalExpense: string | number; 
}