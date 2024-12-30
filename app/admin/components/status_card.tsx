import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";




export default function StatsCard({
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
    }){
    return (
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
    )
};