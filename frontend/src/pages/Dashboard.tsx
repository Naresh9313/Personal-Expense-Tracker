import { useEffect, useState } from "react";
import { ArrowUpRight, IndianRupee, Receipt, Tags, TrendingUp, CalendarDays } from "lucide-react";
import api from "../services/api";
import type { CategorySummary, Expense } from "../types";

const money = (value: string | number) => Number(value || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
export default function Dashboard() {
  const [monthly, setMonthly] = useState("0");
  const [summary, setSummary] = useState<CategorySummary[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = async () => {
  setLoading(true);
  setError("");

  try {
    const [m, c, e] = await Promise.all([
      api.get(`/expense/getMonthlyExpense?month=${month}`),
      api.get("/expense/getCategoryExpense"),
      api.get("/expense/getExpense"),
    ]);

    setMonthly(
      m.data.totalExpense ||
      m.data.data?.totalExpense ||
      "0"
    );

    setSummary(c.data.data || []);

    setExpenses(
      (e.data.data || [])
        .slice()
        .sort((a: Expense, b: Expense) =>
          String(b.expenseDate).localeCompare(String(a.expenseDate))
        )
        .slice(0, 5)
    );

  } catch (error: any) {
    console.log("Dashboard API Error:", error);
    console.log("Backend Response:", error.response?.data);

    setError(
      error.response?.data?.message ||
      error.message ||
      "Could not load dashboard."
    );
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { void refresh(); }, [month]);
  const totalAll = summary.reduce((sum, item) => sum + Number(item.totalExpense || 0), 0);
  const colors = ["#6c63ff","#17b890","#ffad5c","#ef6a86","#48a6d9","#a78bfa"];
  return <section>
    <div className="page-heading"><div>
      
      <p className="eyebrow">YOUR FINANCES AT A GLANCE</p>
      <h1>Dashboard</h1><p className="subheading">Understand your spending and stay in control.</p></div>
      
      <label className="month-picker"><CalendarDays size={17}/>
      <input type="month" value={month} onChange={e=>setMonth(e.target.value)}/>
      </label>
      </div>

    {error && <div className="alert">{error}</div>}
    {loading ? <div className="loading">Loading your overview…</div> : <>
      <div className="stats-grid">
        <article className="stat-card primary-stat">
        <div className="stat-top"><span>Monthly spending</span>
        <div className="stat-icon"><IndianRupee size={20}/></div>
      </div>
        <strong>{money(monthly)}</strong>
        <small><TrendingUp size={14}/> Total for selected month</small></article>
       
        <article className="stat-card">
          <div className="stat-top">
            <span>Expense categories</span>
            <div className="stat-icon purple"><Tags size={20}/></div>
          </div>
          <strong>{summary.length}</strong>
          <small>Categories with spending</small>
        </article>
        <article className="stat-card">
          <div className="stat-top">
            <span>Recent expenses</span>
            <div className="stat-icon orange"><Receipt size={20}/></div>
          </div>
          <strong>{expenses.length}</strong>
          <small>Latest entries shown below</small>
        </article>
      </div>
      <div className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <div><h2>Spending by category</h2>
            <p>Where your money goes</p></div>
            <span className="panel-total">{money(totalAll)}</span></div>
          {summary.length ? <div className="category-bars">
            {summary.map((item,i) => {const val=Number(item.totalExpense||0); const pct=totalAll ? val/totalAll*100 : 0; return <div className="bar-item" key={item.categoryName}>
              <div className="bar-label"><span><i style={{background:colors[i%colors.length]}}/>{item.categoryName}</span><b>{money(val)}</b></div>
              <div className="bar-track">
                <div className="bar-fill" style={{width:`${pct}%`,background:colors[i%colors.length]}}/></div></div>;})}</div> 
                : <Empty text="No category spending yet. Add an expense to see your breakdown."/>}
        </article>
        <article className="panel">
          <div className="panel-heading">
            <div><h2>Recent expenses</h2><p>Your latest transactions</p></div>
            <a className="text-link" href="/expenses">View all <ArrowUpRight size={15}/></a></div>
          {expenses.length ? <div className="recent-list">{expenses.map((item,i)=>
            <div className="recent-row" key={item.id}>
              <div className={`expense-avatar tint-${i%4}`}><Receipt size={17}/></div>
              <div className="recent-info"><b>{item.title}</b><small>{item.categoryName || `Category #${item.categoryId}`} · {String(item.expenseDate).slice(0,10)}</small>
              </div>
              <strong>{money(item.amount)}</strong></div>)}</div> : <Empty text="No expenses recorded yet."/>}
        </article>
      </div>
    </>}
  </section>;
}

function Empty({text}:{text:string}) 
{
   return <div className="empty-state">
    <div className="empty-icon">
      <Receipt size={23}/></div><p>
        {text}
        </p></div>;
}