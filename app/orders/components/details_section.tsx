import React, { useRef, useEffect, useState } from 'react';
import { 
  Boxes, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  ShieldX, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
 * @param props StatCardProps containing the card's data and styling information
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
  // Animation visibility state
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate percentage of total orders
  const percentage = totalOrders > 0 ? Math.round((value * 100) / totalOrders) : 0;
  
  // Color classes for different states
  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      hover: 'hover:border-green-200',
      light: 'bg-green-50'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      hover: 'hover:border-yellow-200',
      light: 'bg-yellow-50'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-500',
      hover: 'hover:border-red-200',
      light: 'bg-red-50'
    },
    emerald: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-500',
      hover: 'hover:border-emerald-200',
      light: 'bg-emerald-50'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-500',
      hover: 'hover:border-orange-200',
      light: 'bg-orange-50'
    }
  };

  // Extract color name from the color prop
  const colorName = color.split('-')[1] as keyof typeof colorClasses;
  const colorClass = colorClasses[colorName];

  // Initialize animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`
            p-6 
            relative 
            overflow-hidden 
            group 
            hover:shadow-lg 
            transition-all 
            duration-300 
            min-w-[300px] 
            shadow-none
            border
            transform hover:-translate-y-1
            snap-center
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}>
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
              <div className="h-2 rounded-full overflow-hidden bg-gray-100">
                <div 
                  className={`
                    h-full 
                    ${colorClass.bg}
                    transition-all 
                    duration-1000 
                    ease-out
                  `}
                  style={{ width: `${isVisible ? percentage : 0}%` }}
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
 * @param props Object containing form data with order statistics
 */
export default function OrdersDashboard({ formData }: { formData: FormDataInterface }) {
  // Refs and state for scroll functionality
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Stats configuration with mock trend data
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

  /**
   * Updates the visibility state of scroll buttons based on scroll position
   */
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Initialize scroll button visibility and handle window resizing
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  /**
   * Handles horizontal scrolling of the stats cards
   * @param direction 'left' or 'right' scroll direction
   */
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const targetScroll = scrollRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

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
      <div className="relative" role="region" aria-label="Order Statistics">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth pb-4 snap-x snap-mandatory px-6 py-4" 
          onScroll={checkScrollButtons}
        >
          {stats.map((stat) => (
            <InformationTag
              key={stat.title}
              {...stat}
              totalOrders={formData.totalItem}
            />
          ))}
        </div>
        
        {/* Scroll Controls */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 shadow-lg"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 shadow-lg"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
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