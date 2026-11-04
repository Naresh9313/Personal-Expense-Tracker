import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Tags,
  ReceiptText,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Expenses from "./pages/Expenses";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/categories", label: "Categories", icon: Tags },
    { to: "/expenses", label: "Expenses", icon: ReceiptText },
  ];

  return (
    <div className="app-shell">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Wallet size={21} />
          </div>
          <span>Spendly</span>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="avatar">NP</div>
            <div>
              <b>My Workspace</b>
              <small>Personal account</small>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <b>
              {location.pathname === "/"
                ? "Dashboard"
                : location.pathname
                    .slice(1)
                    .replace(/^./, (char) => char.toUpperCase())}
            </b>
          </div>

          <div className="top-user">
            <div className="avatar">NP</div>
            <span>Naresh</span>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/expenses" element={<Expenses />} />
          </Routes>
        </div>

        <footer className="footer">
          Spendly <span>•</span> Personal finance, made clear
        </footer>
      </main>
    </div>
  );
}
