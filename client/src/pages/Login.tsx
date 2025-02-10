import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Check if email is verified
      if (userCredential.user.emailVerified) {
        setLocation("/dashboard");
      } else {
        setLocation("/verifymail");
      }
    } catch (error) {
      console.error(error);

      let errorMessage = "Login failed. Please try again.";

      if (error instanceof Error && "code" in error) {
        switch ((error as any).code) { // Explicitly cast error to `any`
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            form.setError("email", { message: errorMessage });
            break;
          case "auth/user-not-found":
            errorMessage = "User not found. Please register first";
            form.setError("email", { message: errorMessage });
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password";
            form.setError("password", { message: errorMessage });
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many attempts. Try again later";
            form.setError("root", { message: errorMessage });
            break;
          default:
            form.setError("root", { message: errorMessage });
        }
      } else {
        console.error("An unknown error occurred", error);
        form.setError("root", { message: errorMessage });
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                onClick={() => setLocation('/register')}
                className="text-blue-600 hover:underline"
              >
                Register here
              </button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


