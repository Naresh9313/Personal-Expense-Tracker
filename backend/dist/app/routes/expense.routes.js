import { Router } from "express";
import { createExpense, deleteExpense, getCategoryExpense, getExpenses, getMonthlyExpense, updateExpense } from "../controllers/expense.controller.js";
const expenseRouter = Router();
expenseRouter.post("/addExpense", createExpense);
expenseRouter.get("/getExpense", getExpenses);
expenseRouter.put("/updateExpense", updateExpense);
expenseRouter.delete("/deleteExpense", deleteExpense);
expenseRouter.get("/getMonthlyExpense", getMonthlyExpense);
expenseRouter.get("/getCategoryExpense", getCategoryExpense);
export default expenseRouter;
//# sourceMappingURL=expense.routes.js.map