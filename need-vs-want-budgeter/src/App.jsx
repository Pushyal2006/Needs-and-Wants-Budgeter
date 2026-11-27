import { useState, useEffect } from "react";
import "./App.css";

const categories = [
  "Food",
  "Groceries",
  "Housing",
  "Transport",
  "Education",
  "Healthcare",
  "Shopping",
  "Entertainment",
  "Travel",
  "Bills",
  "Other",
];

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("budgetExpenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("Need");

  useEffect(() => {
    localStorage.setItem("budgetExpenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e) => {
    e.preventDefault();

    if (!name.trim() || Number(amount) <= 0) {
      alert("Please enter a valid expense name and amount.");
      return;
    }

    const newExpense = {
      id: crypto.randomUUID(),
      name: name.trim(),
      amount: Number(amount),
      category,
      type,
      date: new Date().toLocaleDateString("en-IN"),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    setName("");
    setAmount("");
    setCategory("Food");
    setType("Need");
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const needs = expenses.filter((item) => item.type === "Need");
  const wants = expenses.filter((item) => item.type === "Want");

  const needTotal = needs.reduce((total, item) => total + item.amount, 0);
  const wantTotal = wants.reduce((total, item) => total + item.amount, 0);
  const grandTotal = needTotal + wantTotal;

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const renderExpenseList = (list) => {
    if (list.length === 0) {
      return <p className="empty">No expenses added yet.</p>;
    }

    return list.map((item) => (
      <div className="expense-row" key={item.id}>
        <div className="expense-details">
          <div className={`expense-icon ${item.type.toLowerCase()}`}>
            {item.type === "Need" ? "🏠" : "✨"}
          </div>

          <div className="expense-text">
            <strong>{item.name}</strong>
            <span>
              {item.category} · {item.date}
            </span>
          </div>
        </div>

        <div className="expense-actions">
          <strong>{money(item.amount)}</strong>
          <button
            className="delete-button"
            onClick={() => deleteExpense(item.id)}
            aria-label={`Delete ${item.name}`}
            title="Delete expense"
          >
            ×
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">₹</div>
          <div>
            <h1>Need vs. Want</h1>
            <span>Budgeter</span>
          </div>
        </div>
        <span className="header-label">Personal Expense Tracker</span>
      </header>

      <main className="container">
        <section className="welcome">
          <span className="eyebrow">SMARTER MONEY HABITS</span>
          <h2>Expense Dashboard</h2>
          <p>Track your spending and separate your needs from your wants.</p>
        </section>

        {/* SUMMARY */}
        <section className="summary">
          <div className="summary-card total">
            <span>Total Expenses</span>
            <h3>{money(grandTotal)}</h3>
            <p>All recorded spending</p>
          </div>

          <div className="summary-card needs-summary">
            <span>Needs</span>
            <h3>{money(needTotal)}</h3>
            <p>{needs.length} expenses</p>
          </div>

          <div className="summary-card wants-summary">
            <span>Wants</span>
            <h3>{money(wantTotal)}</h3>
            <p>{wants.length} expenses</p>
          </div>
        </section>

        {/* FORM + LISTS */}
        <section className="dashboard">
          {/* ADD EXPENSE FORM */}
          <div className="card form-card">
            <h3>Add Expense</h3>
            <p className="card-subtitle">Enter your expense details</p>

            <form onSubmit={addExpense}>
              <div className="form-group">
                <label htmlFor="name">Expense Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Monthly groceries"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Expense Type</label>
                <div className="type-buttons">
                  <button
                    type="button"
                    className={type === "Need" ? "selected-need" : ""}
                    onClick={() => setType("Need")}
                  >
                    🏠 Need
                  </button>
                  <button
                    type="button"
                    className={type === "Want" ? "selected-want" : ""}
                    onClick={() => setType("Want")}
                  >
                    ✨ Want
                  </button>
                </div>
              </div>

              <button className="add-button" type="submit">
                + Add Expense
              </button>
            </form>
          </div>

          {/* NEEDS */}
          <div className="card list-card">
            <div className="list-heading">
              <div>
                <span className="list-emoji">🏠</span>
                <div>
                  <h3>Needs</h3>
                  <p>Essential expenses</p>
                </div>
              </div>
              <span className="counter need-counter">{needs.length}</span>
            </div>

            <div className="list-total need-total">
              <span>Total Needs</span>
              <strong>{money(needTotal)}</strong>
            </div>

            <div className="expenses">
              {renderExpenseList(needs)}
            </div>
          </div>

          {/* WANTS */}
          <div className="card list-card">
            <div className="list-heading">
              <div>
                <span className="list-emoji">✨</span>
                <div>
                  <h3>Wants</h3>
                  <p>Non-essential expenses</p>
                </div>
              </div>
              <span className="counter want-counter">{wants.length}</span>
            </div>

            <div className="list-total want-total">
              <span>Total Wants</span>
              <strong>{money(wantTotal)}</strong>
            </div>

            <div className="expenses">
              {renderExpenseList(wants)}
            </div>
          </div>
        </section>

        <footer>
          <strong>Need vs. Want Budgeter</strong>
          <span>Spend wisely. Save consistently.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;