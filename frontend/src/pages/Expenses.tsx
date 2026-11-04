
// import { useEffect, useState } from "react";
// import type { FormEvent } from "react";
// import {Plus,Pencil,Trash2,Search,ReceiptText,X,SlidersHorizontal} from "lucide-react";

// import api from "../services/api";
// import type { Category, Expense } from "../types";

// const money = (value: string | number) =>
//   Number(value || 0).toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   });

// const initial = {
//   title: "",
//   amount: "",
//   categoryId: "",
//   expenseDate: new Date().toISOString().slice(0, 10),
//   notes: "",
// };

// export default function Expenses() {
//   const [items, setItems] = useState<Expense[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [form, setForm] = useState(initial);
//   const [editId, setEditId] = useState<number | null>(null);

//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const loadCategories = async () => {
//     try {
//       const res = await api.get("/category/getCategory");

//       setCategories(res.data.data || []);
//     } catch (err: any) {
//       console.log("Category Error:", err.response?.data);

//       setError("Unable to load categories.");
//     }
//   };

//   const load = async () => {
//     setLoading(true);

//     try {
//       const params = new URLSearchParams();

//       if (search.trim()) {
//         params.set("search", search.trim());
//       }

//       if (categoryFilter) {
//         params.set("categoryId", categoryFilter);
//       }

//       if (startDate) {
//         params.set("startDate", startDate);
//       }

//       if (endDate) {
//         params.set("endDate", endDate);
//       }

//       const query = params.toString();

//       const res = await api.get(
//         `/expense/getExpense${query ? `?${query}` : ""}`
//       );

//       setItems(res.data.data || []);
//     } catch (err: any) {
//       console.log("Expense GET Error:", err.response?.data);

//       setError(
//         err.response?.data?.message ||
//           "Unable to load expenses."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     void loadCategories();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       void load();
//     }, 250);

//     return () => clearTimeout(timer);
//   }, [search, categoryFilter, startDate, endDate]);

//   // Form Change
//   const change = (
//     key: keyof typeof initial,
//     value: string
//   ) => {
//     setForm((old) => ({
//       ...old,
//       [key]: value,
//     }));
//   };

//   const submit = async (e: FormEvent) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (
//       !form.title.trim() ||
//       !form.amount ||
//       !form.categoryId ||
//       !form.expenseDate
//     ) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     if (Number(form.amount) <= 0) {
//       setError("Amount must be greater than zero.");
//       return;
//     }

//     const payload = {
//       title: form.title.trim(),
//       amount: Number(form.amount),
//       categoryId: Number(form.categoryId),
//       expenseDate: form.expenseDate,
//       notes: form.notes.trim() || null,
//     };

//     try {
//       if (editId !== null) {
//         await api.put(
//           `/expense/updateExpense?id=${editId}`,
//           payload
//         );

//         setSuccess("Expense updated successfully.");
//       } else {
//         await api.post(
//           "/expense/addExpense",
//           payload
//         );

//         setSuccess("Expense added successfully.");
//       }

//       setForm(initial);
//       setEditId(null);

//       await load();
//     } catch (err: any) {
//       console.log("Expense Save Error:", err.response?.data);

//       setError(
//         err.response?.data?.message ||
//           "Could not save expense."
//       );
//     }
//   };

//   const edit = (item: Expense) => {
//     setEditId(item.id);

//     setForm({
//       title: item.title,
//       amount: String(item.amount),
//       categoryId: String(item.categoryId),
//       expenseDate: String(item.expenseDate).slice(0, 10),
//       notes: item.notes || "",
//     });

//     setError("");
//     setSuccess("");

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const cancelEdit = () => {
//     setEditId(null);
//     setForm(initial);
//     setError("");
//     setSuccess("");
//   };

//   const remove = async (id: number) => {
//     if (!confirm("Delete this expense?")) {
//       return;
//     }

//     setError("");
//     setSuccess("");

//     try {
//       await api.delete(
//         `/expense/deleteExpense?id=${id}`
//       );

//       setSuccess("Expense deleted successfully.");

//       await load();
//     } catch (err: any) {
//       console.log("Expense Delete Error:", err.response?.data);

//       setError(
//         err.response?.data?.message ||
//           "Could not delete expense."
//       );
//     }
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setCategoryFilter("");
//     setStartDate("");
//     setEndDate("");
//   };

//   return (
//     <section>
//       <div className="page-heading">
//         <div>
//           <p className="eyebrow">
//             TRACK EVERY TRANSACTION
//           </p>

//           <h1>Expenses</h1>

//           <p className="subheading">
//             Add, edit, search and review your expenses.
//           </p>
//         </div>

//         <div className="heading-pill">
//           <ReceiptText size={16} />
//           {items.length} results
//         </div>
//       </div>

//       {error && <div className="alert">{error}</div>}

//       {success && (
//         <div className="success-alert">
//           {success}
//         </div>
//       )}

//       {/* Expense Form */}
//       <article className="panel expense-form-panel">
//         <div className="panel-heading">
//           <div>
//             <h2>
//               {editId !== null
//                 ? "Edit expense"
//                 : "Add expense"}
//             </h2>

//             <p>
//               {editId !== null
//                 ? "Update transaction details"
//                 : "Enter a new spending transaction"}
//             </p>
//           </div>

//           {editId !== null && (
//             <button
//               className="icon-button"
//               type="button"
//               onClick={cancelEdit}
//             >
//               <X size={17} />
//             </button>
//           )}
//         </div>

//         <form
//           className="expense-form"
//           onSubmit={submit}
//         >
//           <label>
//             Expense title *

//             <input
//               value={form.title}
//               onChange={(e) =>
//                 change("title", e.target.value)
//               }
//               placeholder="e.g. Grocery shopping"
//               maxLength={150}
//             />
//           </label>

//           <label>
//             Amount (₹) *

//             <input
//               type="number"
//               min="0.01"
//               step="0.01"
//               value={form.amount}
//               onChange={(e) =>
//                 change("amount", e.target.value)
//               }
//               placeholder="0.00"
//             />
//           </label>

//           <label>
//             Category *

//             <select
//               value={form.categoryId}
//               onChange={(e) =>
//                 change("categoryId", e.target.value)
//               }
//             >
//               <option value="">
//                 Choose category
//               </option>

//               {categories.map((c) => (
//                 <option
//                   key={c.id}
//                   value={c.id}
//                 >
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label>
//             Date *

//             <input
//               type="date"
//               value={form.expenseDate}
//               onChange={(e) =>
//                 change("expenseDate", e.target.value)
//               }
//             />
//           </label>

//           <label className="notes-field">
//             Notes

//             <input
//               value={form.notes}
//               onChange={(e) =>
//                 change("notes", e.target.value)
//               }
//               placeholder="Optional details"
//             />
//           </label>

//           <div className="form-action">
//             <button
//               className="btn-primary"
//               type="submit"
//             >
//               <Plus size={17} />

//               {editId !== null
//                 ? "Save changes"
//                 : "Add expense"}
//             </button>
//           </div>
//         </form>
//       </article>

//       <article className="panel table-panel">
//         <div className="panel-heading">
//           <div>
//             <h2>All transactions</h2>

//             <p>
//               Search and filter your expense history
//             </p>
//           </div>

//           <span className="heading-pill">
//             <SlidersHorizontal size={15} />
//             Filters
//           </span>
//         </div>

//         <div className="filters">
//           <label className="search-box">
//             <Search size={17} />

//             <input
//               value={search}
//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }
//               placeholder="Search expense title…"
//             />
//           </label>

//           <select
//             value={categoryFilter}
//             onChange={(e) =>
//               setCategoryFilter(e.target.value)
//             }
//           >
//             <option value="">
//               All categories
//             </option>

//             {categories.map((c) => (
//               <option
//                 key={c.id}
//                 value={c.id}
//               >
//                 {c.name}
//               </option>
//             ))}
//           </select>

//           <input
//             aria-label="Start date"
//             type="date"
//             value={startDate}
//             onChange={(e) =>
//               setStartDate(e.target.value)
//             }
//           />

//           <input
//             aria-label="End date"
//             type="date"
//             value={endDate}
//             onChange={(e) =>
//               setEndDate(e.target.value)
//             }
//           />

//           <button
//             className="btn-light"
//             type="button"
//             onClick={resetFilters}
//           >
//             Reset
//           </button>
//         </div>

//         {loading ? (
//           <div className="loading">
//             Loading expenses…
//           </div>
//         ) : items.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">
//               <ReceiptText />
//             </div>

//             <p>
//               No expenses found. Try another filter
//               or add an expense.
//             </p>
//           </div>
//         ) : (
//           <div className="table-wrap">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Expense</th>
//                   <th>Category</th>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {items.map((item) => (
//                   <tr key={item.id}>
//                     <td>
//                       <div className="table-expense">
//                         <div className="expense-avatar tint-1">
//                           <ReceiptText size={16} />
//                         </div>

//                         <div>
//                           <b>{item.title}</b>

//                           {item.notes && (
//                             <small>{item.notes}</small>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     <td>
//                       <span className="category-badge">
//                         {item.categoryName ||
//                           categories.find(
//                             (c) =>
//                               c.id === item.categoryId
//                           )?.name ||
//                           `#${item.categoryId}`}
//                       </span>
//                     </td>

//                     <td>
//                       {String(item.expenseDate).slice(
//                         0,
//                         10
//                       )}
//                     </td>

//                     <td className="amount-cell">
//                       {money(item.amount)}
//                     </td>

//                     <td>
//                       <div className="row-actions">
//                         <button
//                           className="icon-button"
//                           title="Edit expense"
//                           type="button"
//                           onClick={() => edit(item)}
//                         >
//                           <Pencil size={16} />
//                         </button>

//                         <button
//                           className="icon-button danger"
//                           title="Delete expense"
//                           type="button"
//                           onClick={() =>
//                             void remove(item.id)
//                           }
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </article>
//     </section>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ReceiptText,
  X,
  SlidersHorizontal,
} from "lucide-react";

import api from "../services/api";
import type { Category, Expense } from "../types";

// -------------------- Helpers --------------------

const money = (value: string | number) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const initialForm = {
  title: "",
  amount: "",
  categoryId: "",
  expenseDate: getToday(),
  notes: "",
};

// -------------------- Component --------------------

export default function Expenses() {
  const [items, setItems] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -------------------- Load Categories --------------------

  const loadCategories = useCallback(async () => {
    try {
      const res = await api.get("/category/getCategory");
      setCategories(res.data.data || []);
    } catch (err: any) {
      console.error("Category Error:", err.response?.data);
      setError("Unable to load categories.");
    }
  }, []);

  // -------------------- Load Expenses --------------------

  const loadExpenses = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (categoryFilter) {
        params.set("categoryId", categoryFilter);
      }

      if (startDate) {
        params.set("startDate", startDate);
      }

      if (endDate) {
        params.set("endDate", endDate);
      }

      const query = params.toString();

      const res = await api.get(
        `/expense/getExpense${query ? `?${query}` : ""}`
      );

      setItems(res.data.data || []);
    } catch (err: any) {
      console.error("Expense GET Error:", err.response?.data);

      setError(
        err.response?.data?.message || "Unable to load expenses."
      );
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, startDate, endDate]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadExpenses();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadExpenses]);

  // -------------------- Form Handling --------------------

  const change = (key: keyof typeof initialForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.title.trim() ||
      !form.amount ||
      !form.categoryId ||
      !form.expenseDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const amount = Number(form.amount);

    if (isNaN(amount) || amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      amount,
      categoryId: Number(form.categoryId),
      expenseDate: form.expenseDate,
      notes: form.notes.trim() || null,
    };

    try {
      if (editId !== null) {
        await api.put(
          `/expense/updateExpense?id=${editId}`,
          payload
        );

        setSuccess("Expense updated successfully.");
      } else {
        await api.post("/expense/addExpense", payload);

        setSuccess("Expense added successfully.");
      }

      resetForm();
      await loadExpenses();
    } catch (err: any) {
      console.error("Expense Save Error:", err.response?.data);

      setError(
        err.response?.data?.message || "Could not save expense."
      );
    }
  };

  // -------------------- Edit Expense --------------------

  const edit = (item: Expense) => {
    setEditId(item.id);

    setForm({
      title: item.title,
      amount: String(item.amount),
      categoryId: String(item.categoryId),
      expenseDate: String(item.expenseDate).slice(0, 10),
      notes: item.notes || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    resetForm();
    setError("");
    setSuccess("");
  };

  // -------------------- Delete Expense --------------------

  const remove = async (id: number) => {
    if (!confirm("Delete this expense?")) return;

    setError("");
    setSuccess("");

    try {
      await api.delete(`/expense/deleteExpense?id=${id}`);

      setSuccess("Expense deleted successfully.");
      await loadExpenses();
    } catch (err: any) {
      console.error("Expense Delete Error:", err.response?.data);

      setError(
        err.response?.data?.message || "Could not delete expense."
      );
    }
  };

  // -------------------- Reset Filters --------------------

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setStartDate("");
    setEndDate("");
  };

  // -------------------- UI --------------------

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TRACK EVERY TRANSACTION</p>

          <h1>Expenses</h1>

          <p className="subheading">
            Add, edit, search and review your expenses.
          </p>
        </div>

        <div className="heading-pill">
          <ReceiptText size={16} />
          {items.length} results
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {success && (
        <div className="success-alert">{success}</div>
      )}

      {/* Expense Form */}

      <article className="panel expense-form-panel">
        <div className="panel-heading">
          <div>
            <h2>{editId !== null ? "Edit expense" : "Add expense"}</h2>

            <p>
              {editId !== null
                ? "Update transaction details"
                : "Enter a new spending transaction"}
            </p>
          </div>

          {editId !== null && (
            <button
              className="icon-button"
              type="button"
              onClick={cancelEdit}
              title="Cancel editing"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <form className="expense-form" onSubmit={submit}>
          <label>
            Expense title *

            <input
              value={form.title}
              onChange={(e) => change("title", e.target.value)}
              placeholder="e.g. Grocery shopping"
              maxLength={150}
              required
            />
          </label>

          <label>
            Amount (₹) *

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => change("amount", e.target.value)}
              placeholder="0.00"
              required
            />
          </label>

          <label>
            Category *

            <select
              value={form.categoryId}
              onChange={(e) => change("categoryId", e.target.value)}
              required
            >
              <option value="">Choose category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date *

            <input
              type="date"
              value={form.expenseDate}
              onChange={(e) => change("expenseDate", e.target.value)}
              required
            />
          </label>

          <label className="notes-field">
            Notes

            <input
              value={form.notes}
              onChange={(e) => change("notes", e.target.value)}
              placeholder="Optional details"
            />
          </label>

          <div className="form-action">
            <button className="btn-primary" type="submit">
              <Plus size={17} />

              {editId !== null ? "Save changes" : "Add expense"}
            </button>
          </div>
        </form>
      </article>

      {/* Expenses Table */}

      <article className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h2>All transactions</h2>

            <p>Search and filter your expense history</p>
          </div>

          <span className="heading-pill">
            <SlidersHorizontal size={15} />
            Filters
          </span>
        </div>

        {/* Filters */}

        <div className="filters">
          <label className="search-box">
            <Search size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expense title..."
            />
          </label>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            aria-label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            aria-label="End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            className="btn-light"
            type="button"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        {/* Table Content */}

        {loading ? (
          <div className="loading">Loading expenses...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <ReceiptText />
            </div>

            <p>
              No expenses found. Try another filter or add an expense.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const categoryName =
                    item.categoryName ||
                    categories.find(
                      (category) => category.id === item.categoryId
                    )?.name ||
                    `#${item.categoryId}`;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="table-expense">
                          <div className="expense-avatar tint-1">
                            <ReceiptText size={16} />
                          </div>

                          <div>
                            <b>{item.title}</b>

                            {item.notes && (
                              <small>{item.notes}</small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {categoryName}
                        </span>
                      </td>

                      <td>
                        {String(item.expenseDate).slice(0, 10)}
                      </td>

                      <td className="amount-cell">
                        {money(item.amount)}
                      </td>

                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            title="Edit expense"
                            type="button"
                            onClick={() => edit(item)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-button danger"
                            title="Delete expense"
                            type="button"
                            onClick={() => void remove(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
