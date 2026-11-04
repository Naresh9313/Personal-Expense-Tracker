
import type { Request, Response } from "express";
import { db } from "../../database/db.ts";
import { categories, expenses } from "../../database/schema.ts";
import {eq } from "drizzle-orm";
import type { Category } from "../types/category.types.ts";


export const createCategory = async (req: Request,res: Response): Promise<Response> => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const categoryName = name.trim();

    const [newCategory] = await db
    .insert(categories)
    .values({
        name: categoryName,
      })
      .returning();

    return res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Add Category Error:", error);
  
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCategory = async (req: Request,res: Response): Promise<Response> => {
  try {
    const allCategories = await db.select().from(categories);

    if (allCategories.length === 0) {
      return res.status(200).json({
        message: "No categories found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: allCategories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export const updateCategory = async (req: Request,res: Response): Promise<Response> => {
  try {
    const id = Number(req.query.id);
    const { name }: Category = req.body;

    if (!id || !name) {
      return res.status(400).json({
        message: "Valid id and name are required",
      });
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        name: name.trim(),
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const deleteCategory = async (req: Request,res: Response): Promise<Response> => {
  try {
    const id = Number(req.query.id);

    if (!id) {
      return res.status(400).json({
        message: "Category id is required",
      });
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    
    const linkedExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.categoryId, id));
    
    
    if (linkedExpenses.length > 0) {
      return res.status(409).json({
        message: "Cannot delete category because expenses are linked",
      });
    }

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    return res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Cannot delete category. Expenses may be linked.",
    });
  }
};



