import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  ShieldX,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define type for trend data
type TrendDirection = 'up' | 'down' | 'neutral';

// Props interface for the stat cards
interface StatCardProps {
  title: string;
  value: number;
  totalOrders: number;
  Icon: React.ElementType;
  color: string;
  description?: string;
  trend?: {
    direction: TrendDirection;
    value: number;
  };
}

// Main data interface
interface FormDataInterface {
  totalItem: number;
  completedOrders: number;
  pendingOrders: number;
  canceledOrders: number;
  totalVerifiedItems: number;
  totalUnVerifiedItems: number;
}

/**
 * Individual stat card component that displays a single metric
 */
const InformationTag = ({ 
  title, 
  value, 
  totalOrders, 
  Icon, 
  color,
  description,
  trend 
}: StatCardProps) => {
  // Calculate percentage of total orders
  const percentage = totalOrders > 0 ? Math.round((value * 100) / totalOrders) : 0;
  
  // Color classes for different states
  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      hover: 'hover:border-green-200',
      light: 'bg-green-50/10'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      hover: 'hover:border-yellow-200',
      light: 'bg-yellow-50/10'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-500',
      hover: 'hover:border-red-200',
      light: 'bg-red-50/10'
    },
    emerald: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-500',
      hover: 'hover:border-emerald-200',
      light: 'bg-emerald-50/10'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-500',
      hover: 'hover:border-orange-200',
      light: 'bg-orange-50/10'
    }
  };

  const colorName = color.split('-')[1] as keyof typeof colorClasses;
  const colorClass = colorClasses[colorName];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 shadow-none border transform hover:-translate-y-1 h-full">
            {/* Header section */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {title}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold tracking-tight">
                    {value.toLocaleString()}
                  </p>
                  {trend && (
                    <div className={`
                      flex items-center gap-1 text-sm
                      ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}
                    `}>
                      {trend.direction === 'up' ? 
                        <ArrowUpRight className="w-4 h-4" /> : 
                        <ArrowDownRight className="w-4 h-4" />
                      }
                      {trend.value}%
                    </div>
                  )}
                </div>
              </div>
              <div className={`
                ${colorClass.light}
                p-3 
                rounded-lg
                group-hover:scale-110 
                transition-transform
              `}>
                <Icon className={`${colorClass.text} w-6 h-6`} />
              </div>
            </div>
            
            {/* Progress bar section */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-gray-100/10">
                <div 
                  className={`h-full ${colorClass.bg} transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {value} out of {totalOrders.toLocaleString()} total orders
              </p>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description || `${title} orders: ${value.toLocaleString()}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Main dashboard component that displays order statistics
 */
export default function OrdersDashboard({ formData }: { formData: FormDataInterface }) {
  const stats = [
    {
      title: "Completed Orders",
      value: formData.completedOrders,
      Icon: CheckCircle,
      color: "text-green-500",
      description: "Successfully completed orders",
      trend: { direction: 'up' as const, value: 12 }
    },
    {
      title: "Pending Orders",
      value: formData.pendingOrders,
      Icon: Clock,
      color: "text-yellow-500",
      description: "Orders awaiting processing",
      trend: { direction: 'down' as const, value: 5 }
    },
    {
      title: "Canceled Orders",
      value: formData.canceledOrders,
      Icon: XCircle,
      color: "text-red-500",
      description: "Orders that were canceled",
      trend: { direction: 'up' as const, value: 3 }
    },
    {
      title: "Verified Orders",
      value: formData.totalVerifiedItems,
      Icon: ShieldCheck,
      color: "text-emerald-500",
      description: "Orders verified by our system",
      trend: { direction: 'up' as const, value: 8 }
    },
    {
      title: "Unverified Orders",
      value: formData.totalUnVerifiedItems,
      Icon: ShieldX,
      color: "text-orange-500",
      description: "Orders pending verification",
      trend: { direction: 'down' as const, value: 2 }
    }
  ];

  // Calculate total percentage complete
  const totalComplete = Math.round(
    (formData.completedOrders / formData.totalItem) * 100
  );

  return (
    <div className="space-y-8 rounded-xl">
      {/* Summary Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Statistics</h2>
          <p className="text-muted-foreground">
            Overview of order processing status and verification
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Completion</p>
          <p className="text-3xl font-bold">{totalComplete}%</p>
        </div>
      </div>

      {/* Stats Cards Carousel */}
      <div className="px-6">
        <Carousel
          opts={{
            align: "start",
            loop: true
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {stats.map((stat, index) => (
              <CarouselItem key={stat.title} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <InformationTag
                  {...stat}
                  totalOrders={formData.totalItem}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-2 gap-4 mt-6 px-6 py-4">
        <Card className="p-4 shadow-none">
          <h3 className="text-sm font-medium text-muted-foreground">
            Processing Efficiency
          </h3>
          <p className="text-2xl font-bold mt-2">
            {Math.round((formData.completedOrders / 
              (formData.completedOrders + formData.pendingOrders)) * 100)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Orders completed vs pending
          </p>
        </Card>
        <Card className="p-4 shadow-none">
          <h3 className="text-sm font-medium text-muted-foreground">
            Verification Rate
          </h3>
          <p className="text-2xl font-bold mt-2">
            {Math.round((formData.totalVerifiedItems / formData.totalItem) * 100)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Orders verified vs total
          </p>
        </Card>
      </div>
    </div>
  );
}