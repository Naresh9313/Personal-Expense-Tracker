
import type { Request, Response } from "express";
import { db } from "../../database/db.ts";
import { expenses, categories } from "../../database/schema.ts";
import { and, eq, gte,ilike, lt, lte, sum } from "drizzle-orm";
import type { Expense } from "../types/expense.types.ts";

export const createExpense = async (req: Request,res: Response): Promise<Response> => {
  try {
    const { title, amount, categoryId, expenseDate, notes }:Expense = req.body;

    if (!title || !amount || !categoryId || !expenseDate) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    if (Number(amount) <= 0 || isNaN(Number(amount))) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(categoryId)));

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const [newExpense] = await db
      .insert(expenses)
      .values({
        title: title.trim(),
        amount: Number(amount).toFixed(2),
        categoryId: Number(categoryId),
        expenseDate,
        notes: notes || null,
      })
      .returning();

    return res.status(201).json({
      message: "Expense created successfully",
      data: newExpense,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




export const getExpenses = async (req: Request,res: Response): Promise<Response> => {
  try {
    const { search, categoryId, startDate, endDate } = req.query;
    const conditions = [];

    if (search) {
      conditions.push(
        ilike(expenses.title, `%${String(search)}%`)
      );
    }

    if (categoryId) {
      conditions.push(
        eq(expenses.categoryId, Number(categoryId))
      );
    }

    if (startDate) {
      conditions.push(
        gte(expenses.expenseDate, String(startDate))
      );
    }

    if (endDate) {
      conditions.push(
        lte(expenses.expenseDate, String(endDate))
      );
    }

    const allExpenses = await db
      .select({
        id: expenses.id,
        title: expenses.title,
        amount: expenses.amount,
        categoryId: expenses.categoryId,
        categoryName: categories.name,
        expenseDate: expenses.expenseDate,
        notes: expenses.notes,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        conditions.length > 0 ? and(...conditions) : undefined
      );

    return res.status(200).json({
      message: "Expenses fetched successfully",
      total: allExpenses.length,
      data: allExpenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




export const updateExpense = async (req: Request,res: Response): Promise<Response> => {
  try {
    const id = Number(req.query.id);

    const {
      title,
      amount,
      categoryId,
      expenseDate,
      notes,
    }: Expense = req.body;

    if (!id || !title || !amount || !categoryId || !expenseDate) {
      return res.status(400).json({
        message: "All required fields are required",
      });
    }

    if (Number(amount) <= 0 || isNaN(Number(amount))) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(categoryId)));

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const [updatedExpense] = await db
      .update(expenses)
      .set({
        title: title.trim(),
        amount: Number(amount).toFixed(2),
        categoryId: Number(categoryId),
        expenseDate,
        notes: notes || null,
        updatedAt: new Date(),
      })
      .where(eq(expenses.id, id))
      .returning();

    if (!updatedExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const deleteExpense = async (req: Request,res: Response): Promise<Response> => {
  try {
    const id = Number(req.query.id);

    if (!id) {
      return res.status(400).json({
        message: "Expense ID is required",
      });
    }

    const [deletedExpense] = await db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
      data: deletedExpense,
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




export const getMonthlyExpense = async (req: Request,res: Response): Promise<Response> => {
  try {
    const month = String(req.query.month || new Date().toISOString().slice(0, 7));

    const [year, monthNumber] = month.split("-").map(Number);

    const startDate = `${month}-01`;

    const nextMonthDate = new Date(year!, monthNumber!, 1);

    const nextMonth = `${nextMonthDate.getFullYear()}-${String(
      nextMonthDate.getMonth() + 1
    ).padStart(2, "0")}-01`;

    const [result] = await db
      .select({
        totalExpense: sum(expenses.amount),
      })
      .from(expenses)
      .where(
        and(
          gte(expenses.expenseDate, startDate),
          lt(expenses.expenseDate, nextMonth)
        )
      );

    return res.status(200).json({
      message: "Monthly expense fetched successfully",
      month,
      totalExpense: result?.totalExpense || "0",
    });
  } catch (error) {
    console.error("Monthly Expense Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const getCategoryExpense = async (req: Request,res: Response): Promise<Response> => {
  try {
    const result = await db
      .select({
        categoryName: categories.name,
        totalExpense: sum(expenses.amount),
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .groupBy(categories.id, categories.name);

    return res.status(200).json({
      message: "Category-wise expense fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Category Expense Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
