# Personal Expense Tracker

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Axios, Lucide React
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (Neon DB), Drizzle ORM

## Features

### Dashboard
- Monthly spending total and month selector
- Spending breakdown by category
- Recent transactions

### Categories
- View, add, edit, and delete categories

### Expenses
- Add, edit, and delete expenses
- Expense title, amount, category, date, and optional notes
- Search expenses
- Category and date-range filters (backend support must be verified)

## Project Structure

```text
personal-expense-tracker/
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── types/
│   ├── database/
│   │   ├── drizzle/
│   │   │   └── migrations/
│   │   ├── drizzle.config.ts
│   │   ├── db.ts
│   │   └── schema.ts
│   ├── .env
│   └── server.ts
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── Categories.tsx
│       │   └── Expenses.tsx
│       ├── services/
│       │   └── api.ts
│       └── types/
│
└── README.md
```

## 📋 Prerequisites

Before running the project, make sure you have installed:

- Node.js
- npm
- PostgreSQL database (Neon DB)
- Git

## ⚙️ Environment Variables

### Backend Configuration

Create a `.env` file inside the `backend` directory.

```env
PORT=10001
DATABASE_URL=your_neon_postgresql_connection_string
```

### Frontend Configuration

Create a `.env` file inside the `frontend` directory.

```env
VITE_API_URL=http://localhost:10001/api
```

**Note:** Replace the database connection string with your actual Neon PostgreSQL connection string.

## 🗄️ Database Setup

1. Create a PostgreSQL database using Neon.
2. Copy the Neon database connection string.
3. Add the connection string to `backend/.env`.
4. Configure Drizzle ORM using `drizzle.config.ts`.
5. Generate and run database migrations.

### Database Migration Commands

Run the following commands from the backend directory:

```bash
npm install
npm run db:generate
npm run db:migrate
```

## 📥 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd personal-expense-tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Start the backend development server:

```bash
npm run dev
```

Backend URL:

http://localhost:10001

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

## 📖 API Documentation

### Swagger Documentation

Swagger UI is available at:

http://localhost:10001/api-docs/

Use Swagger UI to explore and test the REST API endpoints.

## 🔗 API Endpoints

### Categories API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/category/getCategory` | Get all categories |
| POST | `/api/category/addCategory` | Create a new category |
| PUT | `/api/category/updateCategory?id={id}` | Update a category |
| DELETE | `/api/category/deleteCategory?id={id}` | Delete a category |

#### Example Request Body

```json
{
  "name": "Food"
}
```

### Expenses API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expense/getExpense` | Get all expenses |
| POST | `/api/expense/addExpense` | Create a new expense |
| PUT | `/api/expense/updateExpense?id={id}` | Update an expense |
| DELETE | `/api/expense/deleteExpense?id={id}` | Delete an expense |
| GET | `/api/expense/getMonthlyExpense?month=YYYY-MM` | Get monthly expense total |
| GET | `/api/expense/getCategoryExpense` | Get category-wise expense summary |

#### Example Expense Request Body

```json
{
  "title": "Grocery Shopping",
  "amount": 850,
  "categoryId": 1,
  "expenseDate": "2026-11-03",
  "notes": "Weekly groceries"
}
```

### Expense Filtering

The expense API supports query-based filtering:

```text
/api/expense/getExpense?search=Grocery
```

```text
/api/expense/getExpense?categoryId=1
```

```text
/api/expense/getExpense?startDate=2026-11-01&endDate=2026-11-30
```

Filters can also be combined:

```text
/api/expense/getExpense?search=Grocery&categoryId=1&startDate=2026-11-01&endDate=2026-11-30
```

## 🌐 Deployment

### Frontend

The frontend application is deployed on Vercel.

**Live URL:**

https://personal-expense-tracker-5648.vercel.app/
