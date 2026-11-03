
import { Router } from "express";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/category.controller.ts";

const categoryRouter = Router();

categoryRouter.post("/addCategory", createCategory);
categoryRouter.get("/getCategory", getCategory);
categoryRouter.put("/updateCategory", updateCategory);
categoryRouter.delete("/deleteCategory", deleteCategory);

export default categoryRouter;

