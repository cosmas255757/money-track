// SELECT ELEMENTS
const trackerForm = document.getElementById('trackerForm');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('typeSelect');
const menuIcon = document.getElementById('menuIcon');
const navList = document.getElementById('navList');
const linkDashboard = document.getElementById('linkDashboard');
const linkHistory = document.getElementById('linkHistory');
const pageDashboard = document.getElementById('pageDashboard');
const pageHistory = document.getElementById('pageHistory');
const historyList = document.getElementById('historyList');

// Category Groups
const expenseGroup = document.getElementById('expenseCategoryGroup');
const incomeGroup = document.getElementById('incomeCategoryGroup');

// Display Displays (Matching your exact IDs)
const balanceDisplay = document.getElementById('balanceDisplay');
const totalExpenseDisplay = document.getElementById('totalExpense');
const totalIncomeDisplay = document.getElementById('totalIncome');

// INITIAL TOTALS
let totalIncome = 0;
let totalExpense = 0;

//TOGGLE CATEGORY VISIBILITY (Using Event Listener)
typeSelect.addEventListener('change', function() {
    if (this.value === 'income') {
        expenseGroup.style.display = 'none';
        incomeGroup.style.display = 'block';
    } else if (this.value === 'expense') {
        expenseGroup.style.display = 'block';
        incomeGroup.style.display = 'none';
    }
});

//HANDLE SUBMIT
trackerForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page refresh

    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    // Validation: Ensure a type is selected and amount is valid
    if (type === "#") {
        alert("Please select a valid type (Income or Expense)");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    // CALCULATION LOGIC
    // if (type === 'income') {
    //     totalIncome += amount;
    // } else {
    //     totalExpense += amount;
    // }

    // const currentBalance = totalIncome - totalExpense;

    // UPDATE THE HTML DISPLAY
    // totalIncomeDisplay.innerText = `Total Income: ${totalIncome}`;
    // totalExpenseDisplay.innerText = `Total Expense: ${totalExpense}`;
    // balanceDisplay.innerText = `Balance: ${currentBalance}`;

    //  Style balance based on value
    balanceDisplay.style.color = currentBalance < 0 ? "red" : "green";

    //RESET FORM
    trackerForm.reset();
    // Keep the logic consistent after reset
    expenseGroup.style.display = 'block';
    incomeGroup.style.display = 'none';
});


    // Automatically sets the current year
    document.getElementById('year').textContent = new Date().getFullYear();

// ---- Navigation Logic (Page Switching) ---

// Toggle Menu Dropdown
menuIcon.addEventListener('click', () => {
    navList.classList.toggle('active');
});

// Switch to Dashboard
linkDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    pageDashboard.style.display = 'block';
    pageHistory.style.display = 'none';
    navList.classList.remove('active'); // Close menu
});

// Switch to History
linkHistory.addEventListener('click', (e) => {
    e.preventDefault();
    pageDashboard.style.display = 'none';
    pageHistory.style.display = 'block';
    navList.classList.remove('active'); // Close menu
});

// --- Data Storage ---
// Load data from LocalStorage or start with an empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// --- Functions ---

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

    totalIncomeDisplay.textContent = `Total Income: ${income.toFixed(2)}`;
    totalExpenseDisplay.textContent = `Total Expense: ${expense.toFixed(2)}`;
    balanceDisplay.textContent = `Balance: ${(income - expense).toFixed(2)}`;
}

// Display Transactions in History Page
function renderHistory() {
    historyList.innerHTML = ''; // Clear current list

    if (transactions.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; padding:20px;">No records found.</p>';
        return;
    }

    transactions.forEach((trx, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        // Style based on type
        const color = trx.type === 'income' ? '#2ecc71' : '#e74c3c';
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; 
            background:white; 
            padding:10px; 
            margin:5px; 
            border-left: 5px solid ${color}; 
            border-radius:5px; 
            color: black; 
            font-size: 0.8em;">

                <span><strong>${trx.category}</strong></span>
                <span style="color:${color}">${trx.type === 'income' ? '+' : '-'}${trx.amount}</span>
                <button onclick="deleteTransaction(${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold;">X</button>
            </div>
        `;
        historyList.appendChild(div);
    });
}

// Delete a Transaction
window.deleteTransaction = function(index) {
    transactions.splice(index, 1);
    updateUI();
};

// --- 4. Event Listeners ---

trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const category = type === 'income' ? incomeCategory.value : expenseCategory.value;


    const newTransaction = {
        amount,
        type,
        category,
        date: new Date().toLocaleDateString()
    };

    transactions.push(newTransaction);
    updateUI();
    
    // // Reset Form
    // trackerForm.reset();
    // expenseGroup.style.display = 'block';
    // incomeGroup.style.display = 'none';
    console.log("Transaction Added!")
});

// Initial Load
updateUI();
