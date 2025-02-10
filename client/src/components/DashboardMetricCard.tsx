import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string; // Made optional for loading state
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  isLoading?: boolean;
}

export default function DashboardMetricCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon: Icon,
  isLoading = false
}: MetricCardProps) {
  // Loading state skeleton
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="pt-6">
          <div className="relative">
            <div className="absolute rounded-md bg-gray-200 p-3">
              <div className="h-6 w-6 bg-gray-300 rounded-full" />
            </div>
            <div className="ml-16 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine trend styling
  const trendStyles = {
    up: { color: 'text-green-600', icon: TrendingUp },
    down: { color: 'text-red-600', icon: TrendingDown },
    neutral: { color: 'text-gray-400', icon: TrendingUp }
  };

  const TrendIcon = trendStyles[trend].icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="relative">
          <dt>
            <div className={`absolute rounded-md p-3 ${
              trend === 'up' ? 'bg-green-50' : 
              trend === 'down' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <Icon className={`h-6 w-6 ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 'text-gray-400'
              }`} />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500">{title}</p>
          </dt>
          <dd className="ml-16 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center text-sm font-semibold ${trendStyles[trend].color}`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                <span>{change}</span>
              </div>
            )}
          </dd>
        </div>
      </CardContent>
    </Card>
  );
}