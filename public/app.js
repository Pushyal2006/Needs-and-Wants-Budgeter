const form = document.getElementById('expense-form');
const needsList = document.getElementById('needs-list');
const wantsList = document.getElementById('wants-list');
const totalNeedsEl = document.getElementById('total-needs');
const totalWantsEl = document.getElementById('total-wants');
const totalOverallEl = document.getElementById('total-overall');

// Fetch and render expenses on page load
document.addEventListener('DOMContentLoaded', fetchExpenses);

async function fetchExpenses() {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();
    renderExpenses(expenses);
}

// Handle Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount, category })
    });

    if (response.ok) {
        form.reset();
        fetchExpenses(); // Refresh lists
    }
});

// Delete an expense
async function deleteExpense(id) {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
}

// Render both lists and calculate totals
function renderExpenses(expenses) {
    needsList.innerHTML = '';
    wantsList.innerHTML = '';

    let totalNeeds = 0;
    let totalWants = 0;

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-info">
                <span class="item-title">${expense.title}</span>
                <span class="item-amount">₹${expense.amount.toFixed(2)}</span>
            </div>
            <button class="delete-btn" onclick="deleteExpense('${expense.id}')">Delete</button>
        `;

        if (expense.category === 'Need') {
            needsList.appendChild(li);
            totalNeeds += expense.amount;
        } else {
            wantsList.appendChild(li);
            totalWants += expense.amount;
        }
    });

    totalNeedsEl.textContent = `₹${totalNeeds.toFixed(2)}`;
    totalWantsEl.textContent = `₹${totalWants.toFixed(2)}`;
    totalOverallEl.textContent = `₹${(totalNeeds + totalWants).toFixed(2)}`;
}