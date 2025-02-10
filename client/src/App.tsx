import { Switch, Route } from 'wouter';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import OnboardingForm from "@/pages/OnboardingForm";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Transactions from "@/pages/Transactions";
import SavingsGoals from './pages/Savings';
// import Budget from './pages/Budget';
import Budgets from './pages/Budget';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import VerifyEmail from './pages/VerifyEmail';

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/onboarding" component={OnboardingForm} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/savings" component={SavingsGoals} />
      <Route path ="/budget" component={Budgets} />
      <Route path="/settings" component={Settings} />
      <Route path="/reports" component={Reports} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route component={NotFound} /> 
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;