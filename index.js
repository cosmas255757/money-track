// SELECT ELEMENTS
const trackerForm = document.getElementById('trackerForm');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('typeSelect');

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
    if (type === 'income') {
        totalIncome += amount;
    } else {
        totalExpense += amount;
    }

    const currentBalance = totalIncome - totalExpense;

    // UPDATE THE HTML DISPLAY
    totalIncomeDisplay.innerText = `Total Income: ${totalIncome}`;
    totalExpenseDisplay.innerText = `Total Expense: ${totalExpense}`;
    balanceDisplay.innerText = `Balance: ${currentBalance}`;

    // Optional: Style balance based on value
    balanceDisplay.style.color = currentBalance < 0 ? "red" : "green";

    //RESET FORM
    trackerForm.reset();
    // Keep the logic consistent after reset
    expenseGroup.style.display = 'block';
    incomeGroup.style.display = 'none';
});
