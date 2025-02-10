// src/hooks/useFinancialData.ts
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { z } from 'zod';

// Reuse your Zod schema for validation
const financialSchema = z.object({
  monthlyIncome: z.number(),
  savingsGoal: z.number(),
  housing: z.number(),
  transportation: z.number(),
  food: z.number(),
  utilities: z.number(),
  healthcare: z.number(),
  entertainment: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FinancialData = z.infer<typeof financialSchema>;

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError('User not authenticated');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            const rawData = docSnapshot.data();
            const validatedData = financialSchema.parse({
              ...rawData,
              createdAt: rawData.createdAt?.toDate(),
              updatedAt: rawData.updatedAt?.toDate(),
            });
            setData(validatedData);
          } else {
            setData(null);
          }
          setLoading(false);
        } catch (err) {
          console.error('Data validation error:', err);
          setError('Invalid data format received');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firestore error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { data, loading, error };
};