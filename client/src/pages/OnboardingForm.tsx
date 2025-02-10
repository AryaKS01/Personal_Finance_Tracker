import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Home, Car, Coffee, Lightbulb, Heart, Film } from 'lucide-react';

// Zod schema for form validation
const financialSchema = z.object({
  monthlyIncome: z.number().min(1, "Monthly income is required"),
  savingsGoal: z.number().min(0, "Savings goal cannot be negative"),
  housing: z.number().min(0, "Cannot be negative"),
  transportation: z.number().min(0, "Cannot be negative"),
  food: z.number().min(0, "Cannot be negative"),
  utilities: z.number().min(0, "Cannot be negative"),
  healthcare: z.number().min(0, "Cannot be negative"),
  entertainment: z.number().min(0, "Cannot be negative"),
});

const expenseCategories = [
  { name: 'housing', label: 'Housing', icon: Home, color: 'bg-purple-100' },
  { name: 'transportation', label: 'Transportation', icon: Car, color: 'bg-blue-100' },
  { name: 'food', label: 'Food', icon: Coffee, color: 'bg-green-100' },
  { name: 'utilities', label: 'Utilities', icon: Lightbulb, color: 'bg-yellow-100' },
  { name: 'healthcare', label: 'Healthcare', icon: Heart, color: 'bg-pink-100' },
  { name: 'entertainment', label: 'Entertainment', icon: Film, color: 'bg-orange-100' },
];

export default function OnboardingForm() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof financialSchema>>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      monthlyIncome: 0,
      savingsGoal: 0,
      housing: 0,
      transportation: 0,
      food: 0,
      utilities: 0,
      healthcare: 0,
      entertainment: 0,
    },
  });

  const handleSaveToFirestore = async (data: z.infer<typeof financialSchema>) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Create/update user document in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        email: user.email,
        displayName: user.displayName,
      });

      setLocation('/dashboard');
    } catch (error) {
      console.error("Firestore save error:", error);
      setFormError(error instanceof Error ? error.message : "Failed to save data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header and Progress Bar */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 inline-block">
            Financial Profile Setup
          </h2>
          <p className="mt-4 text-lg text-gray-600">Let's build your financial future together</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2].map((num) => (
              <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {num}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === 1 ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-xl shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <Form {...form}>
                <form 
                  onSubmit={form.handleSubmit(handleSaveToFirestore)}
                  className="space-y-8"
                >
                  {formError && (
                    <div className="text-red-500 text-center mb-4">
                      {formError}
                    </div>
                  )}

                  {step === 1 ? (
                    <div className="space-y-6">
                      {/* Income and Savings Fields */}
                      <FormField
                        control={form.control}
                        name="monthlyIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Monthly Income
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-8 text-lg py-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-0"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="savingsGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Monthly Savings Goal
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-8 text-lg py-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-0"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Expense Categories */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {expenseCategories.map(({ name, label, icon: Icon, color }) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof z.infer<typeof financialSchema>}
                            render={({ field }) => (
                              <FormItem>
                                <div className="group relative p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                  <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                    <Icon className="h-6 w-6 text-gray-700" />
                                  </div>
                                  <FormLabel className="block text-gray-700 font-medium mb-2">
                                    {label}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        className="pl-8 py-4 rounded-lg border-gray-200"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                      />
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1 py-6 rounded-xl border-2 text-gray-600 hover:text-gray-700 hover:border-blue-300 text-lg font-semibold"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 py-6 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            <>
                              Complete Setup
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Securely processed with bank-level encryption 🔒
        </div>
      </motion.div>
    </div>
  );
}