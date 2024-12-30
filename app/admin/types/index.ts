

export interface PopularityItem {
    name: string;
    count: number;
    percentage: number;
}

// Base entity types
export interface Tag {
    id: string;
    name: string;
    description: string;
    parentId: string | null;
    parentTag?: Tag;
    productsIds: string[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

// Statistics types
export interface ShopStatistics {
    message: string;
    ordersByTime: { [key: string]: number };
    productCounts: { [key: string]: number };
    productsData: Product[];
    tagCounts: { [key: string]: number };
    tagsData: Tag[];
}

// Component props types
export interface PopularityItem {
    name: string;
    count: number;
    percentage: number;
}

export interface PopularityCardProps {
    title: string;
    subtitle?: string;
    items: PopularityItem[];
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
}

// Chart data types
export interface OrderChartData {
    date: string;
    orders: number;
}

export interface ChartDataPoint {
    name: string;
    orders: number;
}

// Dashboard metrics and state types
export interface DashboardMetrics {
    totalOrders: number;
    avgOrders: number;
}

export interface OrderTrends {
    growth: number;
    trend: 'up' | 'down' | 'neutral';
}

export interface DashboardState {
    orderChartData: OrderChartData[];
    popularProducts: PopularityItem[];
    popularTags: PopularityItem[];
    metrics: DashboardMetrics;
    orderTrends: OrderTrends;
}