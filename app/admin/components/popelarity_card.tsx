import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PopularityItem } from "../types";


export default function PopularityCard ({ 
    title, 
    subtitle,
    items 
}: { 
    title: string;
    subtitle?: string;
    items: PopularityItem[];
    }) {
    return (
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
    )
};


