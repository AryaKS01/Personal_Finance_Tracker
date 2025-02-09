import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Home, Car, Coffee, Lightbulb, Heart, Film } from 'lucide-react';

const financialSchema = z.object({
  monthlyIncome: z.string().transform(Number).pipe(z.number().positive()),
  savingsGoal: z.string().transform(Number).pipe(z.number().positive()),
  housing: z.string().transform(Number).pipe(z.number().min(0)),
  transportation: z.string().transform(Number).pipe(z.number().min(0)),
  food: z.string().transform(Number).pipe(z.number().min(0)),
  utilities: z.string().transform(Number).pipe(z.number().min(0)),
  healthcare: z.string().transform(Number).pipe(z.number().min(0)),
  entertainment: z.string().transform(Number).pipe(z.number().min(0)),
});

const expenseCategories = [
  { name: 'housing', label: 'Housing', icon: Home, description: 'Rent, mortgage, or property maintenance' },
  { name: 'transportation', label: 'Transportation', icon: Car, description: 'Vehicle expenses, fuel, or public transport' },
  { name: 'food', label: 'Food', icon: Coffee, description: 'Groceries and dining out' },
  { name: 'utilities', label: 'Utilities', icon: Lightbulb, description: 'Electricity, water, and internet bills' },
  { name: 'healthcare', label: 'Healthcare', icon: Heart, description: 'Medical expenses and insurance' },
  { name: 'entertainment', label: 'Entertainment', icon: Film, description: 'Movies, hobbies, and leisure activities' },
];

export default function OnboardingForm() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  
  const form = useForm<z.infer<typeof financialSchema>>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      monthlyIncome: '',
      savingsGoal: '',
      housing: '',
      transportation: '',
      food: '',
      utilities: '',
      healthcare: '',
      entertainment: '',
    },
  });

  function onSubmit(values: z.infer<typeof financialSchema>) {
    // Mock submission - redirect to dashboard
    setLocation('/dashboard');
  }

  const progress = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Financial Profile Setup</h2>
          <p className="mt-2 text-gray-600">Let's understand your financial situation better</p>
        </div>

        <Progress value={progress} className="mb-8" />

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 ? (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="savingsGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Savings Goal</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {expenseCategories.map(({ name, label, icon: Icon, description }) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name as keyof z.infer<typeof financialSchema>}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {label}
                              </FormLabel>
                              <p className="text-sm text-gray-500">{description}</p>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                        Complete Setup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
