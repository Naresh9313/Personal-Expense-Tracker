
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import pool from "./database/db.ts";
import categoryRouter from "./app/routes/category.routes.ts";
import expenseRouter from "./app/routes/expense.routes.ts";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/category", categoryRouter);
app.use("/api/expense", expenseRouter);


async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server Running On http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
