
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Pencil, Trash2, Tags, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import type { Category } from "../types";

export default function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/category/getCategory");
      setItems(res.data.data || []);
    } catch (err: any) {
      console.log("Category GET Error:", err.response?.data);
      toast.error("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      if (editId !== null) {
        await api.put(
          `/category/updateCategory?id=${editId}`,
          { name: name.trim() }
        );

        toast.success("Category updated successfully.");
      } else {
        await api.post("/category/addCategory", {
          name: name.trim(),
        });

        toast.success("Category created successfully.");
      }

      setName("");
      setEditId(null);

      await load();
    } catch (err: any) {
      console.log("Category Save Error:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          "Could not save category."
      );
    }
  };

  const edit = (item: Category) => {
    setEditId(item.id);
    setName(item.name);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditId(null);
    setName("");
  };

  const remove = async (id: number) => {
    if (
      !confirm(
        "Delete this category? Categories linked to expenses cannot be deleted."
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/category/deleteCategory?id=${id}`
      );

      toast.success("Category deleted successfully.");

      await load();
    } catch (err: any) {
      console.log("Category Delete Error:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          "Could not delete category."
      );
    }
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ORGANIZE YOUR SPENDING</p>
          <h1>Categories</h1>
          <p className="subheading">
            Create labels to keep your expenses organized.
          </p>
        </div>

        <div className="heading-pill">
          <Tags size={16} />
          {items.length} categories
        </div>
      </div>

      <div className="content-grid">
        {/* Category Form */}
        <article className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h2>
                {editId !== null
                  ? "Edit category"
                  : "New category"}
              </h2>

              <p>
                {editId !== null
                  ? "Update category name"
                  : "Add a category to your tracker"}
              </p>
            </div>

            {editId !== null && (
              <button
                className="icon-button"
                type="button"
                onClick={cancelEdit}
              >
                <X size={17} />
              </button>
            )}
          </div>

          <form
            onSubmit={submit}
            className="form-stack"
          >
            <label>
              Category name

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. Food, Travel, Shopping"
                maxLength={100}
              />
            </label>

            <button
              className="btn-primary"
              type="submit"
            >
              <Plus size={17} />

              {editId !== null
                ? "Update category"
                : "Add category"}
            </button>
          </form>
        </article>

        {/* Category List */}
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your categories</h2>
              <p>Manage your spending labels</p>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              Loading…
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Tags />
              </div>

              <p>
                No categories yet. Create your first one.
              </p>
            </div>
          ) : (
            <div className="category-list">
              {items.map((item, i) => (
                <div
                  className="category-row"
                  key={item.id}
                >
                  <div
                    className={`category-dot dot-${i % 6}`}
                  />

                  <div className="category-name">
                    <b>{item.name}</b>

                    <small>
                      Category #{item.id}
                    </small>
                  </div>

                  <div className="row-actions">
                    <button
                      className="icon-button"
                      title="Edit"
                      type="button"
                      onClick={() => edit(item)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="icon-button danger"
                      title="Delete"
                      type="button"
                      onClick={() =>
                        void remove(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
