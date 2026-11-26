const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'expenses.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read expenses
const readExpenses = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write expenses
const writeExpenses = (expenses) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
};

// GET: Fetch all expenses
app.get('/api/expenses', (req, res) => {
    const expenses = readExpenses();
    res.json(expenses);
});

// POST: Add a new expense
app.post('/api/expenses', (req, res) => {
    const { title, amount, category } = req.body;

    if (!title || !amount || !category) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const expenses = readExpenses();
    const newExpense = {
        id: Date.now().toString(),
        title: title.trim(),
        amount: parseFloat(amount),
        category // "Need" or "Want"
    };

    expenses.push(newExpense);
    writeExpenses(expenses);
    res.status(201).json(newExpense);
});

// DELETE: Remove an expense by ID
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    let expenses = readExpenses();
    expenses = expenses.filter(item => item.id !== id);
    writeExpenses(expenses);
    res.json({ message: 'Expense deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});