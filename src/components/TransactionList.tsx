import React from 'react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { mockTransactions } from '@/lib/mockData';

interface TransactionListProps {
  limit?: number;
}

export default function TransactionList({ limit }: TransactionListProps) {
  const transactions = limit ? mockTransactions.slice(0, limit) : mockTransactions;

  return (
    <div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
            >
              <div>
                <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className={`text-right ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                <p className="font-medium">
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {limit && (
        <div className="mt-4 text-center">
          <Link href="/transactions">
            <Button variant="outline" className="w-full">
              View All Transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}