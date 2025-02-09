import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

export default function DashboardMetricCard({ title, value, change, trend, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <dt>
            <div className="absolute rounded-md bg-indigo-50 p-3">
              <Icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{title}</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {change}
            </p>
          </dd>
        </div>
      </CardContent>
    </Card>
  );
}
