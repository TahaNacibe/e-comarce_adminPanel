'use client';

import { useEffect, useState, useMemo } from 'react';
import StaticsServices from '../services/statics-services/statics_services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Package, Tag, TrendingUp, Users} from "lucide-react";
import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PopularityItem, ShopStatistics } from './types';
import PopularityCard from './components/popelarity_card';
import StatsCard from './components/status_card';






export default function AdminPanel() {
    //* manage state
    const [statsData, setStatsData] = useState<ShopStatistics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    //* instates
    const staticsServices = new StaticsServices();

    //* hooks
    const { data: session } = useSession()
    const router = useRouter()

    //* consts
    const ordersChartConfig = {
        orders: {
            label: "Orders",
            color: "#2563eb",
        }
    } satisfies ChartConfig;


    //* functions
    const getDetailsForDashBoard = async () => {
        if (session) {
             //* check if user have access before loading data
            if (session.user.role !== "ADMIN" && session.user.role !== "SUB_ADMIN" && session.user.role !== "DEVELOPER") {
            router.push("/unauthorized-access")
            return;
            }
            setLoading(true);
            const response = await staticsServices.getShopStaticsAndData();
            if (response.succuss) {
                setStatsData(response.data)
            }
            setLoading(false)

        }
    }

    //* initial load
    useEffect(() => {
        getDetailsForDashBoard()
    }, [session]);


    //* create required data
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









    //* loading page
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



    //* ui tree
    return (
        <div className="min-h-screen">
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Monitor your store&apos;s performance and analytics</p>
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

                
                {/* charts */}
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

                
                {/* cards */}
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