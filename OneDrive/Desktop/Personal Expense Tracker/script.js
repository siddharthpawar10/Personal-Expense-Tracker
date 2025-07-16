let expenses = [];
let budget = 0;

function setBudget() {
  const budgetInput = document.getElementById("budget").value;
  budget = parseFloat(budgetInput) || 0;
  updateRemaining();
}

function addExpense() {
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter valid expense details.");
    return;
  }

  expenses.push({ description, amount, category });
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  updateExpenses();
  updateChart();
  updateRemaining();
}

function updateExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";
  expenses.forEach((expense) => {
    const li = document.createElement("li");
    li.textContent = `${expense.description} - ₹${expense.amount.toFixed(2)} (${expense.category})`;
    list.appendChild(li);
  });
}

function updateRemaining() {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(0, budget - totalSpent);
  document.getElementById("remaining").textContent = `Remaining Budget: ₹${remaining.toFixed(2)}`;
}

function updateChart() {
  const categorySums = {};

  expenses.forEach((expense) => {
    categorySums[expense.category] = (categorySums[expense.category] || 0) + expense.amount;
  });

  const labels = Object.keys(categorySums);
  const data = Object.values(categorySums);

  if (window.expenseChart) {
    window.expenseChart.data.labels = labels;
    window.expenseChart.data.datasets[0].data = data;
    window.expenseChart.update();
    return;
  }

  const ctx = document.getElementById("expense-chart").getContext("2d");
  window.expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data,
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#9b59b6", "#4bc0c0"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
    },
  });
}
