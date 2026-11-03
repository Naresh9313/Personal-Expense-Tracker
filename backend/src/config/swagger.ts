
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import expressBasicAuth from "express-basic-auth";

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Personal Expense Tracker API",
      version: "1.0.0",
      description: "Complete API Documentation",
    },

    servers: [
      {
        url: "http://localhost:10001/api",
        description: "Local Development Server",
      },
    ],

    paths: {
      // ================= CATEGORY APIs =================

      // Add Category
      "/category/addCategory": {
        post: {
          summary: "Add Category",
          tags: ["Category"],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Food",
                    },
                  },
                },
              },
            },
          },

          responses: {
            "201": {
              description: "Category Added Successfully",
            },
            "400": {
              description: "Bad Request",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Get All Categories
      "/category/getCategory": {
        get: {
          summary: "Get All Categories",
          tags: ["Category"],

          responses: {
            "200": {
              description: "Categories Fetched Successfully",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Update Category
      "/category/updateCategory": {
        put: {
          summary: "Update Category",
          tags: ["Category"],

          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              description: "Category ID",
              schema: {
                type: "integer",
              },
              example: 3,
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Petrol",
                    },
                  },
                },
              },
            },
          },

          responses: {
            "200": {
              description: "Category Updated Successfully",
            },
            "400": {
              description: "Bad Request",
            },
            "404": {
              description: "Category Not Found",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Delete Category
      "/category/deleteCategory": {
        delete: {
          summary: "Delete Category",
          tags: ["Category"],

          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              description: "Category ID",
              schema: {
                type: "integer",
              },
              example: 3,
            },
          ],

          responses: {
            "200": {
              description: "Category Deleted Successfully",
            },
            "400": {
              description: "Invalid Category ID",
            },
            "404": {
              description: "Category Not Found",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // ================= EXPENSE APIs =================

      // Add Expense
      "/expense/addExpense": {
        post: {
          summary: "Add Expense",
          tags: ["Expense"],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["categoryId", "amount", "description"],
                  properties: {
                    categoryId: {
                      type: "integer",
                      example: 3,
                    },
                    amount: {
                      type: "number",
                      example: 500,
                    },
                    description: {
                      type: "string",
                      example: "Petrol Expense",
                    },
                  },
                },
              },
            },
          },

          responses: {
            "201": {
              description: "Expense Added Successfully",
            },
            "400": {
              description: "Bad Request",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Get All Expenses
      "/expense/getExpense": {
        get: {
          summary: "Get All Expenses",
          tags: ["Expense"],

          responses: {
            "200": {
              description: "Expenses Fetched Successfully",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Update Expense
      "/expense/updateExpense": {
        put: {
          summary: "Update Expense",
          tags: ["Expense"],

          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              description: "Expense ID",
              schema: {
                type: "integer",
              },
              example: 3,
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    categoryId: {
                      type: "integer",
                      example: 2,
                    },
                    amount: {
                      type: "number",
                      example: 700,
                    },
                    description: {
                      type: "string",
                      example: "Updated Petrol Expense",
                    },
                  },
                },
              },
            },
          },

          responses: {
            "200": {
              description: "Expense Updated Successfully",
            },
            "400": {
              description: "Bad Request",
            },
            "404": {
              description: "Expense Not Found",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Delete Expense
      "/expense/deleteExpense": {
        delete: {
          summary: "Delete Expense",
          tags: ["Expense"],

          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              description: "Expense ID",
              schema: {
                type: "integer",
              },
              example: 3,
            },
          ],

          responses: {
            "200": {
              description: "Expense Deleted Successfully",
            },
            "400": {
              description: "Invalid Expense ID",
            },
            "404": {
              description: "Expense Not Found",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Get Monthly Expense
      "/expense/getMonthlyExpense": {
        get: {
          summary: "Get Monthly Expenses",
          tags: ["Expense"],

          parameters: [
            {
              name: "month",
              in: "query",
              required: true,
              description: "Month Number",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 12,
              },
              example: 11,
            },
            {
              name: "year",
              in: "query",
              required: true,
              description: "Year",
              schema: {
                type: "integer",
              },
              example: 2026,
            },
          ],

          responses: {
            "200": {
              description: "Monthly Expenses Fetched Successfully",
            },
            "400": {
              description: "Invalid Month or Year",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },

      // Get Category Wise Expense
      "/expense/getCategoryExpense": {
        get: {
          summary: "Get Category Wise Expenses",
          tags: ["Expense"],

          parameters: [
            {
              name: "categoryId",
              in: "query",
              required: true,
              description: "Category ID",
              schema: {
                type: "integer",
              },
              example: 3,
            },
          ],

          responses: {
            "200": {
              description: "Category Expenses Fetched Successfully",
            },
            "400": {
              description: "Invalid Category ID",
            },
            "404": {
              description: "Category Not Found",
            },
            "500": {
              description: "Internal Server Error",
            },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  const swaggerAuth = expressBasicAuth({
    users: {
      [process.env.SWAGGER_USERNAME || "admin"]:
        process.env.SWAGGER_PASSWORD || "change-me",
    },

    challenge: true,
    realm: "Swagger Documentation",
  });

  app.use(
    "/api-docs",
    swaggerAuth,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
  );
};
