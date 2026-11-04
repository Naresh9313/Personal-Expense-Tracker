import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import pool from "./database/db.js";
import categoryRouter from "./app/routes/category.routes.js";
import expenseRouter from "./app/routes/expense.routes.js";
import swaggerUi from "swagger-ui-express";
import { setupSwagger } from "./src/config/swagger.js";
import colors from "colors";
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
}));
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
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map