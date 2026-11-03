


import type { Request, Response } from "express";
import { db } from "../../database/db.ts";
import { categories, expenses } from "../../database/schema.ts";
import {eq } from "drizzle-orm";
import type { Category } from "../types/category.types.ts";

export const createCategory = async (req: Request,res: Response): Promise<Response> => {
  try {
    const { name }: Category = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name: name.trim(),
      })
      .returning();

    return res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Add Categories Error:", error);
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


// import type { Request, Response } from "express";
// import { db } from "../../database/db.ts";
// import { categories, expenses } from "../../database/schema.ts";
// import { eq } from "drizzle-orm";
// import type { Category } from "../types/category.types.ts";

// // ================= CREATE CATEGORY =================

// export const createCategory = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { name }: Category = req.body;

//     if (typeof name !== "string" || !name.trim()) {
//       return res.status(400).json({
//         message: "Category name is required",
//       });
//     }

//     const [newCategory] = await db
//       .insert(categories)
//       .values({
//         name: name.trim(),
//       })
//       .returning();

//     return res.status(201).json({
//       message: "Category created successfully",
//       data: newCategory,
//     });
//   } catch (error: any) {
//     console.error("Add Categories Error:", error);

//     if (error.code === "23505") {
//       return res.status(409).json({
//         message: "Category already exists",
//       });
//     }

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// // ================= GET CATEGORY =================

// export const getCategory = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const allCategories = await db
//       .select()
//       .from(categories);

//     if (allCategories.length === 0) {
//       return res.status(200).json({
//         message: "No categories found",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       message: "Categories fetched successfully",
//       data: allCategories,
//     });
//   } catch (error) {
//     console.error("Get Categories Error:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// // ================= UPDATE CATEGORY =================

// export const updateCategory = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const id = Number(req.query.id);
//     const { name }: Category = req.body;

//     if (
//       !Number.isInteger(id) ||
//       id <= 0 ||
//       typeof name !== "string" ||
//       !name.trim()
//     ) {
//       return res.status(400).json({
//         message: "Valid id and name are required",
//       });
//     }

//     const [updatedCategory] = await db
//       .update(categories)
//       .set({
//         name: name.trim(),
//         updatedAt: new Date(),
//       })
//       .where(eq(categories.id, id))
//       .returning();

//     if (!updatedCategory) {
//       return res.status(404).json({
//         message: "Category not found",
//       });
//     }

//     return res.status(200).json({
//       message: "Category updated successfully",
//       data: updatedCategory,
//     });
//   } catch (error: any) {
//     console.error("Update Category Error:", error);

//     if (error.code === "23505") {
//       return res.status(409).json({
//         message: "Category already exists",
//       });
//     }

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// // ================= DELETE CATEGORY =================

// export const deleteCategory = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const id = Number(req.query.id);

//     if (!Number.isInteger(id) || id <= 0) {
//       return res.status(400).json({
//         message: "Valid category id is required",
//       });
//     }

//     const [category] = await db
//       .select()
//       .from(categories)
//       .where(eq(categories.id, id));

//     if (!category) {
//       return res.status(404).json({
//         message: "Category not found",
//       });
//     }

//     // Check Linked Expenses

//    const linkedExpenses = await db
//   .select()
//   .from(expenses)
//   .where(eq(expenses.categoryId, id));

// if (linkedExpenses.length > 0) {
//   return res.status(409).json({
//     message: "Cannot delete category because expenses are linked",
//   });
// }

//     // Delete Category

//     const [deletedCategory] = await db
//       .delete(categories)
//       .where(eq(categories.id, id))
//       .returning();

//     return res.status(200).json({
//       message: "Category deleted successfully",
//       data: deletedCategory,
//     });
//   } catch (error: any) {
//     console.error("Delete Category Error:", error);

//     if (error.code === "23503") {
//       return res.status(409).json({
//         message: "Cannot delete category because expenses are linked",
//       });
//     }

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

