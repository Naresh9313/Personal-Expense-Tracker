
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import pool from "./database/db.ts";
import categoryRouter from "./app/routes/category.routes.ts";
import expenseRouter from "./app/routes/expense.routes.ts";
import swaggerUi from "swagger-ui-express";
import { setupSwagger } from "./src/config/swagger.ts";
import colors from "colors"



const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://personal-expense-tracker-5648.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
setupSwagger(app);
app.get("/", (req, res) => {
  res.send("Hello Naresh Prajapti!");
});

app.use("/api/category", categoryRouter);
app.use("/api/expense", expenseRouter);


async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully!".bgGreen.yellow);

    app.listen(process.env.PORT, () => {
      console.log(`Server Running On http://localhost:${process.env.PORT}`.bgCyan.red);
      console.log("Swagger: http://localhost:10001/api-docs".bgMagenta.white);

    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
