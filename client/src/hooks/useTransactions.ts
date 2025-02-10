// hooks/useTransactions.ts
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

interface Transaction {
  id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
  status: 'completed' | 'pending' | 'cancelled';
}

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await addDoc(collection(db, 'users', userId, 'transactions'), transaction);
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    await updateDoc(doc(db, 'users', userId, 'transactions', id), transaction);
  };

  const deleteTransaction = async (id: string) => {
    await deleteDoc(doc(db, 'users', userId, 'transactions', id));
  };

  return { transactions, loading, addTransaction, updateTransaction, deleteTransaction };
};