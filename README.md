# Personal Expense Tracker


## Tech Stack

-   **Frontend:** React, TypeScript, Vite, Axios, Lucide React
-   **Backend:** Node.js, Express.js, TypeScript
-   **Database:** PostgreSQL (Neon DB), Drizzle ORM

## Features

### Dashboard
-   Monthly spending total and month selector
-   Spending breakdown by category
-   Recent transactions

### Categories
-   View, add, edit, and delete categories

### Expenses
-   Add, edit, and delete expenses
-   Expense title, amount, category, date, and optional notes
-   Search expenses
-   Category and date-range filters (backend support must be verified)

## Project Structure

``` 
personal-expense-tracker/
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   └── routes/
│   │   │___types/
│   ├── database/
│   │   │ drizzle
│   │   │    │______migrations
│   │   │    │______drizzle.config.ts   
│   │   │_ db.ts
│   │   │_schema.ts
│   ├── .env
│   ├── server.ts
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── Categories.tsx
│       │   └── Expenses.tsx
│       ├── services/
│       │   └── api.ts
│       └── types/
└── README.md
```


## Prerequisites
-   Node.js 
-   npm
-   Neon PostgreSQL database

## Environment Variables

#Backend
``` env
PORT=10001
DATABASE_URL=your_neon_postgresql_connection_string
```

#Frontend
``` env
VITE_API_URL=http://localhost:10001/api
```


## Database Setup
1.  Create a PostgreSQL database in Neon.
2.  Copy its connection string into `backend/.env` as `DATABASE_URL`.
3.  Confirm Drizzle schema and configuration point to the database.
4.  Run the migration commands/scripts configured in the backend
    `package.json`.



``` bash
npm install
npm run:db generate
npm run:db migrate
```



## Installation and Run

### Backend

``` bash
cd backend
npm install
```

``` bash
npm run dev
```

Backend URL:

``` text
http://localhost:10001
```

### Frontend

``` bash
cd frontend
npm install
```


``` bash
npm run dev
```

## API Endpoints

### Categories

  Method   Endpoint                                 Description
  -------- ---------------------------------------- -----------------
  GET      `/api/category/getCategory`              Get categories
  POST     `/api/category/addCategory`              Create category
  PUT      `/api/category/updateCategory?id={id}`   Update category
  DELETE   `/api/category/deleteCategory?id={id}`   Delete category

Example request body:

``` json
{
  "name": "Food"
}
```

### Expenses

  ------------------------------------------------------------------------------------------------
  Method                  Endpoint                                         Description
  ----------------------- ------------------------------------------------ -----------------------
  GET                     `/api/expense/getExpense`                        Get expenses

  POST                    `/api/expense/addExpense`                        Create expense

  PUT                     `/api/expense/updateExpense?id={id}`             Update expense

  DELETE                  `/api/expense/deleteExpense?id={id}`             Delete expense

  GET                     `/api/expense/getMonthlyExpense?month=YYYY-MM`   Get monthly total

  GET                     `/api/expense/getCategoryExpense`                Get category-wise
                                                                           summary
  ------------------------------------------------------------------------------------------------

Example expense body:

``` json
{
  "title": "Grocery shopping",
  "amount": 850,
  "categoryId": 1,
  "expenseDate": "2026-11-03",
  "notes": "Weekly groceries"
}
```





