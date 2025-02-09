import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const budgetData = [
  { name: "Housing", value: 1450, total: 1500, color: "#FF4D4D" },
  { name: "Food", value: 580, total: 600, color: "#FFA500" },
  { name: "Transportation", value: 385, total: 400, color: "#00C49F" },
  { name: "Utilities", value: 290, total: 300, color: "#6366F1" },
  { name: "Entertainment", value: 220, total: 200, color: "#A855F7" },
  { name: "Healthcare", value: 150, total: 300, color: "#EC4899" },
];

const totalBudget = 3300;
const totalSpent = 3075;
const remaining = totalBudget - totalSpent;
const pieData = [
  { name: "Spent", value: totalSpent, color: "#FF4D4D" },
  { name: "Remaining", value: remaining, color: "#00C49F" },
];

const BudgetChart = () => {
  return (
    <div className="flex flex-row items-center p-6 bg-white rounded-lg shadow-md max-w-6xl">
      {/* Bar Chart - Budget Categories */}
      <div style={{ width: '40%', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px', backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
        <h2 className="text-xl font-bold mb-4 text-center">Budget Categories</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={budgetData} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#d1d5db" name="Total Budget" barSize={14} />
            <Bar dataKey="value" fill={({ payload }) => payload.color} name="Spent" barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Budget Summary */}
      <div style={{ width: '40%', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginLeft: '16px' }}>
        <h2 className="text-xl font-bold text-center">Budget Summary</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: $${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <p className="text-lg font-semibold text-gray-700">Remaining: ${remaining.toFixed(2)}</p>
          <p className="text-gray-500">Total Budget: ${totalBudget}</p>
          <p className="text-gray-500">Total Spent: ${totalSpent} ({((totalSpent / totalBudget) * 100).toFixed(1)}%)</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
