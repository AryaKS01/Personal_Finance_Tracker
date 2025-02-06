import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Transactions({ transactions = [] }) {
  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {recentTransactions.map((transaction, idx) => (
          <li key={transaction.id}>
            <div className="relative pb-8">
              {idx !== recentTransactions.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {transaction.type === 'expense' ? '−' : '+'}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {transaction.description} 
                      <span className={`ml-2 font-medium ${
                        transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                      </span>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={transaction.date}>
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          to="/transactions"
          className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          View All Transactions
        </Link>
      </div>
    </div>
  );
}