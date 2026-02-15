/**
 * --- 1. STATE MANAGEMENT ---
 */
const state = {
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],
    monthlyBudget: parseFloat(localStorage.getItem('monthlyBudget')) || 0
};

const dom = {
    // Forms
    trackerForm: document.getElementById('trackerForm'),
    budgetForm: document.getElementById('budgetForm'),
    
    // Inputs
    amount: document.getElementById('amount'),
    type: document.getElementById('typeSelect'),
    expenseCat: document.getElementById('expenseCategory'),
    incomeCat: document.getElementById('incomeCategory'),
    budgetLimit: document.getElementById('budgetLimit'),
    
    // UI Elements
    expenseGrp: document.getElementById('expenseCategoryGroup'),
    incomeGrp: document.getElementById('incomeCategoryGroup'),
    balance: document.getElementById('balanceDisplay'),
    totalExp: document.getElementById('totalExpense'),
    totalInc: document.getElementById('totalIncome'),
    historyList: document.getElementById('historyList'),
    activeBudget: document.getElementById('activeBudgetLimit'),
    budgetCard: document.querySelector('.budget-card'),
    
    // Navigation
    menuIcon: document.getElementById('menuIcon'),
    navList: document.getElementById('navList'),
    pages: document.querySelectorAll('.content-page')
};

/**
 * --- 2. UTILITIES ---
 */
const formatCurrency = (num) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
}).format(num);

/**
 * --- 3. CORE LOGIC ---
 */

const calculateTotals = () => {
    const totals = state.transactions.reduce((acc, trx) => {
        acc[trx.type] += trx.amount;
        return acc;
    }, { income: 0, expense: 0 });

    const balance = totals.income - totals.expense;

    // Update Stats Display
    dom.totalInc.textContent = `Total Income: ${formatCurrency(totals.income)}`;
    dom.totalExp.textContent = `Total Expense: ${formatCurrency(totals.expense)}`;
    dom.balance.textContent = `Balance: ${formatCurrency(balance)}`;
    
    // Update Budget Page Display
    if (dom.activeBudget) {
        dom.activeBudget.textContent = formatCurrency(state.monthlyBudget);
    }

    // Handle Over-Budget Warnings
    const isOverBudget = state.monthlyBudget > 0 && totals.expense > state.monthlyBudget;
    
    dom.balance.style.color = isOverBudget ? "#e74c3c" : "inherit";
    
    if (isOverBudget) {
        dom.budgetCard?.classList.add('budget-over');
    } else {
        dom.budgetCard?.classList.remove('budget-over');
    }
};

const renderHistory = () => {
    if (state.transactions.length === 0) {
        dom.historyList.innerHTML = `<div style="text-align:center; padding:20px; color:white;">No records found.</div>`;
        return;
    }

    // Latest transactions on top
    const sortedTrx = [...state.transactions].reverse();

    dom.historyList.innerHTML = sortedTrx.map((trx, index) => {
        const actualIndex = state.transactions.length - 1 - index;
        const isInc = trx.type === 'income';
        const color = isInc ? '#2ecc71' : '#e74c3c';
        
        return `
            <div class="history-item" style="display:flex; justify-content:space-between; background:white; padding:12px; margin:8px 0; border-left: 5px solid ${color}; border-radius:8px; color: black;">
                <div style="display:flex; flex-direction:column">
                    <strong>${trx.category.toUpperCase()}</strong>
                    <small style="color:gray">${trx.date}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px">
                    <span style="color:${color}; font-weight:bold">${isInc ? '+' : '-'}${formatCurrency(trx.amount)}</span>
                    <button onclick="deleteTransaction(${actualIndex})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:1.2rem;">&times;</button>
                </div>
            </div>
        `;
    }).join('');
};

const updateApp = () => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
    localStorage.setItem('monthlyBudget', state.monthlyBudget);
    calculateTotals();
    renderHistory();
};

/**
 * --- 4. EVENT LISTENERS ---
 */

// Navigation Logic
const navLinks = {
    'linkDashboard': 'pageDashboard',
    'linkHistory': 'pageHistory',
    'linkBudget': 'pageBudget'
};

Object.entries(navLinks).forEach(([linkId, pageId]) => {
    const linkEl = document.getElementById(linkId);
    if (linkEl) {
        linkEl.addEventListener('click', (e) => {
            e.preventDefault();
            dom.pages.forEach(p => p.style.display = 'none');
            document.getElementById(pageId).style.display = 'block';
            dom.navList.classList.remove('active');
        });
    }
});

// Category Toggle
dom.type.addEventListener('change', (e) => {
    const isIncome = e.target.value === 'income';
    dom.incomeGrp.style.display = isIncome ? 'block' : 'none';
    dom.expenseGrp.style.display = isIncome ? 'none' : 'block';
});

// Transaction Submission
dom.trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(dom.amount.value);
    const type = dom.type.value;
    const category = type === 'income' ? dom.incomeCat.value : dom.expenseCat.value;

    if (!amount || type === "#" || category === "#") {
        alert("Please select a valid type and category.");
        return;
    }

    state.transactions.push({
        id: Date.now(),
        amount,
        type,
        category,
        date: new Date().toLocaleDateString()
    });

    updateApp();
    dom.trackerForm.reset();
    dom.type.dispatchEvent(new Event('change')); // Reset UI groups
});

// Budget Submission
dom.budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const limit = parseFloat(dom.budgetLimit.value);
    
    if (isNaN(limit) || limit < 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    state.monthlyBudget = limit;
    updateApp();
    dom.budgetLimit.value = "";
    alert(`Budget set to ${formatCurrency(limit)}`);
});

// Global Delete Function
window.deleteTransaction = (index) => {
    if (confirm("Delete this transaction?")) {
        state.transactions.splice(index, 1);
        updateApp();
    }
};

// Menu & Footer
dom.menuIcon.addEventListener('click', () => dom.navList.classList.toggle('active'));
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize App
updateApp();
