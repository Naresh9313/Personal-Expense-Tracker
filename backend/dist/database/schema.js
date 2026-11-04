import { pgTable, serial, varchar, text, numeric, date, timestamp, integer, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 150 }).notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    categoryId: integer("category_id").notNull().references(() => categories.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
    }),
    expenseDate: date("expense_date").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => ({
    amountPositive: check("amount_positive", sql `${table.amount} > 0`),
}));
// ==================== CATEGORIES RELATIONS ====================
export const categoriesRelations = relations(categories, ({ many }) => ({
    expenses: many(expenses),
}));
// ==================== EXPENSES RELATIONS ====================
export const expensesRelations = relations(expenses, ({ one }) => ({
    category: one(categories, {
        fields: [expenses.categoryId],
        references: [categories.id],
    }),
}));
//# sourceMappingURL=schema.js.map