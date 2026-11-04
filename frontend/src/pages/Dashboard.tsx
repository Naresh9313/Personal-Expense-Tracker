import { useEffect, useState } from "react";
import {ArrowUpRight,IndianRupee,Receipt,Tags,TrendingUp,CalendarDays} from "lucide-react";

import api from "../services/api";
import type { CategorySummary, Expense } from "../types";

const money = (value: string | number) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const getCurrentMonth = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const colors = [
  "#6c63ff",
  "#17b890",
  "#ffad5c",
  "#ef6a86",
  "#48a6d9",
  "#a78bfa",
];

export default function Dashboard() {
  const [monthly, setMonthly] = useState("0");
  const [summary, setSummary] = useState<CategorySummary[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");

    try {
      const [monthlyRes, categoryRes, expenseRes] = await Promise.all([
        api.get(`/expense/getMonthlyExpense?month=${month}`),
        api.get("/expense/getCategoryExpense"),
        api.get("/expense/getExpense"),
      ]);

      setMonthly(
        monthlyRes.data.totalExpense ||
          monthlyRes.data.data?.totalExpense ||
          "0"
      );

      setSummary(categoryRes.data.data || []);

      const recentExpenses: Expense[] = expenseRes.data.data || [];

      setExpenses(
        [...recentExpenses]
          .sort((a, b) =>
            String(b.expenseDate).localeCompare(String(a.expenseDate))
          )
          .slice(0, 5)
      );
    } catch (err: any) {
      console.error("Dashboard API Error:", err);
      console.error("Backend Response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [month]);

  const totalAll = summary.reduce(
    (sum, item) => sum + Number(item.totalExpense || 0),
    0
  );

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR FINANCES AT A GLANCE</p>
          <h1>Dashboard</h1>
          <p className="subheading">
            Understand your spending and stay in control.
          </p>
        </div>

        <label className="month-picker">
          <CalendarDays size={17} />

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="loading">Loading your overview…</div>
      ) : (
        <>
          <div className="stats-grid">
            <article className="stat-card primary-stat">
              <div className="stat-top">
                <span>Monthly spending</span>

                <div className="stat-icon">
                  <IndianRupee size={20} />
                </div>
              </div>

              <strong>{money(monthly)}</strong>

              <small>
                <TrendingUp size={14} />
                Total for selected month
              </small>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Expense categories</span>

                <div className="stat-icon purple">
                  <Tags size={20} />
                </div>
              </div>

              <strong>{summary.length}</strong>
              <small>Categories with spending</small>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Recent expenses</span>

                <div className="stat-icon orange">
                  <Receipt size={20} />
                </div>
              </div>

              <strong>{expenses.length}</strong>
              <small>Latest entries shown below</small>
            </article>
          </div>

          <div className="dashboard-grid">
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Spending by category</h2>
                  <p>Where your money goes</p>
                </div>

                <span className="panel-total">{money(totalAll)}</span>
              </div>

              {summary.length > 0 ? (
                <div className="category-bars">
                  {summary.map((item, index) => {
                    const value = Number(item.totalExpense || 0);
                    const percentage = totalAll
                      ? (value / totalAll) * 100
                      : 0;

                    const color = colors[index % colors.length];

                    return (
                      <div className="bar-item" key={item.categoryName}>
                        <div className="bar-label">
                          <span>
                            <i style={{ background: color }} />
                            {item.categoryName}
                          </span>

                          <b>{money(value)}</b>
                        </div>

                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${percentage}%`,
                              background: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty text="No category spending yet. Add an expense to see your breakdown." />
              )}
            </article>

            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent expenses</h2>
                  <p>Your latest transactions</p>
                </div>

                <a className="text-link" href="/expenses">
                  View all <ArrowUpRight size={15} />
                </a>
              </div>

              {expenses.length > 0 ? (
                <div className="recent-list">
                  {expenses.map((item, index) => (
                    <div className="recent-row" key={item.id}>
                      <div className={`expense-avatar tint-${index % 4}`}>
                        <Receipt size={17} />
                      </div>

                      <div className="recent-info">
                        <b>{item.title}</b>

                        <small>
                          {item.categoryName ||
                            `Category #${item.categoryId}`}
                          {" · "}
                          {String(item.expenseDate).slice(0, 10)}
                        </small>
                      </div>

                      <strong>{money(item.amount)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty text="No expenses recorded yet." />
              )}
            </article>
          </div>
        </>
      )}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Receipt size={23} />
      </div>

      <p>{text}</p>
    </div>
  );
}
