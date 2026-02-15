// --- 1. SELECT ELEMENTS ---
const trackerForm = document.getElementById('trackerForm');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('typeSelect');
const expenseCategory = document.getElementById('expenseCategory');
const incomeCategory = document.getElementById('incomeCategory');

const menuIcon = document.getElementById('menuIcon');
const navList = document.getElementById('navList');
const linkDashboard = document.getElementById('linkDashboard');
const linkHistory = document.getElementById('linkHistory');

const pageDashboard = document.getElementById('pageDashboard');
const pageHistory = document.getElementById('pageHistory');
const historyList = document.getElementById('historyList');

const expenseGroup = document.getElementById('expenseCategoryGroup');
const incomeGroup = document.getElementById('incomeCategoryGroup');

const balanceDisplay = document.getElementById('balanceDisplay');
const totalExpenseDisplay = document.getElementById('totalExpense');
const totalIncomeDisplay = document.getElementById('totalIncome');

// --- 2. DATA STORAGE ---
// Load data from LocalStorage or start with empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// --- 3. FUNCTIONS ---

// Save to LocalStorage and Refresh UI
function updateUI() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderHistory();
    calculateTotals();
}

// Calculate Balance, Income, and Expenses
function calculateTotals() {
    let income = 0;
    let expense = 0;

    transactions.forEach(trx => {
        if (trx.type === 'income') income += trx.amount;
        else expense += trx.amount;
    });

    const currentBalance = income - expense;

    totalIncomeDisplay.textContent = `Total Income: ${income.toFixed(2)}`;
    totalExpenseDisplay.textContent = `Total Expense: ${expense.toFixed(2)}`;
    balanceDisplay.textContent = `Balance: ${currentBalance.toFixed(2)}`;
    
    // // Style balance based on value
    // balanceDisplay.style.color = currentBalance < 0 ? "#be9c98" : "#ffffff";
}

// Display Transactions in History Page
function renderHistory() {
    historyList.innerHTML = ''; 

    if (transactions.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; padding:20px; color:white;">No records found.</p>';
        return;
    }

    transactions.forEach((trx, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        const color = trx.type === 'income' ? '#2ecc71' : '#e74c3c';
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; background:white; padding:10px; margin:5px; border-left: 5px solid ${color}; border-radius:5px; color: black; font-size: 0.8em;">
                <span><strong>${trx.category}</strong></span>
                <span style="color:${color}">${trx.type === 'income' ? '+' : '-'}${trx.amount.toFixed(2)}</span>
                <button onclick="deleteTransaction(${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold;">X</button>
            </div>
        `;
        historyList.appendChild(div);
    });
}

// Delete a Transaction
window.deleteTransaction = function(index) {
    if(confirm("Delete this transaction?")) {
        transactions.splice(index, 1);
        updateUI();
    }
};

// --- 4. EVENT LISTENERS ---

// Toggle Category Visibility
typeSelect.addEventListener('change', function() {
    if (this.value === 'income') {
        expenseGroup.style.display = 'none';
        incomeGroup.style.display = 'block';
    } else {
        expenseGroup.style.display = 'block';
        incomeGroup.style.display = 'none';
    }
});

// Handle Form Submission
trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const category = type === 'income' ? incomeCategory.value : expenseCategory.value;

    // Validation
    if (type === "#" || category === "#") {
        alert("Please select a valid type and category");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    const newTransaction = {
        amount,
        type,
        category,
        date: new Date().toLocaleDateString()
    };

    transactions.push(newTransaction);
    updateUI();
    
    // Reset Form
    trackerForm.reset();
    expenseGroup.style.display = 'block';
    incomeGroup.style.display = 'none';
    alert("Transaction Added!");
});

// Toggle Menu Dropdown
menuIcon.addEventListener('click', () => {
    navList.classList.toggle('active');
});

// Navigation: Switch to Dashboard
linkDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    pageDashboard.style.display = 'block';
    pageHistory.style.display = 'none';
    navList.classList.remove('active');
});

// Navigation: Switch to History
linkHistory.addEventListener('click', (e) => {
    e.preventDefault();
    pageDashboard.style.display = 'none';
    pageHistory.style.display = 'block';
    navList.classList.remove('active');
});

// Set Footer Year
document.getElementById('year').textContent = new Date().getFullYear();

// --- 5. INITIAL LOAD ---
updateUI();
