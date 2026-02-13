const projects = [
  { id: 1, title: "AI Research Paper", status: "Completed", hours: 36 },
  { id: 2, title: "Web App Frontend", status: "Pending", hours: 24 },
  { id: 3, title: "ML Model Training", status: "Completed", hours: 48 },
  { id: 4, title: "Database Design", status: "Pending", hours: 30 },
  { id: 5, title: "UI/UX Prototype", status: "Completed", hours: 20 },
];

const completedTasks = projects.filter(
  (project) => project.status === "Completed"
);

const pendingTasks = projects.filter(
  (project) => project.status === "Pending"
);

console.log("Completed Tasks:", completedTasks);
console.log("Pending Tasks:", pendingTasks);

const prices = [1200, 850, 499, 2500, 150]; 
const taxRate = 0.18; 

const pricesWithTax = prices.map(
  (price) => Number((price + price * taxRate).toFixed(2))
);

console.log("Prices with Tax:", pricesWithTax);

const expenses = [500, 1200, 350, 800, 100];

const totalBudget = expenses.reduce(
  (total, expense) => total + expense,
  0
);

console.log("Total Company Budget:", totalBudget);

const totalHours = projects.reduce(
  (sum, project) => sum + project.hours,
  0
);

const averageHours = (totalHours / projects.length).toFixed(2);

console.log("Average Hours/Project:", averageHours);

