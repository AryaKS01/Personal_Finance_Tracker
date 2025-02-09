import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', income: 4500, expenses: 3200, savings: 1300 },
  { month: 'Feb', income: 4700, expenses: 3300, savings: 1400 },
  { month: 'Mar', income: 4900, expenses: 3400, savings: 1500 },
  { month: 'Apr', income: 4800, expenses: 3500, savings: 1300 },
  { month: 'May', income: 5100, expenses: 3600, savings: 1500 },
  { month: 'Jun', income: 5300, expenses: 3700, savings: 1600 },
];

export default function Reports() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-5xl bg-white border-2 border-black p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Cash Flow Analysis</h2>
        <div style={{width:'50%', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px', backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="blue" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="expenses" stroke="red" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="savings" stroke="green" dot={{ r: 4 }} />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
