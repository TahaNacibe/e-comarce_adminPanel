'use client';

import { useEffect, useState, useMemo } from 'react';
import StaticsServices from '../services/statics-services/statics_services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Package, Tag, TrendingUp, Users, DollarSign, ChevronUp, ChevronDown } from "lucide-react";
import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// ... previous interfaces remain the same ...

interface PopularityItem {
    name: string;
    count: number;
    percentage: number;
}

// Base entity types
interface Tag {
    id: string;
    name: string;
    description: string;
    parentId: string | null;
    parentTag?: Tag;
    productsIds: string[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

// Statistics types
interface ShopStatistics {
    message: string;
    ordersByTime: { [key: string]: number };
    productCounts: { [key: string]: number };
    productsData: Product[];
    tagCounts: { [key: string]: number };
    tagsData: Tag[];
}

// Component props types
interface PopularityItem {
    name: string;
    count: number;
    percentage: number;
}

interface PopularityCardProps {
    title: string;
    subtitle?: string;
    items: PopularityItem[];
}

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
}

// Chart data types
interface OrderChartData {
    date: string;
    orders: number;
}

interface ChartDataPoint {
    name: string;
    orders: number;
}

// Dashboard metrics and state types
interface DashboardMetrics {
    totalOrders: number;
    avgOrders: number;
}

interface OrderTrends {
    growth: number;
    trend: 'up' | 'down' | 'neutral';
}

interface DashboardState {
    orderChartData: OrderChartData[];
    popularProducts: PopularityItem[];
    popularTags: PopularityItem[];
    metrics: DashboardMetrics;
    orderTrends: OrderTrends;
}

const PopularityCard = ({ 
    title, 
    subtitle,
    items 
}: { 
    title: string;
    subtitle?: string;
    items: PopularityItem[];
}) => (
    <Card className="col-span-1">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100/10 text-blue-600 text-xs font-medium">
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium truncate max-w-[200px]" title={item.name}>
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-sm font-semibold">{item.count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const StatsCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend = 'neutral'
}: {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium ">{title}</CardTitle>
            <Icon className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-gray-600">{value}</div>
            {typeof change !== 'undefined' && (
                <div className="flex items-center space-x-1 text-sm">
                    {trend !== 'neutral' && (
                        <span className={`inline-flex items-center ${
                            trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {trend === 'up' ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </span>
                    )}
                    <span className={`font-medium ${
                        trend === 'up' ? 'text-green-600' : 
                        trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                    }`}>
                        {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="text-gray-600">vs. last period</span>
                </div>
            )}
        </CardContent>
    </Card>
);

export default function AdminPanel() {
    const [statsData, setStatsData] = useState<ShopStatistics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const staticsServices = new StaticsServices();

    const ordersChartConfig = {
        orders: {
            label: "Orders",
            color: "#2563eb",
        }
    } satisfies ChartConfig;

    const productsChartConfig = {
        orders: {
            label: "Orders",
            color: "#2563eb",
        }
    } satisfies ChartConfig;

    
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                const data = await staticsServices.getShopStaticsAndData();
                setStatsData(data);
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const {
        orderChartData,
        popularProducts,
        popularTags,
        metrics,
        orderTrends
    } = useMemo(() => {
        if (!statsData) return {
            orderChartData: [],
            popularProducts: [],
            popularTags: [],
            metrics: { totalOrders: 0, avgOrders: 0 },
            orderTrends: { growth: 0, trend: 'neutral' as const }
        };

        // Order chart data
        const chartData = Object.entries(statsData.ordersByTime).map(([date, value]) => ({
            date,
            orders: value
        }));

        // Calculate product popularity with actual names
        const productPopularity: PopularityItem[] = Object.entries(statsData.productCounts)
            .map(([id, count]) => {
                const product = statsData.productsData.find(p => p.id === id);
                return {
                    name: product?.name || 'Product Was Deleted',
                    count,
                    percentage: 0
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const maxProductCount = Math.max(...productPopularity.map(p => p.count));
        productPopularity.forEach(p => {
            p.percentage = (p.count / maxProductCount) * 100;
        });

        // Calculate tag popularity with actual names
        const tagPopularity: PopularityItem[] = Object.entries(statsData.tagCounts)
            .map(([id, count]) => {
                const tag = statsData.tagsData.find(t => t.id === id);
                return {
                    name: tag?.name || 'Tag Was Deleted',
                    count,
                    percentage: 0
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const maxTagCount = Math.max(...tagPopularity.map(t => t.count));
        tagPopularity.forEach(t => {
            t.percentage = (t.count / maxTagCount) * 100;
        });

        // Calculate metrics and trends as before...
        const totalOrders = Object.values(statsData.ordersByTime).reduce((sum, count) => sum + count, 0);
        const avgOrders = totalOrders / Math.max(Object.keys(statsData.ordersByTime).length, 1);
        const orderValues = Object.values(statsData.ordersByTime);
        const growth = orderValues.length > 1 
            ? ((orderValues[orderValues.length - 1] - orderValues[0]) / orderValues[0]) * 100
            : 0;

        return {
            orderChartData: chartData,
            popularProducts: productPopularity,
            popularTags: tagPopularity,
            metrics: { totalOrders, avgOrders },
            orderTrends: {
                growth,
                trend: growth > 0 ? 'up' as const : growth < 0 ? 'down' as const : 'neutral' as const
            }
        };
    }, [statsData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <div className="text-lg font-medium text-gray-600">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Monitor your store's performance and analytics</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Orders"
                        value={metrics.totalOrders}
                        change={orderTrends.growth}
                        icon={TrendingUp}
                        trend={orderTrends.trend}
                    />
                    <StatsCard
                        title="Average Daily Orders"
                        value={metrics.avgOrders.toFixed(1)}
                        icon={Users}
                    />
                    <StatsCard
                        title="Total Products"
                        value={statsData?.productsData.length || 0}
                        icon={Package}
                    />
                    <StatsCard
                        title="Active Tags"
                        value={statsData?.tagsData.length || 0}
                        icon={Tag}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Orders Overview</CardTitle>
                            <CardDescription>Daily order volume over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={ordersChartConfig} className="min-h-[400px] w-full">
                                <BarChart accessibilityLayer data={orderChartData}>
                                    <Bar 
                                        dataKey="orders" 
                                        fill="var(--color-orders)" 
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PopularityCard 
                        title="Top Selling Products"
                        subtitle="Most ordered products in your store"
                        items={popularProducts}
                    />
                    <PopularityCard 
                        title="Most Used Tags"
                        subtitle="Popular categories and labels"
                        items={popularTags}
                    />
                </div>
            </div>
        </div>
    );
}